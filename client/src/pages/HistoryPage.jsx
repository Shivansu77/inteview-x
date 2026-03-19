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
      <HistoryContent
    sessions={sessions}
    onDeleteSession={deleteSession}
    onClearHistory={clearHistory}
      />
    </div>
  );
}
