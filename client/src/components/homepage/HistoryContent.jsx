import React from 'react'

const HistoryContent = (sessions, onDeleteSession, onClearHistory) => {
  return (
    <div>
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
  )
}

export default HistoryContent


