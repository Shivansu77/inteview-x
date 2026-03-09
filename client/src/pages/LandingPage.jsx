import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlay, FiUser, FiBriefcase, FiBookOpen, FiMonitor, FiChevronLeft } from "react-icons/fi";
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
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* ═══════════ TOP NAVBAR (matches homepage) ═══════════ */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0" style={{ zIndex: 100 }}>
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-14">
          {/* Left: Back + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <a href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded bg-[#1caee4] flex items-center justify-center">
                <FiMonitor className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-gray-700 text-2xl tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>InterviewAce</span>
            </a>
          </div>

          {/* Right: Auth buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate("/login")}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-[#1caee4] transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-1.5 rounded-full bg-[#1caee4] text-white text-sm font-semibold hover:bg-[#179ad0] transition-colors duration-150 shadow-sm"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <div className="flex-1 relative overflow-hidden">
        {/* Decorative background elements */}
        <div
          className="absolute rounded-full"
          style={{
            width: 600, height: 600,
            top: -200, right: -120,
            background: "linear-gradient(135deg, #1caee4 0%, #6dd5fa 50%, #2980b9 100%)",
            opacity: 0.06,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 400, height: 400,
            bottom: -100, left: -80,
            background: "linear-gradient(135deg, #1caee4 0%, #a5f3fc 100%)",
            opacity: 0.06,
          }}
        />

        <div className="relative z-10 flex flex-col max-w-4xl mx-auto w-full px-6 py-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Set Up Your <span className="text-[#1caee4]">Mock Interview</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Configure your AI interviewer, select your role and experience level, and get ready to practice in a realistic environment.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100 p-8 md:p-10 w-full">
            <div className="space-y-10">
              {/* Role Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  <FiBriefcase className="text-[#1caee4]" /> 1. Select Job Role
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#1caee4] focus:ring-2 focus:ring-[#1caee4]/20 transition-all font-medium"
                  >
                    <option value="" disabled>Choose your target role...</option>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  <FiUser className="text-[#1caee4]" /> 2. Experience Level
                </label>
                <div className="flex flex-wrap gap-3">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <button
                      key={level}
                      onClick={() => setExperience(level)}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 ${experience === level
                        ? "bg-[#1caee4] border-[#1caee4] text-white shadow-md shadow-[#1caee4]/20"
                        : "bg-white border-gray-200 text-gray-600 hover:border-[#1caee4] hover:text-[#1caee4] hover:bg-blue-50/50"
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  <FiBookOpen className="text-[#1caee4]" /> 3. Interview Focus Area
                </label>
                <div className="flex flex-wrap gap-3">
                  {TOPICS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 ${topic === t
                        ? "bg-[#1caee4] border-[#1caee4] text-white shadow-md shadow-[#1caee4]/20"
                        : "bg-white border-gray-200 text-gray-600 hover:border-[#1caee4] hover:text-[#1caee4] hover:bg-blue-50/50"
                        }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interviewer Avatar */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                  <FiUser className="text-[#1caee4]" /> 4. Choose Your Interviewer
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {AVATARS.map((av) => (
                    <button
                      key={av.id}
                      onClick={() => setAvatarUrl(av.url)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${avatarUrl === av.url
                        ? "border-[#1caee4] bg-blue-50/50 shadow-md ring-4 ring-[#1caee4]/10"
                        : "border-gray-100 hover:border-gray-300 bg-gray-50/50 hover:bg-gray-50"
                        }`}
                    >
                      <div className="text-4xl mb-2">{av.emoji}</div>
                      <div className={`text-sm font-bold ${avatarUrl === av.url ? "text-gray-900" : "text-gray-500"}`}>
                        {av.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-500 font-medium hidden sm:block">
                  Powered by Google Gemini AI &nbsp;&bull;&nbsp; Sessions are strictly private
                </p>

                <button
                  onClick={handleStart}
                  disabled={!canStart}
                  className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-lg transition-all duration-300 w-full sm:w-auto ${canStart
                    ? "bg-[#1caee4] hover:bg-[#169ad0] text-white shadow-lg shadow-[#1caee4]/25 transform hover:-translate-y-0.5 cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  <FiPlay className={canStart ? "fill-current" : ""} />
                  Start Interview
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
