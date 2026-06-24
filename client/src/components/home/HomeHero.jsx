import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomeHero() {
    const navigate = useNavigate();

    return (
        <section 
            className="relative w-full overflow-hidden min-h-[calc(100vh-72px)] py-16 lg:py-0 flex items-center"
            style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #1caee4 55%, #0f172a 140%)" }}
        >
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)" }}
                />
                <div
                    className="absolute bottom-[-160px] right-[-80px] w-[520px] h-[520px] rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(15,23,42,0.35) 0%, transparent 70%)" }}
                />
                <div className="absolute inset-0 soft-grid opacity-20" />
            </div>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8 justify-between">
                    
                    {/* LEFT SIDE: ILLUSTRATION */}
                    <div className="flex-1 w-full flex justify-center lg:justify-start relative min-h-[400px] lg:min-h-[500px]">
                        
                        {/* Abstract shapes */}
                        {/* Top Cross */}
                        <div className="absolute top-[15%] left-[25%] lg:left-[20%] text-[#111827] transform -rotate-12">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L13 13M13 1L1 13" stroke="#111827" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        
                        {/* Bottom Right Cross */}
                        <div className="absolute bottom-[20%] right-[15%] text-[#111827] transform rotate-12">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L13 13M13 1L1 13" stroke="#111827" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                        </div>

                        {/* Arc Curve */}
                        <svg className="absolute top-[35%] right-[5%]" width="40" height="70" viewBox="0 0 40 70" fill="none">
                            <path d="M 2,2 Q 38,35 2,68" stroke="#111827" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        </svg>

                        {/* Pink Blob */}
                        <div className="absolute bottom-[2%] left-[30%] w-[90px] h-[75px] bg-[#FFBBE0] border-[3px] border-[#111827] rounded-[50%_40%_60%_40%/40%_50%_50%_40%] transform -rotate-[15deg] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
                           <div className="absolute top-[-12px] right-[2px] w-6 h-6 border-t-[3px] border-r-[3px] border-[#111827] rounded-tr-full transform rotate-[25deg]"></div>
                        </div>

                        {/* The Three Pills */}
                        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full max-w-[340px] mx-auto pt-8">
                            
                            {/* Top Pill - Yellow */}
                            <div className="w-[200px] bg-[#FFC727] border-[3px] border-[#111827] rounded-full py-3.5 text-center font-bold text-[#111827] text-xl transform -rotate-[5deg] shadow-[5px_5px_0px_0px_rgba(17,24,39,1)] relative -ml-16 mb-5">
                                Practice
                            </div>
                            
                            {/* Middle Pill - Purple */}
                            <div className="w-[260px] bg-[#725BFF] border-[3px] border-[#111827] rounded-full py-4 text-center font-bold text-white text-[22px] transform rotate-[3deg] shadow-[5px_5px_0px_0px_rgba(17,24,39,1)] z-10 ml-6 mb-5">
                                Interviews
                            </div>
                            
                            {/* Bottom Pill - Green */}
                            <div className="w-[240px] bg-[#5DE380] border-[3px] border-[#111827] rounded-full py-4 text-center font-bold text-[#111827] text-[22px] transform -rotate-[2deg] shadow-[5px_5px_0px_0px_rgba(17,24,39,1)] relative -ml-8">
                                Succeed
                            </div>

                        </div>
                    </div>

                    {/* RIGHT SIDE: CONTENT & FORM */}
                    <div className="flex-1 w-full max-w-xl lg:max-w-[550px] z-10 lg:pl-10">
                        {/* Heading */}
                        <h1 
                            className="text-[3rem] md:text-[4rem] lg:text-[4.5rem] font-extrabold text-white leading-[1.05] tracking-tight mb-5"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            Master Your Next
                            <br />
                            <span className="bg-gradient-to-r from-white to-[#d0f4ff] text-transparent bg-clip-text">
                                Technical Interview
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-[17px] md:text-lg text-white/90 leading-relaxed mb-10 max-w-[480px]">
                            Practice with AI interviewers that adapt to your skill level. Get real-time feedback, detailed analytics, and land your dream job.
                        </p>

                        {/* Form / Inputs */}
                        <div className="glass-panel rounded-full p-1.5 flex flex-col sm:flex-row items-center max-w-[500px] mb-12 relative overflow-hidden">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="w-full sm:flex-1 bg-transparent border-none outline-none px-6 py-3 sm:py-0 text-gray-700 placeholder-gray-400 font-medium text-[15px]"
                            />
                            <button 
                                onClick={() => navigate("/choose")}
                                className="w-full sm:w-auto bg-[#725BFF] hover:bg-[#5f49e0] text-white px-8 py-3.5 rounded-full font-semibold transition-colors text-[15px] whitespace-nowrap"
                            >
                                Start Practicing
                            </button>
                        </div>

                        {/* Social Proof Text */}
                        <p className="text-[14px] font-medium text-white/80 mb-5 tracking-wide">
                            Largest companies find talent here.
                        </p>
                        
                        {/* Logos */}
                        <div className="flex items-center gap-8 text-white/70">
                            <span className="text-[24px] font-bold tracking-tighter" style={{ fontFamily: "Georgia, serif" }}>Google</span>
                            <span className="text-[28px] font-bold tracking-tight lowercase">hulu</span>
                            <span className="text-[20px] font-semibold uppercase tracking-widest">UBER</span>
                            <span className="text-[24px] font-bold tracking-tight lowercase" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>stripe</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}