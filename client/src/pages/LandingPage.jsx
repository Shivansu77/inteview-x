import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlay, FiUser, FiBriefcase, FiBookOpen } from "react-icons/fi";
import { ROLES, EXPERIENCE_LEVELS, TOPICS, AVATARS } from "@/constants/prompts";

export default function LandingPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [topic, setTopic] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(AVATARS[0].url);

  const canStart = role && experience && topic;

  const handleStart = () => {
    if (!canStart) return;
    navigate("/interview", { state: { role, experience, topic, avatarUrl } });
  };

  return (
    <div className="landing-page">
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>

      <div className="landing-container">
        <div className="landing-logo">
          <div className="logo-icon">
            <FiUser size={28} />
          </div>
          <h1>Interview<span className="accent">Ace</span></h1>
        </div>

        <p className="landing-subtitle">
          AI-powered mock interviews with a virtual interviewer. <br />
          Practice, get feedback, and ace your next interview.
        </p>

        <div className="landing-form">
          <div className="form-group">
            <label><FiBriefcase size={16} /> Job Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Select a role...</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label><FiUser size={16} /> Experience Level</label>
            <div className="chip-group">
              {EXPERIENCE_LEVELS.map((level) => (
                <button
                  key={level}
                  className={`chip ${experience === level ? "active" : ""}`}
                  onClick={() => setExperience(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label><FiBookOpen size={16} /> Interview Topic</label>
            <div className="chip-group">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  className={`chip ${topic === t ? "active" : ""}`}
                  onClick={() => setTopic(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label><FiUser size={16} /> Choose Interviewer</label>
            <div className="avatar-picker">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  className={`avatar-pick-btn ${avatarUrl === av.url ? "active" : ""}`}
                  onClick={() => setAvatarUrl(av.url)}
                  aria-label={`Select ${av.name}`}
                >
                  <span className="avatar-pick-emoji">{av.emoji}</span>
                  <span className="avatar-pick-name">{av.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            className={`start-btn ${canStart ? "ready" : "disabled"}`}
            onClick={handleStart}
            disabled={!canStart}
          >
            <FiPlay size={20} />
            <span>Start Interview</span>
            {canStart && <div className="btn-shimmer"></div>}
          </button>
        </div>

        <p className="landing-footer">
          Powered by Google Gemini AI &bull; Your data stays in your browser
        </p>
      </div>
    </div>
  );
}
