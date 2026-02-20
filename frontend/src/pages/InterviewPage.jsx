import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { Model as MyAvatar } from '../MyAvatar'
import { startInterview, getNextQuestion, getAnswerFeedback, generateReview } from '../services/interviewService'
import ChatBubble from '../components/ChatBubble'
import ReviewPanel from '../components/ReviewPanel'
import { FiMic, FiMicOff, FiSquare, FiArrowLeft, FiPlay, FiTrendingUp, FiAlertCircle, FiZap } from 'react-icons/fi'

export default function InterviewPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const { role, experience, topic } = location.state || {}

    // User must click "Begin" to unlock TTS (Chrome autoplay policy)
    const [hasBegun, setHasBegun] = useState(false)

    // Core state
    const [messages, setMessages] = useState([])
    const [feedbacks, setFeedbacks] = useState([])
    const [review, setReview] = useState(null)
    const [isInterviewEnded, setIsInterviewEnded] = useState(false)
    const [questionCount, setQuestionCount] = useState(0)
    const [showDetailedReview, setShowDetailedReview] = useState(false)

    // Avatar state
    const [speaking, setSpeaking] = useState(false)
    const [emotion, setEmotion] = useState(0)

    // Mic state
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Refs
    const recognitionRef = useRef(null)
    const chatEndRef = useRef(null)

    // Redirect if no state
    useEffect(() => {
        if (!role || !experience || !topic) {
            navigate('/')
        }
    }, [role, experience, topic, navigate])

    // Scroll to latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Speak text using Web Speech API TTS
    const speakText = useCallback((text) => {
        return new Promise((resolve) => {
            if (!text || text.trim().length === 0) {
                resolve()
                return
            }

            const synth = window.speechSynthesis
            synth.cancel()

            // Small delay after cancel so engine resets
            setTimeout(() => {
                const utterance = new SpeechSynthesisUtterance(text)
                utterance.rate = 0.93
                utterance.pitch = 1.05
                utterance.volume = 1.0

                // Pick the best English voice available
                const voices = synth.getVoices()
                const preferred = voices.find(v =>
                    v.lang.startsWith('en') && (
                        v.name.includes('Samantha') ||
                        v.name.includes('Daniel') ||
                        v.name.includes('Karen') ||
                        v.name.includes('Google US English')
                    )
                ) || voices.find(v => v.lang.startsWith('en') && v.localService)
                    || voices.find(v => v.lang.startsWith('en'))

                if (preferred) utterance.voice = preferred

                utterance.onstart = () => {
                    setSpeaking(true)
                    setEmotion(2)
                }

                // Chrome bug: long utterances cut off after ~15s
                // pause/resume keeps it alive
                const keepAlive = setInterval(() => {
                    if (!synth.speaking) {
                        clearInterval(keepAlive)
                        return
                    }
                    synth.pause()
                    synth.resume()
                }, 10000)

                utterance.onend = () => {
                    clearInterval(keepAlive)
                    setSpeaking(false)
                    setEmotion(0)
                    resolve()
                }
                utterance.onerror = (e) => {
                    clearInterval(keepAlive)
                    console.warn('TTS error:', e?.error)
                    setSpeaking(false)
                    setEmotion(0)
                    resolve()
                }

                // Resume if paused (another Chrome quirk)
                if (synth.paused) synth.resume()

                synth.speak(utterance)
            }, 80)
        })
    }, [])

    // BEGIN INTERVIEW — called from user click to satisfy Chrome TTS gesture requirement
    const beginInterview = useCallback(async () => {
        // Warm up TTS from this user click gesture
        const warmUp = new SpeechSynthesisUtterance(' ')
        warmUp.volume = 0.01
        window.speechSynthesis.speak(warmUp)

        setHasBegun(true)
        setIsLoading(true)
        setEmotion(3)

        try {
            const question = await startInterview(role, experience, topic)
            const msg = { role: 'interviewer', text: question }
            setMessages([msg])
            setQuestionCount(1)
            await speakText(question)
        } catch (err) {
            console.error('Start interview error:', err)
            const fallback = `Hello! I had trouble connecting to the AI (${err.message}). Please check your API key/rate limit and try again.`
            setMessages([{ role: 'interviewer', text: fallback }])
            await speakText(fallback)
        }

        setIsLoading(false)
        setEmotion(0)
    }, [role, experience, topic, speakText])

    // Setup Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) return

        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'

        recognition.onresult = (event) => {
            let interim = ''
            let final = ''
            for (let i = 0; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript
                } else {
                    interim += event.results[i][0].transcript
                }
            }
            setTranscript(final || interim)
        }

        recognition.onerror = (e) => {
            console.error('Speech Recognition Error:', e.error)
            setIsListening(false)
        }

        recognitionRef.current = recognition
    }, [])

    // Toggle microphone
    const toggleMic = () => {
        if (isListening) {
            recognitionRef.current?.stop()
            setIsListening(false)
            if (transcript.trim()) {
                submitAnswer(transcript.trim())
            }
        } else {
            setTranscript('')
            try {
                recognitionRef.current?.start()
                setIsListening(true)
            } catch (e) {
                console.error('Mic start error:', e)
            }
        }
    }

    // Submit user answer
    const submitAnswer = async (answerText) => {
        const userMsg = { role: 'candidate', text: answerText }
        const updatedMessages = [...messages, userMsg]
        setMessages(updatedMessages)
        setTranscript('')
        setIsLoading(true)

        try {
            const lastQuestion = messages.filter(m => m.role === 'interviewer').pop()?.text || ''
            // Sequential calls to avoid rate-limit bursts
            const feedback = await getAnswerFeedback(lastQuestion, answerText)
            const nextQuestion = await getNextQuestion(updatedMessages)

            setFeedbacks(prev => [...prev, feedback])

            const aiMsg = { role: 'interviewer', text: nextQuestion }
            setMessages(prev => [...prev, aiMsg])
            setQuestionCount(prev => prev + 1)

            // Speak the next question — avatar lip syncs automatically
            await speakText(nextQuestion)
        } catch (err) {
            console.error('Error getting next question:', err)
        }

        setIsLoading(false)
    }

    // End interview
    const endInterview = async () => {
        window.speechSynthesis.cancel()
        setSpeaking(false)
        recognitionRef.current?.stop()
        setIsListening(false)
        setIsLoading(true)
        setEmotion(3)

        try {
            const finalReview = await generateReview(messages)
            setReview(finalReview)
            setIsInterviewEnded(true)

            const closingText = `Thank you for completing the interview! Your overall score is ${finalReview.overall} out of 100. ${finalReview.summary}`
            const closingMsg = { role: 'interviewer', text: closingText }
            setMessages(prev => [...prev, closingMsg])
            await speakText(closingText)

            // Show detailed review automatically after the avatar finishes talking
            setShowDetailedReview(true)
        } catch (err) {
            console.error('Review Error:', err)
            setIsInterviewEnded(true)
        }

        setIsLoading(false)
        setEmotion(0)
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel()
            recognitionRef.current?.stop()
        }
    }, [])

    if (!role) return null

    return (
        <div className="interview-page">
            {/* BEGIN OVERLAY — User clicks to unlock TTS + start */}
            {!hasBegun && (
                <div className="begin-overlay">
                    <div className="begin-card">
                        <div className="begin-info">
                            <h2>Ready to Begin?</h2>
                            <p><strong>Role:</strong> {role}</p>
                            <p><strong>Experience:</strong> {experience}</p>
                            <p><strong>Topic:</strong> {topic}</p>
                        </div>
                        <button className="begin-btn" onClick={beginInterview}>
                            <FiPlay size={24} />
                            <span>Begin Interview</span>
                        </button>
                        <p className="begin-hint">Click to start — the interviewer will speak to you</p>
                    </div>
                </div>
            )}

            {/* Detailed Review Modal overlay */}
            {showDetailedReview && review && (
                <div className="detailed-review-overlay">
                    <div className="detailed-review-card">
                        <div className="detailed-review-header">
                            <h2>Interview Performance Review</h2>
                            <button className="close-modal-btn" onClick={() => setShowDetailedReview(false)}>&times;</button>
                        </div>
                        <div className="metrics-grid">
                            <div className="metric-box overall">
                                <span className="metric-score">{review.overall}</span>
                                <span className="metric-label">Overall Score</span>
                            </div>
                            <div className="metric-box">
                                <span className="metric-score" style={{ color: '#34d399' }}>{review.communication}</span>
                                <span className="metric-label">Communication</span>
                            </div>
                            <div className="metric-box">
                                <span className="metric-score" style={{ color: '#60a5fa' }}>{review.technical}</span>
                                <span className="metric-label">Technical</span>
                            </div>
                            <div className="metric-box">
                                <span className="metric-score" style={{ color: '#fbbf24' }}>{review.confidence}</span>
                                <span className="metric-label">Confidence</span>
                            </div>
                            <div className="metric-box">
                                <span className="metric-score" style={{ color: '#f472b6' }}>{review.problemSolving}</span>
                                <span className="metric-label">Problem Solving</span>
                            </div>
                        </div>
                        <div className="detailed-summary-box">
                            <p>{review.summary}</p>
                        </div>
                        <div className="feedback-section grid-3">
                            <div className="feedback-col strengths-col">
                                <h3><FiTrendingUp size={16} /> Strengths</h3>
                                <ul>{review.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul>
                            </div>
                            <div className="feedback-col improvements-col">
                                <h3><FiAlertCircle size={16} /> Improvements</h3>
                                <ul>{review.improvements?.map((s, i) => <li key={i}>{s}</li>)}</ul>
                            </div>
                            <div className="feedback-col tips-col">
                                <h3><FiZap size={16} /> Tips</h3>
                                <ul>{review.tips?.map((s, i) => <li key={i}>{s}</li>)}</ul>
                            </div>
                        </div>
                        <div className="detailed-review-actions">
                            <button className="done-btn" onClick={() => navigate('/')}>Return Home</button>
                            <button className="view-log-btn" onClick={() => setShowDetailedReview(false)}>View Chat Log</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Left side */}
            <div className="interview-left">
                {/* Avatar Section */}
                <div className="avatar-section">
                    <Canvas shadows camera={{ position: [0, 1.5, 3.5], fov: 35 }}>
                        <ambientLight intensity={0.8} />
                        <spotLight position={[5, 8, 5]} angle={0.2} penumbra={1} intensity={1} castShadow />
                        <directionalLight position={[-3, 5, 4]} intensity={0.4} />
                        <color attach="background" args={['#0f0f14']} />

                        <Suspense fallback={null}>
                            <group position={[0, -1, 0]}>
                                <MyAvatar
                                    modelUrl="/models/myAvatar.glb"
                                    externalSpeaking={speaking}
                                    externalEmotion={emotion}
                                />
                            </group>
                            <ContactShadows resolution={512} scale={20} blur={2} opacity={0.4} far={10} color="#000" />
                        </Suspense>
                    </Canvas>

                    {/* Status badge */}
                    <div className={`avatar-status ${speaking ? 'speaking' : isListening ? 'listening' : 'idle'}`}>
                        {speaking ? '🗣️ Speaking...' : isListening ? '🎙️ Listening...' : isLoading ? '⏳ Thinking...' : '💡 Ready'}
                    </div>
                </div>

                {/* Chat Section */}
                <div className="chat-section">
                    <div className="chat-messages">
                        {messages.map((msg, i) => (
                            <ChatBubble key={i} message={msg} />
                        ))}
                        {isLoading && (
                            <div className="chat-bubble interviewer loading-bubble">
                                <div className="typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Transcript preview */}
                    {isListening && transcript && (
                        <div className="transcript-preview">
                            <span className="transcript-dot"></span>
                            {transcript}
                        </div>
                    )}

                    {/* Controls */}
                    <div className="chat-controls">
                        <button className="back-btn" onClick={() => { window.speechSynthesis.cancel(); navigate('/'); }}>
                            <FiArrowLeft size={18} />
                        </button>

                        <button
                            className={`mic-btn ${isListening ? 'active' : ''}`}
                            onClick={toggleMic}
                            disabled={speaking || isLoading || isInterviewEnded || !hasBegun}
                        >
                            {isListening ? <FiMicOff size={22} /> : <FiMic size={22} />}
                            <span>{isListening ? 'Stop & Submit' : 'Tap to Answer'}</span>
                        </button>

                        <button
                            className="end-btn"
                            onClick={endInterview}
                            disabled={isInterviewEnded || messages.length < 3 || !hasBegun}
                        >
                            <FiSquare size={16} />
                            <span>End</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Right side — Review Panel */}
            <div className="interview-right">
                <ReviewPanel
                    feedbacks={feedbacks}
                    review={review}
                    isInterviewEnded={isInterviewEnded}
                    questionCount={questionCount}
                />
            </div>
        </div>
    )
}
