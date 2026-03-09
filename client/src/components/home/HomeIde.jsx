import React, { useRef, useState, useEffect } from "react";

export default function HomeIde() {
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
            className="relative py-28 px-6 lg:px-10 overflow-hidden bg-white"
        >
            {/* Subtle gradient bg */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(28,174,228,0.06) 0%, transparent 70%)" }} />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(110,206,59,0.04) 0%, transparent 70%)" }} />

            <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                {/* Left side */}
                <div
                    className="flex-1 max-w-xl"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(40px)",
                        transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
                    }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1caee4] text-xs font-bold tracking-wide mb-6">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                        BUILT-IN IDE
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.025em" }}>
                        Code Directly In
                        <br />
                        <span className="bg-gradient-to-r from-[#1caee4] to-blue-600 bg-clip-text text-transparent">Your Browser</span>
                    </h2>
                    <p className="text-gray-500 text-lg leading-relaxed mb-8">
                        Write, run, and debug code in 15+ languages without any setup. Our built-in IDE mirrors real interview environments so you can practice under realistic conditions.
                    </p>
                    <div className="flex flex-wrap gap-3 mb-8">
                        {["JavaScript", "Python", "Java", "C++", "Go", "Rust"].map(lang => (
                            <span key={lang} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold">{lang}</span>
                        ))}
                    </div>
                    <a
                        href="/choose"
                        className="inline-flex items-center gap-2 text-[15px] font-bold text-gray-900 hover:text-[#1caee4] transition-colors duration-200 group"
                    >
                        Try The IDE
                        <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </a>
                </div>

                {/* Right side — IDE Image */}
                <div
                    className="flex-1 flex justify-center"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(40px)",
                        transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s",
                    }}
                >
                    <div className="relative w-full max-w-[640px]">
                        <div className="absolute -inset-4 bg-gradient-to-br from-[#1caee4]/10 to-blue-600/5 rounded-3xl blur-2xl" />
                        <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
                            <img
                                src="/img2.png"
                                alt="Online IDE preview"
                                className="w-full h-auto"
                                style={{ display: "block" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
