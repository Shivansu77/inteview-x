import React from 'react'
import { FiAward, FiTrendingUp, FiAlertCircle, FiStar, FiZap } from 'react-icons/fi'

function ScoreRing({ score, label, color }) {
    const radius = 36
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (score / 100) * circumference

    return (
        <div className="score-ring-container">
            <svg width="90" height="90" viewBox="0 0 90 90">
                <circle cx="45" cy="45" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                <circle
                    cx="45" cy="45" r={radius} fill="none"
                    stroke={color} strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 1.5s ease-out', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
                <text x="45" y="45" textAnchor="middle" dy="6" fill="white" fontSize="18" fontWeight="700">
                    {score}
                </text>
            </svg>
            <span className="score-label">{label}</span>
        </div>
    )
}

export default function ReviewPanel({ feedbacks, review, isInterviewEnded, questionCount }) {
    if (isInterviewEnded && review) {
        return (
            <div className="review-panel final-review">
                <div className="review-header">
                    <FiAward size={24} />
                    <h2>Interview Review</h2>
                </div>

                <div className="score-rings">
                    <ScoreRing score={review.overall} label="Overall" color="#a78bfa" />
                    <ScoreRing score={review.communication} label="Communication" color="#34d399" />
                    <ScoreRing score={review.technical} label="Technical" color="#60a5fa" />
                    <ScoreRing score={review.confidence} label="Confidence" color="#fbbf24" />
                    <ScoreRing score={review.problemSolving} label="Problem Solving" color="#f472b6" />
                </div>

                <div className="review-summary">
                    <p>{review.summary}</p>
                </div>

                <div className="review-section">
                    <h3><FiStar size={16} /> Strengths</h3>
                    <ul>
                        {review.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>

                <div className="review-section">
                    <h3><FiTrendingUp size={16} /> Areas to Improve</h3>
                    <ul>
                        {review.improvements?.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>

                <div className="review-section">
                    <h3><FiZap size={16} /> Tips</h3>
                    <ul>
                        {review.tips?.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
            </div>
        )
    }

    return (
        <div className="review-panel live-feedback">
            <div className="review-header">
                <FiAlertCircle size={24} />
                <h2>Live Feedback</h2>
            </div>

            <div className="question-counter">
                <span>Question {questionCount}</span>
            </div>

            {feedbacks.length === 0 ? (
                <div className="feedback-placeholder">
                    <p>Answer a question to receive feedback here...</p>
                </div>
            ) : (
                <div className="feedback-list">
                    {feedbacks.map((fb, i) => (
                        <div key={i} className="feedback-card" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="feedback-q-num">Q{i + 1}</div>
                            <p>{fb}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
