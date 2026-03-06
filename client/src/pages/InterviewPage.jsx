import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { FiMic, FiMicOff, FiSquare, FiArrowLeft, FiPlay, FiRefreshCw, FiSend, FiHelpCircle } from "react-icons/fi";

// Components
import { Model as MyAvatar } from "@/components/avatar/MyAvatar";
import ChatBubble from "@/components/ui/ChatBubble";
import ReviewPanel from "@/components/review/ReviewPanel";
import DetailedReviewModal from "@/components/review/DetailedReviewModal";

// Constants
import { AVATARS } from "@/constants/prompts";

// Agent
import { createConversationAgent } from "@/services/conversationAgent";

// Services (still used for legacy review fallback)
import { generateReview } from "@/services/interview.service";

// Hooks
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

export default function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, experience, topic, avatarUrl: initialAvatar } = location.state || {};

  // Avatar model URL
  const [avatarUrl, setAvatarUrl] = useState(initialAvatar || AVATARS[0].url);

  // User must click "Begin" to unlock TTS (Chrome autoplay policy)
  const [hasBegun, setHasBegun] = useState(false);

  // Core state
  const [messages, setMessages] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [review, setReview] = useState(null);
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [showDetailedReview, setShowDetailedReview] = useState(false);

  // Agent state
  const agentRef = useRef(null);
  const [agentPhase, setAgentPhase] = useState("idle");

  // Text input state
  const [textInput, setTextInput] = useState("");

  // Avatar state
  const [speaking, setSpeaking] = useState(false);
  const [emotion, setEmotion] = useState(0);

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // Refs
  const chatEndRef = useRef(null);
  const textInputRef = useRef(null);

  // Custom hooks
  const { isListening, transcript, setTranscript, startListening, stopListening, cleanup: cleanupMic } =
    useSpeechRecognition();

  const { speakText, cancelSpeech, warmUp } = useSpeechSynthesis({
    onSpeakStart: () => { setSpeaking(true); setEmotion(2); },
    onSpeakEnd: () => { setSpeaking(false); setEmotion(0); },
  });

  const cycleAvatar = useCallback(() => {
    setAvatarUrl((prev) => {
      const idx = AVATARS.findIndex((a) => a.url === prev);
      return AVATARS[(idx + 1) % AVATARS.length].url;
    });
  }, []);

  // Redirect if no state
  useEffect(() => {
    if (!role || !experience || !topic) navigate("/");
  }, [role, experience, topic, navigate]);

  // Scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // BEGIN INTERVIEW — initialise the conversational agent
  const beginInterview = useCallback(async () => {
    warmUp();
    setHasBegun(true);
    setIsLoading(true);
    setEmotion(3);

    try {
      const agent = createConversationAgent();
      agentRef.current = agent;

      const greeting = await agent.init({ role, experience, topic });
      const msg = { role: "interviewer", text: greeting, type: "question" };
      setMessages([msg]);
      setQuestionCount(agent.questionCount);
      setAgentPhase(agent.phase);
      await speakText(greeting);
    } catch (err) {
      console.error("Start interview error:", err);
      const fallback = `Hello! I had trouble connecting to the AI (${err.message}). Please check your API key/rate limit and try again.`;
      setMessages([{ role: "interviewer", text: fallback, type: "error" }]);
      await speakText(fallback);
    }

    setIsLoading(false);
    setEmotion(0);
  }, [role, experience, topic, speakText, warmUp]);

  // Toggle microphone
  const toggleMic = () => {
    if (isListening) {
      stopListening();
      if (transcript.trim()) submitAnswer(transcript.trim());
    } else {
      startListening();
    }
  };

  // Handle text input submission
  const handleTextSubmit = (e) => {
    e.preventDefault();
    const trimmed = textInput.trim();
    if (!trimmed || isLoading || speaking || isInterviewEnded) return;
    setTextInput("");
    submitAnswer(trimmed);
  };

  // Submit user answer via the conversational agent
  const submitAnswer = async (answerText) => {
    const agent = agentRef.current;
    if (!agent) return;

    const userMsg = { role: "candidate", text: answerText, type: "answer" };
    setMessages((prev) => [...prev, userMsg]);
    setTranscript("");
    setIsLoading(true);

    try {
      // Get agent's response + feedback in parallel
      const [agentResponse, feedback] = await Promise.all([
        agent.respond(answerText),
        agent.getLastFeedback().catch(() => ""),
      ]);

      if (feedback) setFeedbacks((prev) => [...prev, feedback]);

      const aiMsg = { role: "interviewer", text: agentResponse.message, type: agentResponse.type };
      setMessages((prev) => [...prev, aiMsg]);
      setQuestionCount(agent.questionCount);
      setAgentPhase(agent.phase);

      await speakText(agentResponse.message);
    } catch (err) {
      console.error("Error getting agent response:", err);
      const errorMsg = { role: "interviewer", text: "Sorry, I had trouble processing that. Could you repeat your answer?", type: "error" };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setIsLoading(false);
  };

  // Request a hint from the agent
  const requestHint = async () => {
    const agent = agentRef.current;
    if (!agent || isLoading || speaking || isInterviewEnded) return;

    setIsLoading(true);
    try {
      const hint = await agent.requestHint();
      const hintMsg = { role: "interviewer", text: hint, type: "hint" };
      setMessages((prev) => [...prev, hintMsg]);
      await speakText(hint);
    } catch (err) {
      console.error("Hint error:", err);
    }
    setIsLoading(false);
  };

  // End interview
  const endInterview = async () => {
    cancelSpeech();
    setSpeaking(false);
    stopListening();
    setIsLoading(true);
    setEmotion(3);

    try {
      const agent = agentRef.current;
      const finalReview = agent
        ? await agent.endInterview()
        : await generateReview(messages);

      if (!finalReview || typeof finalReview.overall !== "number") {
        throw new Error("Invalid review data received");
      }
      setReview(finalReview);
      setIsInterviewEnded(true);
      setAgentPhase("ended");

      const closingText = `Thank you for completing the interview! Your overall score is ${finalReview.overall} out of 100. ${finalReview.summary}`;
      const closingMsg = { role: "interviewer", text: closingText, type: "wrap_up" };
      setMessages((prev) => [...prev, closingMsg]);
      await speakText(closingText);

      setShowDetailedReview(true);
    } catch (err) {
      console.error("Review Error:", err);
      const errorMsg = { role: "interviewer", text: `Could not generate review: ${err.message}. The interview has ended.`, type: "error" };
      setMessages((prev) => [...prev, errorMsg]);
      setIsInterviewEnded(true);
      setAgentPhase("ended");
    }

    setIsLoading(false);
    setEmotion(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelSpeech();
      cleanupMic();
    };
  }, [cancelSpeech, cleanupMic]);

  if (!role || !experience || !topic) return null;

  return (
    <div className="interview-page">
      {/* BEGIN OVERLAY */}
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
            <p className="begin-hint">Click to start — the AI interviewer will adapt to your answers</p>
          </div>
        </div>
      )}

      {/* Detailed Review Modal */}
      {showDetailedReview && (
        <DetailedReviewModal
          review={review}
          onClose={() => setShowDetailedReview(false)}
        />
      )}

      {/* Left side */}
      <div className="interview-left">
        {/* Avatar Section */}
        <div className="avatar-section">
          <Canvas shadows camera={{ position: [0, 1.65, 2.2], fov: 30 }}>
            <ambientLight intensity={0.8} />
            <spotLight position={[5, 8, 5]} angle={0.2} penumbra={1} intensity={1} castShadow />
            <directionalLight position={[-3, 5, 4]} intensity={0.4} />
            <color attach="background" args={["#0f0f14"]} />

            <Suspense fallback={null}>
              <group
                position={avatarUrl?.includes("avatar2") ? [0, -1.6, 0] : [0, -1.4, 0]}
                scale={avatarUrl?.includes("avatar2") ? 1.3 : 1.15}
              >
                <MyAvatar
                  key={avatarUrl}
                  modelUrl={avatarUrl}
                  externalSpeaking={speaking}
                  externalEmotion={emotion}
                />
              </group>
              <ContactShadows resolution={512} scale={20} blur={2} opacity={0.4} far={10} color="#000" />
            </Suspense>
          </Canvas>

          <div className={`avatar-status ${speaking ? "speaking" : isListening ? "listening" : "idle"}`}>
            {speaking ? "🗣️ Speaking..." : isListening ? "🎙️ Listening..." : isLoading ? "⏳ Thinking..." : agentPhase === "follow_up" ? "🔍 Follow-up" : "💡 Ready"}
          </div>

          <button
            className="avatar-switch-btn"
            onClick={cycleAvatar}
            title="Switch interviewer"
            aria-label="Switch interviewer character"
          >
            <FiRefreshCw size={16} />
          </button>
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

          {isListening && transcript && (
            <div className="transcript-preview">
              <span className="transcript-dot"></span>
              {transcript}
            </div>
          )}

          {/* Text Input */}
          {hasBegun && !isInterviewEnded && (
            <form className="text-input-row" onSubmit={handleTextSubmit}>
              <input
                ref={textInputRef}
                type="text"
                className="text-input"
                placeholder="Type your answer…"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={speaking || isLoading || isListening}
              />
              <button
                type="submit"
                className="send-btn"
                disabled={!textInput.trim() || speaking || isLoading || isListening}
                aria-label="Send answer"
              >
                <FiSend size={16} />
              </button>
            </form>
          )}

          <div className="chat-controls">
            <button className="back-btn" onClick={() => { cancelSpeech(); navigate("/"); }}>
              <FiArrowLeft size={18} />
            </button>

            <button
              className={`mic-btn ${isListening ? "active" : ""}`}
              onClick={toggleMic}
              disabled={speaking || isLoading || isInterviewEnded || !hasBegun}
            >
              {isListening ? <FiMicOff size={22} /> : <FiMic size={22} />}
              <span>{isListening ? "Stop & Submit" : "Tap to Answer"}</span>
            </button>

            <button
              className="hint-btn"
              onClick={requestHint}
              disabled={!hasBegun || isLoading || speaking || isInterviewEnded || questionCount < 1}
              title="Ask for a hint"
              aria-label="Request a hint"
            >
              <FiHelpCircle size={18} />
              <span>Hint</span>
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
  );
}
