import React from "react";
import { FiCheckSquare, FiTrendingUp } from "react-icons/fi";
import { features } from "../../data/homeData";
import { useNavigate } from "react-router-dom";

function ScoreRing({ score, size = 80, stroke = 6, color = "#1caee4" }) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (score / 100) * circ;
    return (
        <svg width={size} height={size} className="block">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
            <circle
                cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={color} strokeWidth={stroke}
                strokeDasharray={circ} strokeDashoffset={offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: "stroke-dashoffset 1s ease" }}
            />
            <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
                className="text-lg font-bold" fill="#1e293b" style={{ fontFamily: "'Outfit', sans-serif", fontSize: size * 0.24 }}>
                {score}%
            </text>
        </svg>
    );
}

function DashboardMockup() {
    const categories = [
        { label: "DSA", score: 85, color: "#1caee4" },
        { label: "System Design", score: 72, color: "#8b5cf6" },
        { label: "Frontend", score: 91, color: "#6ece3b" },
        { label: "Backend", score: 68, color: "#f59e0b" },
        { label: "Behavioral", score: 78, color: "#ec4899" },
    ];

    return (
        <div className="rounded-2xl bg-white border border-gray-200/80 shadow-[0_4px_6px_rgba(0,0,0,0.02),0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden select-none w-full" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: "0.88em" }}>
            {/* Window chrome */}
            <div className="flex items-center gap-1.5 px-4 h-8 bg-[#fafbfc] border-b border-gray-100">
                <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                <span className="w-2 h-2 rounded-full bg-[#28c840]" />
                <span className="flex-1 text-center text-[10px] text-gray-400 font-medium tracking-wide">Analytics Overview</span>
            </div>

            <div className="p-3.5 flex gap-3">
                {/* Left column */}
                <div className="flex flex-col gap-3 w-[38%] shrink-0">
                    {/* Overall ring */}
                    <div className="flex flex-col items-center justify-center bg-[#f8fafc] rounded-xl border border-gray-100 px-3 py-3">
                        <ScoreRing score={87} size={64} stroke={5} color="#1caee4" />
                        <span className="text-[8px] text-gray-500 font-semibold mt-1 tracking-widest uppercase">Overall</span>
                    </div>

                    {/* Mini stat grid */}
                    <div className="grid grid-cols-2 gap-1.5">
                        {[
                            { label: "Interviews", value: "24", accent: "#1caee4" },
                            { label: "Ranking", value: "Top 8%", accent: "#8b5cf6" },
                            { label: "Streak", value: "12 days", accent: "#6ece3b" },
                            { label: "Avg Score", value: "8.4/10", accent: "#f59e0b" },
                        ].map((s, i) => (
                            <div key={i} className="bg-[#f8fafc] rounded-lg border border-gray-100 px-2 py-1.5 flex flex-col justify-center">
                                <span className="text-[8px] text-gray-400 font-medium leading-none">{s.label}</span>
                                <span className="text-[12px] font-bold text-gray-900 leading-tight mt-0.5">{s.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-3 flex-1 min-w-0">
                    {/* Category scores */}
                    <div className="bg-[#f8fafc] rounded-xl border border-gray-100 p-2.5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-semibold text-gray-800 tracking-tight">Performance by Category</span>
                            <span className="text-[8px] text-gray-400 font-medium">Last 30 days</span>
                        </div>
                        <div className="space-y-1.5">
                            {categories.map((cat, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full shrink-0" style={{ background: cat.color }} />
                                    <span className="text-[10px] text-gray-600 font-medium w-17.5 shrink-0">{cat.label}</span>
                                    <div className="flex-1 h-1 bg-gray-200/70 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${cat.score}%`, background: cat.color }} />
                                    </div>
                                    <span className="text-[10px] font-semibold text-gray-800 w-7 text-right tabular-nums">{cat.score}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent sessions */}
                    <div className="bg-[#f8fafc] rounded-xl border border-gray-100 p-2.5">
                        <span className="text-[10px] font-semibold text-gray-800 tracking-tight block mb-1.5">Recent Sessions</span>
                        {[
                            { title: "System Design — URL Shortener", score: "8.5", tag: "System Design", tagColor: "bg-purple-100 text-purple-700", time: "2h ago" },
                            { title: "DSA — Binary Tree Traversal", score: "9.2", tag: "DSA", tagColor: "bg-sky-100 text-sky-700", time: "5h ago" },
                            { title: "Behavioral — Leadership", score: "7.8", tag: "Behavioral", tagColor: "bg-pink-100 text-pink-700", time: "1d ago" },
                        ].map((s, i) => (
                            <div key={i} className={`flex items-center gap-2 py-1.5 ${i > 0 ? "border-t border-gray-100" : ""}`}>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[10px] font-semibold text-gray-800 truncate leading-tight">{s.title}</div>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <span className={`text-[7px] font-bold px-1 py-px rounded ${s.tagColor}`}>{s.tag}</span>
                                        <span className="text-[8px] text-gray-400">{s.time}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-0.5 shrink-0">
                                    <span className="text-[12px] font-bold text-gray-900">{s.score}</span>
                                    <span className="text-[8px] text-gray-400">/10</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function DashboardSection() {
    return (
        <section className="py-28 px-6 bg-[#fafbfc]">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                {/* Left: Mockup — constrained smaller */}
                <div className="flex-1 order-2 lg:order-1 w-full flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-125">
                        <div className="absolute -inset-6 bg-linear-to-br from-[#1caee4]/6 to-purple-500/3 rounded-[28px] blur-2xl pointer-events-none" />
                        <div className="relative">
                            <DashboardMockup />
                        </div>
                    </div>
                </div>

                {/* Right: Copy */}
                <div className="flex-1 order-1 lg:order-2 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 text-[11px] font-bold tracking-widest mb-8">
                        <FiTrendingUp className="w-3.5 h-3.5" />
                        ANALYTICS
                    </div>

                    <h2 className="text-[2rem] md:text-[2.5rem] font-extrabold text-gray-900 leading-[1.15] mb-5" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.025em" }}>
                        Track Your Progress
                        <br />
                        <span className="bg-linear-to-r from-[#1caee4] to-[#179ad0] bg-clip-text text-transparent">With Precision</span>
                    </h2>

                    <p className="text-[17px] text-gray-500 mb-10 leading-relaxed max-w-md">
                        Deep insights into your performance across every interview domain. Pinpoint weaknesses before your real interviews.
                    </p>

                    <div className="space-y-4">
                        {[
                            { text: "Detailed scoring breakdown by category", icon: "chart" },
                            { text: "Historical performance tracking", icon: "clock" },
                            { text: "Personalized improvement suggestions", icon: "bulb" },
                            { text: "Global ranking among peers", icon: "trophy" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3.5">
                                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#6ece3b]/10 to-[#6ece3b]/5 flex items-center justify-center shrink-0">
                                    <svg className="w-4 h-4 text-[#6ece3b]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-[15px] text-gray-700 font-medium">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function TopicsSection() {
    const topics = [
        { name: "Frontend Engineering", level: "Beginner to Advanced", color: "from-blue-500 to-blue-600", icon: "React, Vue, HTML/CSS" },
        { name: "Backend & APIs", level: "Beginner to Advanced", color: "from-green-500 to-green-600", icon: "Node.js, Python, Java" },
        { name: "System Design", level: "Intermediate to Expert", color: "from-purple-500 to-purple-600", icon: "Architecture, Scaling" },
        { name: "Data Structures", level: "All Levels", color: "from-orange-500 to-orange-600", icon: "Trees, Graphs, DP" },
        { name: "Behavioral", level: "All Levels", color: "from-pink-500 to-pink-600", icon: "Leadership, Teamwork" },
        { name: "Full Stack", level: "Advanced", color: "from-indigo-500 to-indigo-600", icon: "End-to-end Apps" },
    ];

    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold tracking-wide mb-4">
                        INTERVIEW TOPICS
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Master Every Domain
                    </h2>
                    <p className="text-lg text-gray-500">
                        Choose from hundreds of specialized mock interviews tailored to your exact target role.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {topics.map((topic, i) => (
                        <div key={i} className="group relative p-6 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer">
                            <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${topic.color} flex items-center justify-center mb-4`}>
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#1caee4] transition-colors">{topic.name}</h3>
                            <p className="text-sm text-gray-500 mb-3">{topic.icon}</p>
                            <span className="inline-block px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">{topic.level}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function FeaturesGrid() {
    return (
        <section className="py-24 px-6 bg-gray-50/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold tracking-wide mb-4">
                        FEATURES
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Everything You Need To Succeed
                    </h2>
                    <p className="text-lg text-gray-500">
                        A complete toolkit designed by former FAANG interviewers.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <div key={i} className="group p-7 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#1caee4]/10 to-[#1caee4]/5 flex items-center justify-center text-[#1caee4] mb-5 group-hover:from-[#1caee4]/20 group-hover:to-[#1caee4]/10 transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-500 text-[15px] leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function InterviewAceProSection() {
    const navigate = useNavigate();
    return (
        <section className="py-24 px-6 bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-150 h-150 rounded-full" style={{ background: "radial-gradient(circle, rgba(28,174,228,0.06) 0%, transparent 70%)" }} />
            <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                <div className="flex-1 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r from-[#1caee4]/10 to-blue-600/10 text-[#1caee4] text-xs font-bold tracking-wide mb-6">
                        PRO PLAN
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Unlock Unlimited
                        <br />
                        <span className="bg-linear-to-r from-[#1caee4] to-blue-600 bg-clip-text text-transparent">Potential</span>
                    </h2>
                    <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                        Get unlimited AI mock interviews, advanced behavioral analysis, and priority support. Land your dream job faster.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => navigate("/pricing")}
                            className="px-7 py-3 rounded-lg bg-gray-900 text-white font-semibold text-[15px] hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            View Pricing
                        </button>
                        <button className="px-7 py-3 rounded-lg bg-white border border-gray-200 text-gray-700 font-semibold text-[15px] hover:bg-gray-50 transition-colors">
                            Compare Plans
                        </button>
                    </div>
                </div>
                <div className="flex-1 w-full flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-md">
                        <div className="absolute -inset-4 bg-linear-to-tr from-[#1caee4]/10 to-purple-500/10 rounded-3xl blur-2xl" />
                        <img
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                            alt="Team collaborating"
                            className="relative z-10 w-full h-auto object-cover rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-gray-200"
                        />
                        <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-gray-100 z-20 hidden sm:flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                <FiTrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 font-medium">Interview Success</div>
                                <div className="text-lg font-bold text-gray-900">+340%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function SkillBadgesSection() {
    const badges = [
        { icon: "⚛️", name: "React Expert" },
        { icon: "🐍", name: "Python Pro" },
        { icon: "⚙️", name: "System Design" },
        { icon: "🧮", name: "Algorithms" },
        { icon: "☁️", name: "Cloud Architecture" },
        { icon: "🔒", name: "Security" },
    ];
    return (
        <section className="py-16 px-6 bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Earn Verifiable Credentials
                </h2>
                <div className="flex flex-wrap justify-center gap-3">
                    {badges.map((badge, i) => (
                        <div key={i} className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-default">
                            <span className="text-xl">{badge.icon}</span>
                            <span className="font-semibold text-gray-700 text-sm">{badge.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function ExpertCoachingSection() {
    return (
        <section className="py-24 px-6 bg-gray-50/50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-linear-to-br from-purple-500/10 to-pink-500/5 rounded-3xl blur-2xl" />
                        <img
                            src="https://res.cloudinary.com/df2sjtgh6/image/upload/v1773064901/interviewer_vzwsxl.jpg"
                            alt="1-on-1 Coaching"
                            className="relative w-full h-auto rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-gray-200"
                        />
                    </div>
                </div>
                <div className="flex-1 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-xs font-bold tracking-wide mb-6">
                        1-ON-1 COACHING
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-5 leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Need A Human Touch?
                        <br />
                        <span className="text-[#1caee4]">Get Expert Coaching.</span>
                    </h2>
                    <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                        Connect with industry veterans from Google, Meta, and Amazon. Get personalized advice, career mapping, and live human mock interviews.
                    </p>
                    <button className="px-7 py-3 rounded-lg bg-gray-900 text-white font-semibold text-[15px] hover:bg-gray-800 transition-colors shadow-sm">
                        Browse Coaches
                    </button>
                </div>
            </div>
        </section>
    );
}
