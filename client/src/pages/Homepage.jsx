import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiMonitor, FiUsers, FiCheckSquare, FiBarChart2, FiCode, FiShare2, FiGrid, FiBook, FiActivity, FiStar, FiMapPin, FiBookOpen, FiMic, FiCpu, FiAward, FiTrendingUp } from "react-icons/fi";

/* ════════════════════════════════════
   DATA
════════════════════════════════════ */
const navLinks = [
  { label: "Mock Interviews", hasDropdown: true },
  { label: "Platform", hasDropdown: true },
  { label: "Coding Practice", hasDropdown: false },
  { label: "AI Feedback", hasDropdown: false },
  { label: "Resources", hasDropdown: true },
  { label: "Pricing", hasDropdown: false },
];

const platformItems = {
  left: [
    { title: "AI Mock Interviews", desc: "Practice with our AI interviewer that adapts to your skill level", icon: <FiMic /> },
    { title: "Code Challenges", desc: "Solve real interview coding problems in our built-in IDE", icon: <FiCode /> },
    { title: "Performance Analytics", desc: "Track your progress and identify areas for improvement", icon: <FiBarChart2 /> },
  ],
  right: [
    { title: "Resume Review", desc: "Get AI-powered feedback on your technical resume", icon: <FiCheckSquare /> },
    { title: "Live Code Editor", desc: "Write, run, & debug code in a real-time collaborative IDE", icon: <FiMonitor /> },
    { title: "Interview Reports", desc: "Detailed scoring and feedback after every session", icon: <FiShare2 /> },
  ],
};

const mockInterviewsItems = {
  left: [
    { title: "Frontend Engineering", desc: "React, Vue, HTML/CSS practicals", icon: <FiCode /> },
    { title: "Backend & API", desc: "Node.js, Python, Java challenges", icon: <FiMonitor /> },
    { title: "System Design", desc: "Architecture, scaling, and databases", icon: <FiGrid /> },
  ],
  right: [
    { title: "Behavioral & Culture", desc: "Leadership, teamwork, Amazon LPs", icon: <FiUsers /> },
    { title: "Data Structures & Algorithms", desc: "Trees, Graphs, DP, and more", icon: <FiActivity /> },
    { title: "Full Stack Development", desc: "End-to-end application building", icon: <FiCheckSquare /> },
  ]
};

const resourcesItems = {
  left: [
    { title: "Interview Guides", desc: "Comprehensive step-by-step technical guides", icon: <FiBookOpen /> },
    { title: "Success Stories", desc: "Read how our students landed FAANG jobs", icon: <FiStar /> },
    { title: "Company Profiles", desc: "Specific interview processes by company", icon: <FiMapPin /> },
  ],
  right: [
    { title: "Resume Templates", desc: "ATS-friendly developer resume templates", icon: <FiBook /> },
    { title: "Career Blog", desc: "Tips for negotiation, job hunting, and growth", icon: <FiTrendingUp /> },
    { title: "Discord Community", desc: "Network with thousands of developers", icon: <FiShare2 /> },
  ]
};

const features = [
  { icon: <FiCpu className="w-8 h-8" />, title: "AI Interviewer", desc: "Realistic AI-powered mock interviews that simulate real technical interviews with adaptive difficulty." },
  { icon: <FiCode className="w-8 h-8" />, title: "Live Code Editor", desc: "Write, run, and debug code in 15+ languages directly in your browser during interviews." },
  { icon: <FiBarChart2 className="w-8 h-8" />, title: "Real-time Feedback", desc: "Get instant, detailed feedback on your answers, communication, and problem-solving approach." },
  { icon: <FiTrendingUp className="w-8 h-8" />, title: "Progress Dashboard", desc: "Track your improvement over time with comprehensive analytics and performance metrics." },
  { icon: <FiMic className="w-8 h-8" />, title: "Voice Interviews", desc: "Practice speaking through solutions naturally with speech-to-text and AI voice interaction." },
  { icon: <FiAward className="w-8 h-8" />, title: "Skill Certifications", desc: "Earn verifiable skill badges in DSA, System Design, React, Node.js, and more." },
];

const trustedStats = [
  { number: "50,000+", label: "Mock Interviews" },
  { number: "10,000+", label: "Active Users" },
  { number: "95%", label: "Success Rate" },
];

/* ════════════════════════════════════
   NAV DROPDOWN HELPERS
════════════════════════════════════ */
function useDropdownPos(btnRef, navRef, panelW) {
  const [pos, setPos] = useState({ left: 0, caretLeft: 80 });
  useEffect(() => {
    if (!btnRef?.current || !navRef?.current) return;
    const btn = btnRef.current.getBoundingClientRect();
    const nav = navRef.current.getBoundingClientRect();
    let left = btn.left + btn.width / 2 - panelW / 2 - nav.left;
    left = Math.max(8, Math.min(left, nav.width - panelW - 8));
    const caretLeft = btn.left + btn.width / 2 - nav.left - left - 7;
    setPos({ left, caretLeft });
  }, [btnRef, navRef, panelW]);
  return pos;
}

