import React from "react";
import { FiStar, FiArrowRight } from "react-icons/fi";
import { trustedStats } from "../../data/homeData";
import { useNavigate } from "react-router-dom";

/* ─── Trusted By Section (goes right under hero) ─── */
export function TrustedBySection() {
    const logos = ["Google", "Meta", "Amazon", "Microsoft", "Apple", "Stripe"];
    return (
        <section className="py-12 px-6 bg-white border-b border-gray-100">
            <div className="max-w-5xl mx-auto text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Trusted by engineers at</p>
                <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
                    {logos.map((logo, i) => (
                        <span key={i} className="text-lg font-bold text-gray-300 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>{logo}</span>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Testimonials ─── */
export function TestimonialsSection() {
    const testimonials = [
        { quote: "The AI feedback was spot on. It caught my tendency to rush through corner cases.", name: "Sarah J.", role: "SWE @ Google", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" },
        { quote: "Practicing System Design here gave me the confidence to ace my Meta onsite.", name: "Michael L.", role: "Senior Engineer @ Meta", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" },
        { quote: "The behavioral interview simulation is incredibly realistic. Highly recommended.", name: "Emily R.", role: "PM @ Amazon", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80" }
    ];

    return (
        <section className="py-24 px-6" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/6 border border-white/10 text-gray-400 text-xs font-bold tracking-wide mb-4">
                        TESTIMONIALS
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Trusted By Top Developers
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <div key={i} className="p-7 rounded-2xl bg-white/4 border border-white/8 backdrop-blur-sm hover:bg-white/6 transition-colors">
                            <div className="flex gap-1 text-yellow-400 mb-5">
                                {[...Array(5)].map((_, j) => <FiStar key={j} className="fill-current w-4 h-4" />)}
                            </div>
                            <p className="text-gray-300 mb-6 text-[15px] leading-relaxed">"{t.quote}"</p>
                            <div className="flex items-center gap-3">
                                <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                <div>
                                    <div className="font-semibold text-white text-sm">{t.name}</div>
                                    <div className="text-xs text-[#1caee4]">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Featured Quote ─── */
export function SecondTestimonial() {
    return (
        <section className="relative overflow-hidden" style={{ background: "#2d3e50" }}>
            {/* Decorative blob on the left */}
            <div className="absolute top-0 left-0 h-full w-75 md:w-100" style={{ transform: "translateX(-30%)" }}>
                <svg viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                    <ellipse cx="180" cy="300" rx="220" ry="320" fill="#1caee4" opacity="0.25" />
                    <ellipse cx="140" cy="280" rx="160" ry="260" fill="#1caee4" opacity="0.35" />
                    <ellipse cx="100" cy="260" rx="110" ry="200" fill="#64d2f5" opacity="0.3" />
                </svg>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-28 md:py-36">
                {/* Quote icon */}
                <div className="text-[#1caee4] text-5xl font-black mb-8 leading-none select-none" style={{ fontFamily: "Georgia, serif" }}>"</div>

                {/* Quote text */}
                <blockquote className="text-xl md:text-3xl lg:text-[2rem] font-semibold text-white leading-relaxed mb-12 max-w-3xl mx-auto" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    InterviewAce completely transformed my prep. The AI didn't just tell me I was wrong — it explained why and how to improve. I landed 3 offers in a month.
                </blockquote>

                {/* Author */}
                <div className="text-center">
                    <div className="font-bold text-white text-lg mb-1">David Chen</div>
                    <div className="text-gray-400 text-sm">Software Engineer @ Stripe</div>
                </div>
            </div>
        </section>
    );
}

/* ─── Student Reviews Carousel ─── */
export function StudentReviews() {
    const reviews = [
        { text: "Best platform hands down for interview prep.", author: "Alex", score: "10/10" },
        { text: "Saved me months of aimless studying.", author: "Priya", score: "9.5/10" },
        { text: "The IDE experience is flawless.", author: "Sam", score: "10/10" },
        { text: "Worth every penny for Pro plan.", author: "Jordan", score: "9/10" },
    ];
    return (
        <section className="py-16 px-6 bg-white overflow-hidden">
            <div className="flex gap-5 animate-scroll-left">
                {[...reviews, ...reviews, ...reviews].map((r, i) => (
                    <div key={i} className="shrink-0 w-72 p-5 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="flex justify-between items-start mb-3">
                            <span className="font-bold text-gray-900 text-sm">{r.author}</span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-green-50 text-green-600">{r.score}</span>
                        </div>
                        <p className="text-gray-500 text-sm">"{r.text}"</p>
                    </div>
                ))}
            </div>
            <style>{`
        @keyframes scroll-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll-left { animation: scroll-left 30s linear infinite; width: max-content; }
        .animate-scroll-left:hover { animation-play-state: paused; }
      `}</style>
        </section>
    );
}

/* ─── Community ─── */
export function CommunitySection() {
    return (
        <section className="py-24 px-6 bg-gray-50/50">
            <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wide mb-5">
                    COMMUNITY
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-5" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Join 50,000+ Developers
                </h2>
                <p className="text-lg text-gray-500 mb-10">
                    Our Discord community is active 24/7. Find study partners, do peer mock interviews, and share offer negotiations.
                </p>
                <button className="px-7 py-3.5 rounded-lg bg-[#5865F2] text-white font-semibold text-[15px] hover:bg-[#4752C4] transition-colors shadow-sm shadow-[#5865F2]/20 flex items-center justify-center gap-2.5 mx-auto">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 127.14 96.36">
                        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77.7,77.7,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.2,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                    </svg>
                    Join Discord Server
                </button>
            </div>
        </section>
    );
}

/* ─── Featured In ─── */
export function FeaturedInSection() {
    const logos = ["TechCrunch", "Wired", "Forbes", "The Verge", "Business Insider"];
    return (
        <section className="py-10 bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Featured In</p>
                <div className="flex flex-wrap justify-center gap-10 md:gap-16">
                    {logos.map((logo, i) => (
                        <span key={i} className="text-xl font-bold text-gray-200 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>{logo}</span>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Resources / Free Course ─── */
export function ResourcesSection() {
    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
                <div className="flex-1 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-bold tracking-wide mb-6">
                        FREE RESOURCES
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-5 leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Free Interview Prep Course
                    </h2>
                    <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                        Not ready to mock just yet? Start with our comprehensive text-and-video course covering DSA, System Design, and behavioral strategies.
                    </p>
                    <a href="#" className="inline-flex items-center gap-2 text-[15px] font-bold text-[#1caee4] hover:text-[#179ad0] transition-colors group">
                        Explore Course
                        <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
                    </a>
                </div>
                <div className="flex-1 max-w-md">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-square bg-linear-to-br from-gray-100 to-gray-50 rounded-2xl border border-gray-100"></div>
                        <div className="aspect-square bg-linear-to-br from-blue-50 to-[#1caee4]/10 rounded-2xl border border-blue-100 mt-8"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Stats / Numbers ─── */
export function TrustedSection() {
    return (
        <section className="py-16 bg-gray-50/50 border-y border-gray-100">
            <div className="max-w-5xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {trustedStats.map((stat, i) => (
                        <div key={i} className="py-2">
                            <div className="text-4xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>{stat.number}</div>
                            <div className="text-gray-500 font-medium text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── CTA Section ─── */
export function CtaSection() {
    const navigate = useNavigate();
    return (
        <section className="py-28 px-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}>
            {/* Gradient orbs */}
            <div className="absolute -top-25 -left-12.5 w-100 h-100 rounded-full" style={{ background: "radial-gradient(circle, rgba(28,174,228,0.15) 0%, transparent 70%)" }} />
            <div className="absolute -bottom-25 -right-12.5 w-100 h-100 rounded-full" style={{ background: "radial-gradient(circle, rgba(110,206,59,0.1) 0%, transparent 70%)" }} />

            <div className="relative z-10 max-w-3xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Ready To Ace Your Interview?
                </h2>
                <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">Join thousands of developers who landed their dream jobs using InterviewAce.</p>
                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        onClick={() => navigate("/choose")}
                        className="px-8 py-3.5 rounded-lg font-bold text-[15px] text-white shadow-lg shadow-[#6ece3b]/25 hover:shadow-[#6ece3b]/40 hover:-translate-y-px transition-all"
                        style={{ background: "linear-gradient(135deg, #6ece3b 0%, #5cb832 100%)" }}
                    >
                        Get Started For Free
                    </button>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-8 py-3.5 rounded-lg border border-white/20 text-white font-semibold text-[15px] hover:bg-white/6 transition-all"
                    >
                        Log In
                    </button>
                </div>
            </div>
        </section>
    );
}

/* ─── Footer ─── */
export function HomeFooter() {
    const footerLinks = {
        "Interview Types": ["Technical Interview", "Behavioral Interview", "System Design", "Coding Challenges", "Mock Interviews", "Live Coding"],
        "Topics": ["Data Structures", "Algorithms", "JavaScript", "Python", "React", "Node.js", "SQL", "System Design"],
        "Resources": ["Blog", "Interview Guides", "Video Tutorials", "Practice Problems", "Cheat Sheets", "Community Forum"],
        "Platform": ["Live IDE", "AI Feedback", "Progress Tracking", "Custom Sessions", "Team Plans", "API Access"],
        "Company": ["About Us", "Careers", "Contact", "Press Kit", "Partners"],
        "Support": ["Help Center", "FAQ", "Terms of Service", "Privacy Policy", "Cookie Policy"],
    };

    return (
        <footer className="bg-[#f5f5f5] text-gray-600 pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Top section: Logo + Social */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#1caee4] flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <rect x="3" y="3" width="18" height="14" rx="2" />
                                <line x1="8" y1="21" x2="16" y2="21" />
                                <line x1="12" y1="17" x2="12" y2="21" />
                            </svg>
                        </div>
                        <span className="text-2xl font-extrabold text-gray-800" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Interview<span className="text-[#1caee4]">Ace</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href="#" className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-600 hover:text-gray-800">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-600 hover:text-gray-800">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-600 hover:text-gray-800">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-600 hover:text-gray-800">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-600 hover:text-gray-800">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </a>
                    </div>
                </div>

                {/* Link columns */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 py-12">
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="text-gray-800 font-semibold mb-4 text-xs uppercase tracking-[0.15em]">{category}</h4>
                            <ul className="space-y-2.5">
                                {links.map(link => (
                                    <li key={link}>
                                        <a href="#" className="text-[13px] text-gray-500 hover:text-[#1caee4] transition-colors">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">&copy; 2026 InterviewAce. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-sm text-gray-500 hover:text-[#1caee4] transition-colors">Terms</a>
                        <a href="#" className="text-sm text-gray-500 hover:text-[#1caee4] transition-colors">Privacy</a>
                        <a href="#" className="text-sm text-gray-500 hover:text-[#1caee4] transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
