import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrendingUp, FiAlertCircle, FiZap } from "react-icons/fi";

export default function DetailedReviewModal({ review, onClose }) {
  const navigate = useNavigate();
  const overlayRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Trap focus within modal
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const focusable = overlay.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    overlay.addEventListener("keydown", handleTab);
    return () => overlay.removeEventListener("keydown", handleTab);
  }, []);

  if (!review) return null;

  return (
    <div
      className="detailed-review-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Interview Performance Review"
      ref={overlayRef}
    >
      <div className="detailed-review-card">
        <div className="detailed-review-header">
          <h2>Interview Performance Review</h2>
          <button className="close-modal-btn" onClick={onClose} aria-label="Close review">&times;</button>
        </div>

        <div className="metrics-grid">
          <div className="metric-box overall">
            <span className="metric-score">{review.overall}</span>
            <span className="metric-label">Overall Score</span>
          </div>
          <div className="metric-box">
            <span className="metric-score" style={{ color: "#34d399" }}>{review.communication}</span>
            <span className="metric-label">Communication</span>
          </div>
          <div className="metric-box">
            <span className="metric-score" style={{ color: "#60a5fa" }}>{review.technical}</span>
            <span className="metric-label">Technical</span>
          </div>
          <div className="metric-box">
            <span className="metric-score" style={{ color: "#fbbf24" }}>{review.confidence}</span>
            <span className="metric-label">Confidence</span>
          </div>
          <div className="metric-box">
            <span className="metric-score" style={{ color: "#f472b6" }}>{review.problemSolving}</span>
            <span className="metric-label">Problem Solving</span>
          </div>
        </div>

        <div className="detailed-summary-box">
          <p>{review.summary}</p>
        </div>

        <div className="feedback-section grid-3">
          <div className="feedback-col strengths-col">
            <h3><FiTrendingUp size={16} /> Strengths</h3>
            <ul>{review.strengths?.length ? review.strengths.map((s, i) => <li key={i}>{s}</li>) : <li>No data</li>}</ul>
          </div>
          <div className="feedback-col improvements-col">
            <h3><FiAlertCircle size={16} /> Improvements</h3>
            <ul>{review.improvements?.length ? review.improvements.map((s, i) => <li key={i}>{s}</li>) : <li>No data</li>}</ul>
          </div>
          <div className="feedback-col tips-col">
            <h3><FiZap size={16} /> Tips</h3>
            <ul>{review.tips?.length ? review.tips.map((s, i) => <li key={i}>{s}</li>) : <li>No data</li>}</ul>
          </div>
        </div>

        <div className="detailed-review-actions">
          <button className="done-btn" onClick={() => navigate("/")}>Return Home</button>
          <button className="view-log-btn" onClick={onClose}>View Chat Log</button>
        </div>
      </div>
    </div>
  );
}
