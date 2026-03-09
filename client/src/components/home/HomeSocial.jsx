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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-gray-400 text-xs font-bold tracking-wide mb-4">
                        TESTIMONIALS
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Trusted By Top Developers
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <div key={i} className="p-7 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm hover:bg-white/[0.06] transition-colors">
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
        <section className="py-24 px-6 text-center" style={{ background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)" }}>
            <div className="max-w-3xl mx-auto">
                <div className="inline-flex gap-1 text-yellow-400 mb-8">
                    {[...Array(5)].map((_, j) => <FiStar key={j} className="fill-current w-5 h-5" />)}
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-10 leading-snug" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    "InterviewAce completely transformed my prep. The AI didn't just tell me I was wrong; it explained why and how to improve. I landed 3 offers in a month."
                </h2>
                <div className="flex items-center justify-center gap-3">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="David M." className="w-12 h-12 rounded-full border-2 border-[#1caee4]/50" />
                    <div className="text-left">
                        <div className="font-semibold text-white">David Chen</div>
                        <div className="text-gray-400 text-sm">Software Engineer @ Stripe</div>
                    </div>
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
                        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl border border-gray-100"></div>
                        <div className="aspect-square bg-gradient-to-br from-blue-50 to-[#1caee4]/10 rounded-2xl border border-blue-100 mt-8"></div>
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
            <div className="absolute top-[-100px] left-[-50px] w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(28,174,228,0.15) 0%, transparent 70%)" }} />
            <div className="absolute bottom-[-100px] right-[-50px] w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(110,206,59,0.1) 0%, transparent 70%)" }} />

            <div className="relative z-10 max-w-3xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Ready To Ace Your Interview?
                </h2>
                <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">Join thousands of developers who landed their dream jobs using InterviewAce.</p>
                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        onClick={() => navigate("/choose")}
                        className="px-8 py-3.5 rounded-lg font-bold text-[15px] text-white shadow-lg shadow-[#6ece3b]/25 hover:shadow-[#6ece3b]/40 hover:translate-y-[-1px] transition-all"
                        style={{ background: "linear-gradient(135deg, #6ece3b 0%, #5cb832 100%)" }}
                    >
                        Get Started For Free
                    </button>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-8 py-3.5 rounded-lg border border-white/20 text-white font-semibold text-[15px] hover:bg-white/[0.06] transition-all"
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
    return (
        <footer className="bg-[#0a0f1a] text-gray-400 py-16 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 border-b border-gray-800/50 pb-14 mb-8">
                <div className="col-span-2 lg:col-span-2 pr-8">
                    <div className="text-xl font-extrabold text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Interview<span className="text-[#1caee4]">Ace</span>
                    </div>
                    <p className="text-[15px] leading-relaxed text-gray-500 mb-6">The smartest way to prepare for technical interviews. AI-powered practice, live coding, and expert feedback in one place.</p>
                    <div className="flex gap-3">
                        <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-500 hover:text-white text-sm">X</a>
                        <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-500 hover:text-white text-sm">in</a>
                        <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-500 hover:text-white text-sm">GH</a>
                    </div>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-[0.15em]">Product</h4>
                    <ul className="space-y-2.5">
                        {["Mock Interviews", "Live IDE", "Pricing", "Enterprise"].map(l => (
                            <li key={l}><a href="#" className="text-[14px] text-gray-500 hover:text-white transition-colors">{l}</a></li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-[0.15em]">Resources</h4>
                    <ul className="space-y-2.5">
                        {["Blog", "Guides", "Community", "Help Center"].map(l => (
                            <li key={l}><a href="#" className="text-[14px] text-gray-500 hover:text-white transition-colors">{l}</a></li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-[0.15em]">Legal</h4>
                    <ul className="space-y-2.5">
                        {["Terms", "Privacy", "Cookies"].map(l => (
                            <li key={l}><a href="#" className="text-[14px] text-gray-500 hover:text-white transition-colors">{l}</a></li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600">&copy; 2026 InterviewAce. All rights reserved.</p>
            </div>
        </footer>
    );
}