function DropdownShell({ pos, panelW, children }) {
  return (
    <div
      className="absolute bg-white rounded-b-xl shadow-2xl border-t-[3px] border-[#1caee4]"
      style={{ width: panelW, left: pos.left, top: "100%", zIndex: 999 }}
    >
      <div
        className="absolute -top-2.5 w-3.5 h-3.5 bg-white border-t-[3px] border-l-[3px] border-[#1caee4] rotate-45"
        style={{ left: pos.caretLeft }}
      />
      {children}
    </div>
  );
}

function PlatformRow({ item }) {
  return (
    <a href="#" className="flex items-start gap-3 group rounded-lg px-3 py-3 hover:bg-blue-50 transition-colors duration-150">
      <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-blue-100 text-[#1caee4] text-lg group-hover:bg-blue-200 transition-colors">
        {item.icon}
      </div>
      <div className="pt-0.5">
        <div className="text-sm font-semibold text-gray-900 group-hover:text-[#1caee4] transition-colors leading-tight">{item.title}</div>
        <div className="text-xs text-gray-500 mt-0.5 leading-snug">{item.desc}</div>
      </div>
    </a>
  );
}

function NavDropdown({ btnRef, navRef, items }) {
  const PANEL_W = 680;
  const pos = useDropdownPos(btnRef, navRef, PANEL_W);
  return (
    <DropdownShell pos={pos} panelW={PANEL_W}>
      <div className="grid grid-cols-2 gap-x-2 p-5">
        <div>{items.left.map(item => <PlatformRow key={item.title} item={item} />)}</div>
        <div>{items.right.map(item => <PlatformRow key={item.title} item={item} />)}</div>
      </div>
    </DropdownShell>
  );
}

/* ════════════════════════════════════
   SCROLL PARENT UTILITY
════════════════════════════════════ */
function getScrollParent(element) {
  if (!element) return window;
  const style = window.getComputedStyle(element);
  const overflowY = style.overflowY;
  if ((overflowY === "auto" || overflowY === "scroll") && element.scrollHeight > element.clientHeight) {
    return element;
  }
  return getScrollParent(element.parentElement) || window;
}

/* ════════════════════════════════════
   VIDEO SECTION (scroll-to-expand)
════════════════════════════════════ */
function VideoSection() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Find the real scrollable parent at mount time
    const scrollParent = getScrollParent(container.parentElement);

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress: 0 when section enters viewport bottom → 1 after scrolling much further (slower expansion)
      const raw = (vh - rect.top) / (vh * 1.2);
      const eased = 1 - Math.pow(1 - Math.min(Math.max(raw, 0), 1), 3); // easeOutCubic
      setProgress(eased);


      // Autoplay when video is visible
      if (videoRef.current) {
        if (eased > 0.05) {
          videoRef.current.play().catch(() => { });
        }
      }
    };

    const target = scrollParent === window ? window : scrollParent;
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Run once on mount to set initial state
    onScroll();

    return () => {
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Ensure video plays on mount too (handles autoplay policy)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const tryPlay = () => video.play().catch(() => { });
    tryPlay();
    video.addEventListener("canplay", tryPlay, { once: true });
    return () => video.removeEventListener("canplay", tryPlay);
  }, []);

  // scale: 0.52 → 1, border-radius: 28 → 8
  const scale = 0.52 + progress * 0.48;
  const radius = 28 - progress * 20;
  const opacity = 0.4 + progress * 0.6;

  return (
    <section ref={containerRef} className="pt-16 pb-32 px-6" style={{ background: "#0a0a0a", minHeight: "80vh" }}>
      <div className="max-w-6xl mx-auto" style={{ perspective: "1200px" }}>
        <div
          className="shadow-2xl overflow-hidden aspect-video mx-auto"
          style={{
            transform: `scale(${scale})`,
            borderRadius: `${radius}px`,
            opacity,
            transition: "transform 0.35s ease-out, border-radius 0.35s ease-out, opacity 0.35s ease-out",
            willChange: "transform, border-radius, opacity",
          }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════
   ONLINE IDE SECTION (scroll-animated)
════════════════════════════════════ */
function OnlineIdeSection() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-48 px-10 overflow-hidden"
      style={{ minHeight: "720px", background: "#ffffff" }}
    >
      {/* Decorative circles */}
      <div
        className="absolute rounded-full"
        style={{
          width: 700, height: 700,
          top: -80, right: -60,
          background: "linear-gradient(135deg, #1caee4 0%, #6dd5fa 50%, #2980b9 100%)",
          opacity: 0.12,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 520, height: 520,
          top: 60, right: 40,
          background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
          opacity: 0.08,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 400, height: 400,
          bottom: -40, left: -60,
          background: "linear-gradient(135deg, #1caee4 0%, #a5f3fc 100%)",
          opacity: 0.08,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-28">
        {/* Left side — Text (slides in from left) */}
        <div
          className="flex-1 max-w-2xl"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-60px)",
            transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <h2
            className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-8"
            style={{ letterSpacing: "-0.02em" }}
          >
            Online IDE Built for Education
          </h2>
          <p className="text-gray-500 text-xl md:text-2xl leading-relaxed mb-12">
            Write, run, &amp; debug code in any web browser, no account or
            downloads needed. Available in more than 10+ programming languages!
          </p>
          <a
            href="/choose"
            className="inline-flex items-center gap-2.5 text-xl font-bold text-gray-900 hover:text-[#1caee4] transition-colors duration-200 group"
          >
            Start Coding
            <svg
              className="w-6 h-6 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Right side — IDE Image (slides in from right) */}
        <div
          className="flex-1 flex justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(60px)",
            transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s",
          }}
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              maxWidth: 800,
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.12), 0 0 40px rgba(28,174,228,0.08)",
            }}
          >
            <img
              src="/icon2.png"
              alt="Online IDE preview"
              className="w-full h-auto object-cover"
              style={{ display: "block" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════
   MAIN HOMEPAGE
════════════════════════════════════ */
export default function Homepage() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);
  const platformBtnRef = useRef(null);
  const mockInterviewsBtnRef = useRef(null);
  const resourcesBtnRef = useRef(null);

  const getBtnRef = (label) => {
    if (label === "Platform") return platformBtnRef;
    if (label === "Mock Interviews") return mockInterviewsBtnRef;
    if (label === "Resources") return resourcesBtnRef;
    return undefined;
  };

  const toggle = (label) => setOpenMenu(prev => prev === label ? null : label);

  useEffect(() => {
    const onMouseDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-y-auto" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>

      {/* ═══════════ TOP NAVBAR ═══════════ */}
      <nav ref={navRef} className="bg-white border-b border-gray-200 shadow-sm sticky top-0" style={{ zIndex: 100 }}>
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between  h-14">

          {/* Logo */}
          <a href="#" className="flex items-center gap-2 mr-4 shrink-0">
            <div className="w-8 h-8 rounded bg-[#1caee4] flex items-center justify-center">
              <FiMonitor className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-gray-700 text-2xl tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>InterviewAce</span>
          </a>

          {/* Nav links */}
          <div className="flex items-center gap-0.5 ml-auto">
            {navLinks.map(({ label, hasDropdown }) => {
              const isOpen = openMenu === label;
              return (
                <button
                  key={label}
                  ref={hasDropdown ? getBtnRef(label) : undefined}
                  onClick={() => hasDropdown ? toggle(label) : undefined}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap transition-colors duration-150
                    ${isOpen ? "bg-gray-800 text-white" : "text-gray-700 hover:text-[#1caee4] hover:bg-gray-50"}`}
                >
                  {label}
                  {hasDropdown && (
                    <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <button className="px-4 py-1.5 rounded-full border-2 border-gray-800 text-gray-800 text-sm font-semibold hover:bg-gray-800 hover:text-white transition-colors duration-150">
              Blog
            </button>
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

        {/* Dropdowns */}
        {openMenu === "Platform" && <NavDropdown btnRef={platformBtnRef} navRef={navRef} items={platformItems} />}
        {openMenu === "Mock Interviews" && <NavDropdown btnRef={mockInterviewsBtnRef} navRef={navRef} items={mockInterviewsItems} />}
        {openMenu === "Resources" && <NavDropdown btnRef={resourcesBtnRef} navRef={navRef} items={resourcesItems} />}
      </nav>

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative w-full" style={{ height: "85vh", minHeight: "600px" }}>
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80"
            alt="Developer coding"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0f1b2d]/80"></div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 h-full">
          <h1 className="text-white text-4xl md:text-5xl lg:text-[4rem] font-extrabold leading-[1.1] max-w-195 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Ace Your Next<br />Technical Interview<br />With AI-Powered Practice
          </h1>

          {/* Buttons */}
          <div className="flex items-center gap-5 mt-12">
            <button
              onClick={() => navigate("/choose")}
              className="px-10 py-3 rounded-full bg-[#6ece3b] text-white text-[15px] font-semibold hover:bg-[#5cb832] transition-colors duration-200 shadow-lg"
            >
              Start Practicing Free
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-10 py-3 rounded-full border-2 border-white/50 text-white text-[15px] font-semibold hover:bg-white/10 transition-colors duration-200"
            >
              Log In
            </button>
          </div>
        </div>

        {/* Bottom wave / gradient fade */}
        <div className="absolute bottom-0 left-0 w-full h-32 overflow-hidden">
          <svg viewBox="0 0 1440 150" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
            <path fill="rgba(125,211,252,0.15)" d="M0,60 Q360,120 720,80 T1440,100 L1440,150 L0,150 Z" />
            <path fill="rgba(186,230,253,0.25)" d="M0,90 Q480,50 960,100 T1440,80 L1440,150 L0,150 Z" />
            <path fill="#f3f4f6" d="M0,120 Q360,100 720,130 T1440,115 L1440,150 L0,150 Z" />
          </svg>
        </div>
      </section>

      {/* ═══════════ VIDEO SECTION ═══════════ */}
      <VideoSection />

      {/* ═══════════ ONLINE IDE SECTION ═══════════ */}
      <OnlineIdeSection />

      {/* ═══════════ INTERVIEW DASHBOARD SECTION ═══════════ */}
      <section className="relative bg-white py-32 px-6 overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute rounded-full" style={{ width: 500, height: 500, top: -60, left: "15%", background: "radial-gradient(circle, #e0f2fe 0%, transparent 70%)", opacity: 0.6 }} />
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-20">
          {/* Left — Students Table */}
          <div className="flex-1 flex justify-center">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Interview Sessions</h3>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <span>KEY</span>
                  <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-pink-400 inline-block" />
                </div>
              </div>
              {/* Header row */}
              <div className="grid grid-cols-6 gap-2 mb-3 text-xs font-semibold text-[#1caee4]">
                <div className="col-span-1" />
                <div className="text-center">DSA</div>
                <div className="text-center">React</div>
                <div className="text-center">Node</div>
                <div className="text-center">SQL</div>
                <div className="text-center">System</div>
              </div>
              {/* Student rows */}
              {[
                { name: "You", avatar: true, dots: ["green", "green", "green", "yellow", "green"] },
                { name: null, dots: ["green", "yellow", "green", "green", "pink"] },
                { name: null, dots: ["yellow", "green", "green", "green", "green"] },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-6 gap-2 items-center py-3 border-t border-gray-50">
                  <div className="col-span-1 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                      {row.avatar ? "🧑‍💻" : "👤"}
                    </div>
                    {row.name ? (
                      <span className="text-sm font-medium text-gray-900 truncate">{row.name}</span>
                    ) : (
                      <div className="w-16 h-2.5 bg-gray-300 rounded-full" />
                    )}
                  </div>
                  {row.dots.map((color, j) => (
                    <div key={j} className="flex justify-center">
                      <div className={`w-4 h-4 rounded-full ${color === "green" ? "bg-green-500" :
                        color === "yellow" ? "bg-yellow-400" : "bg-pink-400"
                        }`} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* Right — Text */}
          <div className="flex-1 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5" style={{ letterSpacing: "-0.02em" }}>
              Smart Interview Dashboard
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Track your mock interview sessions, monitor performance across topics, and identify areas that need improvement — all in one place.
            </p>
            <a href="/choose" className="inline-flex items-center gap-1.5 text-base font-bold text-gray-900 hover:text-[#1caee4] transition-colors duration-200 group">
              Try It Now
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ INTERVIEW TOPICS SECTION ═══════════ */}
      <section className="relative bg-gray-50 py-32 px-6 overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 400, height: 400, bottom: -100, right: -80, background: "radial-gradient(circle, #e0f2fe 0%, transparent 70%)", opacity: 0.5 }} />
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-20">
          {/* Left — Text */}
          <div className="flex-1 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5" style={{ letterSpacing: "-0.02em" }}>
              Comprehensive Interview Topics
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Practice interviews across all major technical domains — from data structures and algorithms to system design, with AI-curated questions for every experience level.
            </p>
            <div className="flex flex-col gap-3">
              <a href="/choose" className="inline-flex items-center gap-1.5 text-base font-bold text-gray-900 hover:text-[#1caee4] transition-colors duration-200 group">
                Explore Technical Topics
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a href="/choose" className="inline-flex items-center gap-1.5 text-base font-bold text-gray-900 hover:text-[#1caee4] transition-colors duration-200 group">
                Explore Behavioral Topics
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
          {/* Right — Course Cards */}
          <div className="flex-1 flex justify-center">
            <div className="grid grid-cols-2 gap-5 max-w-md">
              {[
                { title: "Data Structures & Algorithms", emoji: "🧩" },
                { title: "System Design & Architecture", emoji: "🏗️" },
                { title: "Frontend Development (React)", emoji: "⚛️" },
                { title: "Backend & APIs (Node.js)", emoji: "🔌" },
              ].map((course, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="text-4xl mb-4">{course.emoji}</div>
                  <h4 className="text-sm font-bold text-gray-900 leading-snug mb-3">{course.title}</h4>
                  <a href="/choose" className="inline-flex items-center gap-1 text-xs font-bold text-[#1caee4] hover:text-[#169ad0] transition-colors group">
                    Practice Now
                    <svg className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIAL SECTION ═══════════ */}
      <section className="relative py-28 px-6 overflow-hidden" style={{ background: "#2c3e5a" }}>
        {/* Decorative circles */}
        <div className="absolute rounded-full" style={{ width: 500, height: 500, top: -180, left: -180, background: "linear-gradient(135deg, #1caee4 0%, #6dd5fa 100%)", opacity: 0.15 }} />
        <div className="absolute rounded-full" style={{ width: 300, height: 300, top: -100, left: -60, background: "linear-gradient(135deg, #1caee4 0%, #2980b9 100%)", opacity: 0.2 }} />

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          {/* Quote icon */}
          <div className="text-[#1caee4] text-5xl font-bold mb-6" style={{ fontFamily: "Georgia, serif" }}>"</div>
          <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-8" style={{ letterSpacing: "0.01em" }}>
            InterviewAce completely changed my interview prep. The AI feedback was incredibly detailed, and I landed my dream job at a top tech company after just 2 weeks of practice.
          </blockquote>
          <div className="text-white font-bold text-base mb-1">Priya Sharma</div>
          <div className="text-gray-400 text-sm">Software Engineer at Google, Ex-Fresher</div>
        </div>
      </section>

      {/* ═══════════ INTERVIEWACE PRO SECTION ═══════════ */}
      <section className="relative bg-white py-32 px-6 overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 550, height: 550, top: "50%", left: "20%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, #e0f2fe 0%, transparent 70%)", opacity: 0.5 }} />
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-20">
          {/* Left — Code Comparison UI */}
          <div className="flex-1 flex justify-center">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-md w-full">
              {/* Header bar */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50">
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">👤</div>
                <div className="w-20 h-2.5 bg-gray-300 rounded-full" />
              </div>
              {/* Split panels */}
              <div className="grid grid-cols-2 divide-x divide-gray-100">
                {/* Student Code */}
                <div className="p-4">
                  <div className="text-xs font-bold text-gray-900 mb-3">Your Code</div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded w-full" />
                    <div className="h-2 bg-gray-200 rounded w-3/4" />
                    <div className="h-2 bg-red-300 rounded w-1/2" />
                    <div className="h-2 bg-gray-200 rounded w-5/6" />
                    <div className="h-2 bg-red-300 rounded w-2/3" />
                    <div className="h-2 bg-gray-200 rounded w-full" />
                  </div>
                  <div className="mt-4 text-[10px] text-gray-400 font-medium">Score: <span className="text-gray-900 font-bold">8</span> out of 10</div>
                  <div className="flex gap-2 mt-3">
                    <div className="w-8 h-6 rounded bg-pink-300" />
                    <div className="w-8 h-6 rounded bg-teal-400" />
                  </div>
                </div>
                {/* Solution Code */}
                <div className="p-4">
                  <div className="text-xs font-bold text-gray-900 mb-3">Optimal Solution</div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-200 rounded w-full" />
                    <div className="h-2 bg-gray-200 rounded w-4/5" />
                    <div className="h-2 bg-green-400 rounded w-2/3" />
                    <div className="h-2 bg-green-400 rounded w-3/4" />
                    <div className="h-2 bg-green-400 rounded w-full" />
                    <div className="h-2 bg-green-400 rounded w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right — Text */}
          <div className="flex-1 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5" style={{ letterSpacing: "-0.02em" }}>
              InterviewAce Pro
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Compare your solutions with optimal answers, get line-by-line code review, and receive personalized improvement plans to accelerate your interview readiness.
            </p>
            <a href="/choose" className="inline-flex items-center gap-1.5 text-base font-bold text-gray-900 hover:text-[#1caee4] transition-colors duration-200 group">
              Upgrade to Pro
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ SKILL BADGES SECTION ═══════════ */}
      <section className="relative bg-gray-50 py-32 px-6 overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 600, height: 600, top: "50%", right: "10%", transform: "translate(30%,-50%)", background: "radial-gradient(circle, #e8f4f8 0%, transparent 70%)", opacity: 0.6 }} />
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-20">
          {/* Left — Text */}
          <div className="flex-1 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5" style={{ letterSpacing: "-0.02em" }}>
              Earn Skill Badges & Certifications
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Demonstrate your mastery with verifiable skill badges. Share them on LinkedIn, add them to your resume, and stand out to recruiters.
            </p>
            <a href="/choose" className="inline-flex items-center gap-1.5 text-base font-bold text-gray-900 hover:text-[#1caee4] transition-colors duration-200 group">
              Start Earning
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          {/* Right — Certification Badges */}
          <div className="flex-1 flex justify-center">
            <div className="relative" style={{ width: 380, height: 340 }}>
              {/* Central large badge */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-xl bg-white shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center p-2">
                <div className="text-xs font-bold text-gray-900 mb-0.5">InterviewAce</div>
                <div className="text-[10px] font-bold text-white bg-[#1caee4] rounded px-2 py-0.5">DSA Master</div>
                <div className="text-[8px] text-gray-400 mt-0.5 font-semibold">CERTIFIED</div>
              </div>
              {/* Top-right */}
              <div className="absolute right-4 top-0 w-20 h-20 rounded-lg bg-white shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center p-1.5">
                <div className="text-[10px] font-bold text-gray-900">InterviewAce</div>
                <div className="text-[8px] font-bold text-white bg-green-600 rounded px-1.5 py-0.5 mt-0.5">React Pro</div>
                <div className="text-[7px] text-gray-400 mt-0.5">CERTIFIED</div>
              </div>
              {/* Top-left */}
              <div className="absolute left-6 top-6 w-20 h-20 rounded-lg bg-white shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center p-1.5">
                <div className="text-[10px] font-bold text-gray-900">InterviewAce</div>
                <div className="text-[8px] font-bold text-white bg-purple-600 rounded px-1.5 py-0.5 mt-0.5">System Design</div>
                <div className="text-[7px] text-gray-400 mt-0.5">CERTIFIED</div>
              </div>
              {/* Bottom-left */}
              <div className="absolute left-4 bottom-4 w-20 h-20 rounded-lg bg-white shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center p-1.5">
                <div className="text-[10px] font-bold text-gray-900">InterviewAce</div>
                <div className="text-[8px] font-bold text-white bg-orange-500 rounded px-1.5 py-0.5 mt-0.5">Node.js</div>
                <div className="text-[7px] text-gray-400 mt-0.5">CERTIFIED</div>
              </div>
              {/* Bottom-right */}
              <div className="absolute right-2 bottom-8 w-20 h-20 rounded-lg bg-white shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center p-1.5">
                <div className="text-[10px] font-bold text-gray-900">InterviewAce</div>
                <div className="text-[8px] font-bold text-white bg-red-600 rounded px-1.5 py-0.5 mt-0.5">Python</div>
                <div className="text-[7px] text-gray-400 mt-0.5">CERTIFIED</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ EXPERT COACHING SECTION ═══════════ */}
      <section className="relative bg-white py-32 px-6 overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 500, height: 500, top: "50%", left: "10%", transform: "translate(-30%,-50%)", background: "radial-gradient(circle, #e0f2fe 0%, transparent 70%)", opacity: 0.5 }} />
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ maxWidth: 480 }}>
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                alt="Interview coaching session"
                className="w-full h-auto object-cover"
                style={{ display: "block" }}
              />
            </div>
          </div>
          <div className="flex-1 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5" style={{ letterSpacing: "-0.02em" }}>
              Expert Interview Coaching
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Get personalized guidance from AI trained on thousands of real interview patterns. Build confidence and master the art of technical communication.
            </p>
            <a href="/choose" className="inline-flex items-center gap-1.5 text-base font-bold text-gray-900 hover:text-[#1caee4] transition-colors duration-200 group">
              Explore Coaching
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ SECOND TESTIMONIAL ═══════════ */}
      <section className="relative bg-gray-50 py-24 px-6 overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 400, height: 400, top: -120, right: -120, background: "linear-gradient(135deg, #1caee4 0%, #6dd5fa 100%)", opacity: 0.1 }} />
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <div className="text-[#1caee4] text-5xl font-bold mb-6" style={{ fontFamily: "Georgia, serif" }}>"</div>
          <blockquote className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-8">
            For anyone preparing for technical interviews, InterviewAce is a game changer!
          </blockquote>
          <div className="text-gray-900 font-bold text-base mb-1">Aaron Grill</div>
          <div className="text-gray-500 text-sm">Senior Developer at Microsoft, IIT Delhi</div>
        </div>
      </section>

      {/* ═══════════ STUDENT REVIEWS SECTION ═══════════ */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Loved by Students and Professionals
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              See what our community has to say about their interview preparation journey with InterviewAce.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Rohan Kumar",
                role: "SDE @ Amazon",
                review: "The system design mock interviews are incredibly realistic. The feedback I received helped me clear my final round at Amazon. Highly recommend!",
                stars: 5,
                img: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                name: "Anjali Gupta",
                role: "Frontend Engineer @ Meta",
                review: "I heavily used the React coding practice editor. It completely changed the way I approach frontend machine coding rounds. 10/10!",
                stars: 5,
                img: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                name: "Vikram Singh",
                role: "Recent CS Grad",
                review: "As a fresher, I had no idea what to expect in tech interviews. The behavioral mock sessions gave me the confidence I needed to land my first job.",
                stars: 4,
                img: "https://randomuser.me/api/portraits/men/85.jpg"
              }
            ].map((student, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex gap-1 mb-4 text-[#f59e0b]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <FiStar key={idx} className={idx < student.stars ? "fill-current" : "text-gray-200"} />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{student.review}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <img src={student.img} alt={student.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="font-bold text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ JOIN COMMUNITY SECTION ═══════════ */}
      <section className="bg-gray-100 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3" style={{ fontStyle: "italic" }}>
            Join the InterviewAce Community
          </h2>
          <p className="text-gray-500 text-base mb-10 max-w-2xl mx-auto">
            There are many ways to get involved and network with fellow developers preparing for their next career move!
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="/signup" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-gray-300 text-sm font-semibold text-gray-700 hover:border-[#1caee4] hover:text-[#1caee4] transition-colors duration-200">
              <FiUsers className="w-4 h-4" /> Create a Free Account
            </a>
            <a href="#" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1caee4] text-sm font-semibold text-white hover:bg-[#169ad0] transition-colors duration-200 shadow-sm">
              <FiShare2 className="w-4 h-4" /> Join Our Discord
            </a>
            <a href="#" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-gray-300 text-sm font-semibold text-gray-700 hover:border-[#1caee4] hover:text-[#1caee4] transition-colors duration-200">
              <FiAward className="w-4 h-4" /> Become a Mentor
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURED IN SECTION ═══════════ */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-10">Featured In</h3>
          <div className="flex items-center justify-center gap-10 md:gap-16 flex-wrap opacity-50 grayscale">
            {["Forbes", "TechCrunch", "WSJ", "EdSurge", "YourStory", "Inc42", "Analytics India"].map((name) => (
              <div key={name} className="text-lg md:text-xl font-bold text-gray-700 tracking-tight">{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ BLOG / RESOURCES SECTION ═══════════ */}
      <section className="relative bg-white py-20 px-6 overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 400, height: 400, top: -100, left: -100, background: "linear-gradient(135deg, #1caee4 0%, #6dd5fa 100%)", opacity: 0.08 }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">More Resources</h2>
            <div className="flex items-center justify-center gap-4 text-sm">
              <a href="#" className="inline-flex items-center gap-1 font-semibold text-gray-700 hover:text-[#1caee4] transition-colors">
                Interview Tips <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </a>
              <a href="#" className="inline-flex items-center gap-1 font-semibold text-gray-700 hover:text-[#1caee4] transition-colors">
                Coding Guides <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { tag: "Interview Tips", title: "Top 10 DSA Patterns Every Developer Must Know", gradient: "from-[#1caee4] to-[#2980b9]" },
              { tag: "Career Guide", title: "How to Prepare for System Design Interviews in 2026", gradient: "from-[#6366f1] to-[#8b5cf6]" },
              { tag: "Success Story", title: "From 0 LeetCode to FAANG: A Step-by-Step Guide", gradient: "from-[#f59e0b] to-[#ef4444]" },
            ].map((post, i) => (
              <a key={i} href="#" className="group">
                <div className={`rounded-2xl h-48 bg-gradient-to-br ${post.gradient} flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow duration-300`}>
                  <div className="text-white text-5xl opacity-30">📝</div>
                </div>
                <div className="text-xs font-bold text-[#1caee4] mb-1">{post.tag}</div>
                <h4 className="text-base font-bold text-gray-900 group-hover:text-[#1caee4] transition-colors duration-200 leading-snug">{post.title}</h4>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TRUSTED SECTION ═══════════ */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Everything You Need to Succeed
          </h2>
          <p className="text-gray-500 text-base mb-12 max-w-xl mx-auto">
            InterviewAce is trusted by thousands of candidates worldwide to land their dream roles.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-16 flex-wrap">
            {trustedStats.map(({ number, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-extrabold text-[#1caee4]">{number}</div>
                <div className="text-sm text-gray-500 mt-1 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES GRID ═══════════ */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
            A Complete Platform for Technical Interviews
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-2xl mx-auto">
            Everything you need to practice, learn, and land your next role in one place.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 group"
              >
                <div className="w-14 h-14 rounded-xl bg-[#1caee4]/10 text-[#1caee4] flex items-center justify-center mb-4 group-hover:bg-[#1caee4] group-hover:text-white transition-colors duration-300">
                  {icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA SECTION ═══════════ */}
      <section className="bg-[#1caee4] py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to ace your interview?
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Join thousands of developers using InterviewAce to practice. Sign up for a free account today.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-3 rounded-full bg-white text-[#1caee4] text-base font-bold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            >
              Sign Up For Free
            </button>
            <button className="px-8 py-3 rounded-full border-2 border-white text-white text-base font-semibold hover:bg-white/10 transition-colors duration-200">
              Explore Pro Plans
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="bg-[#f8f9fa] border-t border-gray-200 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Top Row Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
            {/* Col 1: Logo & Socials */}
            <div className="col-span-2 md:col-span-3 lg:col-span-1 border-b lg:border-none pb-8 lg:pb-0 border-gray-200 mb-4 lg:mb-0">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded bg-[#1caee4] flex items-center justify-center">
                  <FiMonitor className="w-5 h-5 text-white" />
                </div>
                <span className="font-extrabold text-gray-900 text-2xl tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>InterviewAce</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 font-bold text-xs">
                <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-[#1caee4] hover:text-white transition-colors">in</a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-[#1caee4] hover:text-white transition-colors">X</a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-[#1caee4] hover:text-white transition-colors">yt</a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-[#1caee4] hover:text-white transition-colors">ig</a>
              </div>
            </div>

            {/* Col 2: Products */}
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-4">Products</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#1caee4]">Mock Interviews</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Online IDE</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">InterviewAce Pro</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Coding Practice</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Skill Badges</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">AI Resume Review</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Typing Speed</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">System Design Pad</a></li>
              </ul>
            </div>

            {/* Col 3: Use Cases */}
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-4">Use Cases</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#1caee4]">Freshers</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Experienced Pros</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Universities</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Bootcamps</a></li>
              </ul>
            </div>

            {/* Col 4: Platform */}
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-4">Platform</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#1caee4]">AI Interviewer</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Performance Tracking</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Peer Interviews</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Data & Analytics</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Write Code</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Integrations</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">AI Tools</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Academic Integrity</a></li>
              </ul>
            </div>

            {/* Col 5: Topics */}
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-4">Topics</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#1caee4]">Data Structures</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Algorithms</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">System Design</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Frontend (React)</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Backend (Node.js)</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Databases (SQL)</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Behavioral</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Practice Questions</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Company Specific</a></li>
              </ul>
            </div>

            {/* Col 6: Pro Features */}
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-4">Pro Features</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#1caee4]">Optimal Solutions</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">1-on-1 Coaching</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Unlimited Practice</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Premium Webinars</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Priority Support</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Row Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pt-6">
            <div className="hidden lg:block lg:col-span-1"></div> {/* Spacer */}

            {/* Languages */}
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-4">Languages</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#1caee4]">+ New Runtime</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">JavaScript</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Python</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Java</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">HTML</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">C++</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">SQL</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Go</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#1caee4]">Case Studies</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Guides</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Testimonials</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Socials</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">InterviewAce Blog</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Knowledge Base</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Webinars</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Success Stories</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Career Center</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Alumni Network</a></li>
              </ul>
            </div>

            {/* Everything You Need */}
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-4">InterviewAce Has Everything</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#1caee4]">Analytics</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Practice Rooms</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Behavioral Scenarios</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Assessments</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Academic Integrity</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Online IDE</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">Physical Computing</a></li>
                <li><a href="#" className="hover:text-[#1caee4]">System Design</a></li>
              </ul>
            </div>

            {/* Company / Legal */}
            <div className="col-span-2 lg:col-span-2 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-4">Company</h4>
                <div className="grid grid-cols-2 gap-4">
                  <ul className="space-y-3 text-sm text-gray-500 mb-8">
                    <li><a href="#" className="hover:text-[#1caee4]">About</a></li>
                    <li><a href="#" className="hover:text-[#1caee4]">Team</a></li>
                    <li><a href="#" className="hover:text-[#1caee4]">Careers</a></li>
                    <li><a href="#" className="hover:text-[#1caee4]">Privacy Center</a></li>
                    <li><a href="#" className="hover:text-[#1caee4]">Terms</a></li>
                    <li><a href="#" className="hover:text-[#1caee4]">Privacy Policy</a></li>
                    <li className="pt-6"><a href="#" className="hover:text-[#1caee4]">Security</a></li>
                    <li><a href="#" className="hover:text-[#1caee4]">Accessibility</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}