import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiGrid, FiActivity, FiBookOpen, FiFileText, FiMessageSquare,
  FiSettings, FiSearch, FiBell, FiChevronLeft, FiChevronRight,
  FiTrendingUp, FiCheckCircle, FiAward, FiClock, FiPlay,
  FiMoreHorizontal, FiUser
} from "react-icons/fi";
import "@/styles/Dashboard.css";

// ── Mock data (replace with real data from your backend) ────────────────────
const STATS = [
  { icon: <FiTrendingUp size={20} />, value: "8", label: "Interviews Done", color: "#a78bfa" },
  { icon: <FiCheckCircle size={20} />, value: "42", label: "Questions Answered", color: "#34d399" },
  { icon: <FiAward size={20} />, value: "86", label: "Average Score", color: "#60a5fa" },
  { icon: <FiClock size={20} />, value: "4.5h", label: "Hours Practiced", color: "#fbbf24" },
];

const SESSIONS = [
  { id: 1, title: "React & Frontend", topic: "JavaScript & React", progress: 12, total: 15, color: "#dbeafe", accent: "#3b82f6" },
  { id: 2, title: "System Design", topic: "Architecture", progress: 8, total: 12, color: "#d1fae5", accent: "#10b981" },
  { id: 3, title: "DSA Practice", topic: "Data Structures", progress: 5, total: 20, color: "#fef3c7", accent: "#f59e0b" },
];

const HISTORY = [
  { id: 1, icon: "💻", title: "React Hooks Deep Dive", date: "Today, 2:30 PM", score: null, status: "Upcoming" },
  { id: 2, icon: "🏗️", title: "API Design Patterns", date: "Today, 4:00 PM", score: null, status: "Upcoming" },
  { id: 3, icon: "🧠", title: "Behavioral Interview", date: "Yesterday, 3:15 PM", score: "92/100", status: "Completed" },
  { id: 4, icon: "⚙️", title: "Node.js Backend", date: "Jan 18, 1:00 PM", score: "78/100", status: "Completed" },
];

const SCHEDULE_EVENTS = [
  { time: "9 AM", title: "DSA Practice", subtitle: "9:00 - 10:00 AM", color: "#fee2e2" },
  { time: "11 AM", title: "System Design", subtitle: "10:30 AM - 11:30 AM", color: "#dbeafe" },
  { time: "2 PM", title: "React Interview", subtitle: "12:30 PM - 2:30 PM", color: "#fef3c7" },
];

const NAV_ITEMS = [
  { icon: <FiGrid size={18} />, label: "Dashboard", active: true },
  { icon: <FiActivity size={18} />, label: "Activity" },
  { icon: <FiBookOpen size={18} />, label: "Sessions" },
  { icon: <FiFileText size={18} />, label: "Reports" },
  { icon: <FiMessageSquare size={18} />, label: "Messages" },
];

