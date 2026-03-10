import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiTrash2, FiChevronDown, FiChevronUp, FiMonitor, FiCheck, FiX, FiAward } from "react-icons/fi";
import UserNav from "@/components/UserNav";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [expandedSession, setExpandedSession] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("interviewHistory") || "[]");
    setSessions(stored.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, []);

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all interview history?")) {
      localStorage.removeItem("interviewHistory");
      setSessions([]);
    }
  };

  const deleteSession = (idx) => {
    const updated = sessions.filter((_, i) => i !== idx);
    localStorage.setItem("interviewHistory", JSON.stringify(updated));
    setSessions(updated);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#16a34a";
    if (score >= 60) return "#f59e0b";
    if (score >= 40) return "#f97316";
    return "#ef4444";
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="history-page" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Top bar */}
      <div className="history-topbar">
        <div className="history-topbar-left">
          <button className="topbar-back-btn" onClick={() => navigate("/")}>
            <FiArrowLeft size={18} />
          </button>
          <a href="/" className="topbar-logo">
            <div className="topbar-logo-icon">
              <FiMonitor className="w-4 h-4 text-white" />
            </div>
            <span className="topbar-logo-text" style={{ fontFamily: "'Outfit', sans-serif" }}>InterviewAce</span>
          </a>
        </div>
        <div className="history-topbar-right">
          <h1 className="history-title">Interview History</h1>
          {sessions.length > 0 && (
            <button className="history-clear-btn" onClick={clearHistory}>
              <FiTrash2 size={14} />
              <span>Clear All</span>
            </button>
          )}
          <UserNav />
        </div>
      </div>

      {/* Content */}
      <div className="history-content">
        {sessions.length === 0 ? (
          <div className="history-empty">
            <FiAward size={48} />
            <h2>No Interview History Yet</h2>
            <p>Complete an interview to see your history, questions, answers, and ideal responses here.</p>
            <button className="history-start-btn" onClick={() => navigate("/choose")}>
              Start an Interview
            </button>
          </div>
        ) : (
          <div className="history-sessions">
            {sessions.map((session, sIdx) => (
              <div key={sIdx} className="history-session-card">
                <div
                  className="session-header"
                  onClick={() => setExpandedSession(expandedSession === sIdx ? null : sIdx)}
                >
                  <div className="session-header-left">
                    <div className="session-score-badge" style={{ background: getScoreColor(session.review?.overall || 0) }}>
                      {session.review?.overall || "—"}
                    </div>
                    <div className="session-meta">
                      <h3>{session.topic} — {session.role}</h3>
                      <p>{session.experience} &middot; {formatDate(session.date)} &middot; {session.questionHistory?.length || 0} questions</p>
                    </div>
                  </div>
                  <div className="session-header-right">
                    <button
                      className="session-delete-btn"
                      onClick={(e) => { e.stopPropagation(); deleteSession(sIdx); }}
                      title="Delete session"
                    >
                      <FiTrash2 size={14} />
                    </button>
                    {expandedSession === sIdx ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                  </div>
                </div>

                {expandedSession === sIdx && (
                  <div className="session-body">
                    {/* Score summary */}
                    <div className="session-scores">
                      {[
                        { label: "Overall", value: session.review?.overall, color: "#1caee4" },
                        { label: "Communication", value: session.review?.communication, color: "#16a34a" },
                        { label: "Technical", value: session.review?.technical, color: "#3b82f6" },
                        { label: "Confidence", value: session.review?.confidence, color: "#f59e0b" },
                        { label: "Problem Solving", value: session.review?.problemSolving, color: "#ec4899" },
                      ].map((s) => (
                        <div key={s.label} className="session-score-pill">
                          <span className="pill-dot" style={{ background: s.color }}></span>
                          <span className="pill-label">{s.label}</span>
                          <span className="pill-value" style={{ color: s.color }}>{s.value ?? "—"}</span>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    {session.review?.summary && (
                      <div className="session-summary">
                        <p>{session.review.summary}</p>
                      </div>
                    )}

                    {/* Q&A History */}
                    <div className="qa-history">
                      <h4>Question & Answer History</h4>
                      {(session.questionHistory || []).map((qa, qIdx) => {
                        const qKey = `${sIdx}-${qIdx}`;
                        const isExpanded = expandedQuestion === qKey;
                        return (
                          <div key={qIdx} className="qa-card">
                            <div
                              className="qa-header"
                              onClick={() => setExpandedQuestion(isExpanded ? null : qKey)}
                            >
                              <div className="qa-num">Q{qIdx + 1}</div>
                              <p className="qa-question-text">{qa.question}</p>
                              {qa.score != null && (
                                <span className="qa-score" style={{ color: getScoreColor(qa.score) }}>
                                  {qa.score}/100
                                </span>
                              )}
                              {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                            </div>

                            {isExpanded && (
                              <div className="qa-body">
                                <div className="qa-answer-block candidate-block">
                                  <div className="qa-answer-label">
                                    <FiX size={14} className="qa-icon-candidate" />
                                    Your Answer
                                  </div>
                                  <p>{qa.candidateAnswer || "No answer provided"}</p>
                                </div>
                                <div className="qa-answer-block ideal-block">
                                  <div className="qa-answer-label">
                                    <FiCheck size={14} className="qa-icon-ideal" />
                                    Ideal Answer
                                  </div>
                                  <p>{qa.idealAnswer || "Not available"}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {(!session.questionHistory || session.questionHistory.length === 0) && (
                        <p className="qa-empty">No question history available for this session.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
