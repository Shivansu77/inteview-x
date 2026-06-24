import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiFileText, FiMonitor, FiUploadCloud, FiBookOpen, FiPlayCircle, FiClock } from "react-icons/fi";
import UserNav from "@/components/UserNav";
import { useAuth } from "@/context/AuthContext";

const PROFILE_STORAGE_KEY = "interviewace_profile";

const getSafeHistory = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem("interviewHistory") || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

const getSafeProfile = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || "{}");
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
};

export default function DashBoardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const sessions = useMemo(() => getSafeHistory().sort((a, b) => new Date(b.date) - new Date(a.date)), []);
  const [profile, setProfile] = useState(() => getSafeProfile());
  const [resumeFileName, setResumeFileName] = useState(profile.resumeFileName || "");
  const [headline, setHeadline] = useState(profile.headline || "");
  const [targetRole, setTargetRole] = useState(profile.targetRole || "");
  const [githubUrl, setGithubUrl] = useState(profile.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl || "");
  const [savedMessage, setSavedMessage] = useState("");

  const averageScore = useMemo(() => {
    const scoredSessions = sessions.filter((s) => typeof s?.review?.overall === "number");
    if (!scoredSessions.length) return null;
    const total = scoredSessions.reduce((sum, s) => sum + s.review.overall, 0);
    return Math.round(total / scoredSessions.length);
  }, [sessions]);

  const totalQuestions = useMemo(
    () => sessions.reduce((sum, s) => sum + (s.questionHistory?.length || 0), 0),
    [sessions]
  );

  const lastSession = sessions[0] || null;

  const saveProfile = () => {
    const nextProfile = {
      headline,
      targetRole,
      githubUrl,
      linkedinUrl,
      resumeFileName,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
    setProfile(nextProfile);
    setSavedMessage("Profile updated");
    setTimeout(() => setSavedMessage(""), 1800);
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFileName(file.name);
    setSavedMessage("Resume selected. Click Save Profile.");
    setTimeout(() => setSavedMessage(""), 1800);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 -right-20 w-[360px] h-[360px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(28,174,228,0.14) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-[30%] -left-16 w-[320px] h-[320px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(110,206,59,0.12) 0%, transparent 70%)" }}
        />
        <div className="absolute inset-0 soft-grid opacity-35" />
      </div>

      <nav className="glass-nav px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#1caee4] flex items-center justify-center">
              <FiMonitor className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-gray-700 text-xl tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              InterviewAce
            </span>
          </a>
        </div>
        <UserNav />
      </nav>

      <div className="relative max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6">
            <h1 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Welcome back, {user?.name || "Candidate"}
            </h1>
            <p className="text-gray-500 mt-2">Track progress, update your profile, and jump into your next mock interview.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/choose")}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1caee4] text-white font-semibold hover:bg-[#169ad0] transition-colors"
              >
                <FiPlayCircle />
                Start Interview
              </button>
              <button
                onClick={() => navigate("/history")}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
              >
                <FiClock />
                View History
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card rounded-xl p-5 border border-white/60">
              <p className="text-sm text-gray-500">Total Sessions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{sessions.length}</p>
            </div>
            <div className="glass-card rounded-xl p-5 border border-white/60">
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{averageScore ?? "--"}</p>
            </div>
            <div className="glass-card rounded-xl p-5 border border-white/60">
              <p className="text-sm text-gray-500">Questions Practiced</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalQuestions}</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/60">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Interview Sessions</h2>
            {sessions.length === 0 ? (
              <p className="text-gray-500">No sessions yet. Start your first interview to build your performance history.</p>
            ) : (
              <div className="space-y-3">
                {sessions.slice(0, 4).map((session, idx) => (
                  <div key={`${session.date}-${idx}`} className="p-4 rounded-xl border border-white/60 bg-white/70">
                    <p className="font-semibold text-gray-900">{session.topic} - {session.role}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {session.experience} · Score: {session.review?.overall ?? "--"} ·{" "}
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-6 border border-white/60">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Focus</h3>
              {[
                { label: "System Design", value: 70, color: "#8b5cf6" },
                { label: "Behavioral", value: 45, color: "#ec4899" },
                { label: "Frontend", value: 85, color: "#1caee4" },
              ].map((item) => (
                <div key={item.label} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>{item.label}</span>
                    <span className="font-semibold">{item.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200/60 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="glass-card rounded-2xl p-6 border border-white/60">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Next Session Plan</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Target Role</span>
                  <span className="font-semibold text-gray-900">{targetRole || "Frontend Engineer"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Focus Area</span>
                  <span className="font-semibold text-gray-900">System Design</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Estimated Time</span>
                  <span className="font-semibold text-gray-900">35 minutes</span>
                </div>
              </div>
              <button
                onClick={() => navigate("/choose")}
                className="mt-5 w-full py-2.5 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition-colors"
              >
                Start Planned Session
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Profile & Resume</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Headline</label>
                <input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Full Stack Developer with 2 years of experience"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#1caee4]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Target Role</label>
                <input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="Frontend Engineer"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#1caee4]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub URL</label>
                <input
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#1caee4]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn URL</label>
                <input
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#1caee4]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Resume (PDF/DOC)</label>
                <label className="w-full border border-dashed border-gray-300 rounded-xl px-3 py-4 flex items-center justify-center gap-2 text-gray-600 cursor-pointer hover:border-[#1caee4]">
                  <FiUploadCloud />
                  <span>{resumeFileName || "Choose file"}</span>
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
                </label>
                <p className="text-xs text-gray-500 mt-2">File name is saved to your local profile on this browser.</p>
              </div>

              <button
                onClick={saveProfile}
                className="w-full py-3 rounded-xl bg-[#1caee4] text-white font-semibold hover:bg-[#169ad0] transition-colors"
              >
                Save Profile
              </button>

              {savedMessage && <p className="text-sm text-green-600 font-medium">{savedMessage}</p>}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/60">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Snapshot</h3>
            <div className="space-y-3 text-sm">
              <p className="text-gray-600 flex items-center gap-2"><FiFileText className="text-[#1caee4]" /> Resume: {profile.resumeFileName || resumeFileName || "Not added"}</p>
              <p className="text-gray-600 flex items-center gap-2"><FiBookOpen className="text-[#1caee4]" /> Last Topic: {lastSession?.topic || "No sessions yet"}</p>
              <p className="text-gray-600 flex items-center gap-2"><FiClock className="text-[#1caee4]" /> Last Score: {lastSession?.review?.overall ?? "--"}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