// ── Calendar helper ─────────────────────────────────────────────────────────
function MiniCalendar() {
  const [date] = useState(new Date());
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const today = date.getDate();

  const firstDay = new Date(year, date.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1; // Mon start

  const days = [];
  // Previous month padding
  const prevMonthDays = new Date(year, date.getMonth(), 0).getDate();
  for (let i = offset - 1; i >= 0; i--) days.push({ d: prevMonthDays - i, muted: true });
  // Current month
  for (let i = 1; i <= daysInMonth; i++) days.push({ d: i, today: i === today });
  // Next month padding
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) for (let i = 1; i <= remaining; i++) days.push({ d: i, muted: true });

  return (
    <div className="db-calendar">
      <div className="db-calendar-header">
        <button className="db-cal-nav"><FiChevronLeft size={16} /></button>
        <span className="db-cal-title">{month} {year}</span>
        <button className="db-cal-nav"><FiChevronRight size={16} /></button>
      </div>
      <div className="db-calendar-grid">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <span key={d} className="db-cal-weekday">{d}</span>
        ))}
        {days.map((day, i) => (
          <span
            key={i}
            className={`db-cal-day${day.today ? " today" : ""}${day.muted ? " muted" : ""}`}
          >
            {day.d}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="db-layout">
      {/* ── Sidebar ── */}
      <aside className="db-sidebar">
        <div className="db-sidebar-top">
          <div className="db-logo">
            <div className="db-logo-icon">
              <FiAward size={20} />
            </div>
            <span className="db-logo-text">Interview<span className="db-accent">Ace</span></span>
          </div>

          <nav className="db-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                className={`db-nav-item${item.active ? " active" : ""}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <button className="db-nav-item db-settings-btn">
          <FiSettings size={18} />
          <span>Settings</span>
        </button>
      </aside>

      {/* ── Main Content ── */}
      <main className="db-main">
        {/* Header */}
        <header className="db-header">
          <h1 className="db-greeting">Hi, User! 👋</h1>
          <div className="db-header-actions">
            <button className="db-icon-btn"><FiSearch size={18} /></button>
            <button className="db-icon-btn db-notif-btn">
              <FiBell size={18} />
              <span className="db-notif-dot"></span>
            </button>
            <div className="db-avatar-pill">
              <div className="db-user-avatar"><FiUser size={16} /></div>
            </div>
          </div>
        </header>

        {/* Overview */}
        <section className="db-section">
          <h2 className="db-section-title">Overview</h2>
          <div className="db-stats-grid">
            {STATS.map((stat) => (
              <div key={stat.label} className="db-stat-card">
                <div className="db-stat-icon" style={{ color: stat.color, background: `${stat.color}18` }}>
                  {stat.icon}
                </div>
                <div className="db-stat-value">{stat.value}</div>
                <div className="db-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Sessions */}
        <section className="db-section">
          <h2 className="db-section-title">Recent Sessions</h2>
          <div className="db-courses-grid">
            {SESSIONS.map((s) => (
              <div key={s.id} className="db-course-card" style={{ background: s.color }}>
                <div className="db-course-icon" style={{ color: s.accent }}>
                  <FiBookOpen size={20} />
                </div>
                <h3 className="db-course-title">{s.title}</h3>
                <p className="db-course-sub">▷ {s.topic}</p>
                <div className="db-course-progress">
                  <div className="db-progress-bar">
                    <div
                      className="db-progress-fill"
                      style={{ width: `${(s.progress / s.total) * 100}%`, background: s.accent }}
                    />
                  </div>
                  <span className="db-progress-text">{s.progress}/{s.total} questions</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* History */}
        <section className="db-section">
          <h2 className="db-section-title">Practice History</h2>
          <div className="db-assignments">
            {HISTORY.map((h) => (
              <div key={h.id} className="db-assign-row">
                <div className="db-assign-icon">{h.icon}</div>
                <div className="db-assign-info">
                  <span className="db-assign-title">{h.title}</span>
                  <span className="db-assign-date">{h.date}</span>
                </div>
                <div className="db-assign-score">{h.score || "--/100"}</div>
                <span className={`db-assign-badge ${h.status.toLowerCase()}`}>{h.status}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <button className="db-start-btn" onClick={() => navigate("/")}>
          <FiPlay size={18} />
          <span>Start New Interview</span>
        </button>
      </main>

      {/* ── Right Sidebar ── */}
      <aside className="db-right">
        <h2 className="db-section-title">Schedule</h2>

        <MiniCalendar />

        <div className="db-timeline">
          {["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM"].map((time) => {
            const event = SCHEDULE_EVENTS.find((e) => e.time === time);
            return (
              <div key={time} className="db-time-row">
                <span className="db-time-label">{time}</span>
                {event ? (
                  <div className="db-time-event" style={{ background: event.color }}>
                    <div className="db-event-info">
                      <span className="db-event-title">{event.title}</span>
                      <span className="db-event-sub">{event.subtitle}</span>
                    </div>
                    <button className="db-event-more"><FiMoreHorizontal size={16} /></button>
                  </div>
                ) : (
                  <div className="db-time-empty" />
                )}
              </div>
            );
          })}
        </div>

        <div className="db-premium-card">
          <div className="db-premium-text">
            <h3>Go Premium</h3>
            <button className="db-premium-btn">Get access</button>
          </div>
          <span className="db-premium-emoji">🚀</span>
        </div>
      </aside>
    </div>
  );
}
