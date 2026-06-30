import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiTrash2, FiMonitor, FiSearch } from "react-icons/fi";
import UserNav from "@/components/UserNav";
import HistoryContent from "@/components/homepage/HistoryContent";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [query, setQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { getInterviewsFromDb } = await import("@/services/api.service");
        const stored = await getInterviewsFromDb();
        setSessions(stored.sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date)));
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };
    fetchHistory();
  }, []);

  const filters = useMemo(() => {
    const topics = Array.from(new Set(sessions.map((s) => s.topic).filter(Boolean)));
    const roles = Array.from(new Set(sessions.map((s) => s.role).filter(Boolean)));
    return { topics, roles };
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sessions.filter((session) => {
      const matchesQuery = !q || [session.topic, session.role, session.experience]
        .filter(Boolean)
        .some((item) => item.toLowerCase().includes(q));
      const matchesTopic = topicFilter === "all" || session.topic === topicFilter;
      const matchesRole = roleFilter === "all" || session.role === roleFilter;
      return matchesQuery && matchesTopic && matchesRole;
    });
  }, [sessions, query, topicFilter, roleFilter]);

  const clearHistory = async () => {
    if (window.confirm("Are you sure you want to clear all interview history?")) {
      try {
        const { clearInterviewsFromDb } = await import("@/services/api.service");
        await clearInterviewsFromDb();
        setSessions([]);
      } catch (err) {
        console.error("Failed to clear history:", err);
      }
    }
  };

  const deleteSession = async (idx) => {
    const session = sessions[idx];
    try {
      if (session.id) {
        const { deleteInterviewFromDb } = await import("@/services/api.service");
        await deleteInterviewFromDb(session.id);
      }
      const updated = sessions.filter((_, i) => i !== idx);
      setSessions(updated);
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
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

      <div className="history-filterbar">
        <div className="filter-input">
          <FiSearch size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by topic, role, or level"
          />
        </div>
        <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}>
          <option value="all">All Topics</option>
          {filters.topics.map((topic) => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          {filters.roles.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      <HistoryContent
        sessions={filteredSessions}
        onDeleteSession={deleteSession}
      />
    </div>
  );
}
