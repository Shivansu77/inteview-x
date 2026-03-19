import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomeHero() {
    const navigate = useNavigate();

    return (
        <section className="relative w-full overflow-hidden" style={{ background: "#1caee4" }}>
            {/* Subtle grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "40px 40px"
            }} />

            {/* Gradient orbs for depth */}
            <div className="absolute -top-50 -left-25 w-150 h-150 rounded-full" style={{ background: "radial-gradient(circle, rgba(28,174,228,0.15) 0%, transparent 70%)" }} />
            <div className="absolute-bottom-25 -right-12.5 w-125 h-125 rounded-full" style={{ background: "radial-gradient(circle, rgba(110,206,59,0.1) 0%, transparent 70%)" }} />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center min-h-[calc(100vh-72px)] py-20 lg:py-0 gap-12 lg:gap-8">
                    {/* Left side — Text content */}
                    <div className="flex-1 max-w-2xl z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm mb-8">
                            <span className="w-2 h-2 rounded-full bg-[#6ece3b] animate-pulse" />
                            <span className="text-sm font-medium text-white tracking-wide">AI-Powered Interview Preparation</span>
                        </div>

                        <h1 className="text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-extrabold text-white leading-[1.08] tracking-tight mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Master Your Next
                            <br />
                            <span className="bg-linear-to-r from-white to-[#d0f4ff] bg-clip-text text-transparent">
                                Technical Interview
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-lg">
                            Practice with AI interviewers that adapt to your skill level. Get real-time feedback, detailed analytics, and land your dream job.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mb-12">
                            <button
                                onClick={() => navigate("/choose")}
                                className="group px-8 py-3.5 rounded-lg font-bold text-[15px] text-white transition-all duration-200 shadow-lg shadow-[#6ece3b]/25 hover:shadow-[#6ece3b]/40 hover:-translate-y-px"
                                style={{ background: "linear-gradient(135deg, #6ece3b 0%, #5cb832 100%)" }}
                            >
                                Start Practicing Free
                                <svg className="inline-block w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="px-8 py-3.5 rounded-lg border border-white/40 text-white font-semibold text-[15px] hover:bg-white/15 transition-all duration-200"
                            >
                                Log In
                            </button>
                        </div>

                        {/* Social proof */}
                        <div className="flex items-center gap-6">
                            <div className="flex -space-x-2">
                                {[
                                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
                                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
                                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80",
                                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                                ].map((src, i) => (
                                    <img key={i} src={src} alt="" className="w-9 h-9 rounded-full border-2 border-[#1caee4] object-cover" />
                                ))}
                            </div>
                            <div className="text-sm">
                                <div className="flex items-center gap-1 text-yellow-300 mb-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    ))}
                                </div>
                                <span className="text-white/80">Loved by <strong className="text-white">10,000+</strong> developers</span>
                            </div>
                        </div>
                    </div>

                    {/* Right side — Hero visual */}
                    <div className="flex-1 w-full max-w-xl lg:max-w-none z-10">
                        <div className="relative">
                            {/* Glowing border effect */}
                            <div className="absolute -inset-1 bg-linear-to-r from-white/20 via-[#6ece3b]/20 to-white/20 rounded-2xl blur-sm" />

                            {/* Mock browser window */}
                            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#1a1a2e]">
                                {/* Browser chrome */}
                                <div className="flex items-center gap-2 px-4 py-3 bg-[#0d0d1a] border-b border-white/5">
                                    <div className="flex gap-1.5">
                                        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                                        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                        <span className="w-3 h-3 rounded-full bg-[#28ca42]" />
                                    </div>
                                    <div className="flex-1 mx-4">
                                        <div className="bg-white/5 rounded-md px-3 py-1 text-xs text-gray-500 text-center">interviewace.ai/interview</div>
                                    </div>
                                </div>

                                {/* Code/IDE content */}
                                <div className="p-5 font-mono text-sm leading-relaxed">
                                    <div className="flex gap-4 mb-4">
                                        <div className="text-gray-600 select-none text-right" style={{ minWidth: "1.5rem" }}>
                                            {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <div key={n}>{n}</div>)}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <div><span className="text-purple-400">function</span> <span className="text-[#6dd5fa]">twoSum</span><span className="text-gray-300">(</span><span className="text-orange-300">nums</span><span className="text-gray-500">,</span> <span className="text-orange-300">target</span><span className="text-gray-300">)</span> <span className="text-gray-300">{"{"}</span></div>
                                            <div>  <span className="text-purple-400">const</span> <span className="text-[#6dd5fa]">map</span> <span className="text-gray-300">=</span> <span className="text-purple-400">new</span> <span className="text-[#6dd5fa]">Map</span><span className="text-gray-300">();</span></div>
                                            <div></div>
                                            <div>  <span className="text-purple-400">for</span> <span className="text-gray-300">(</span><span className="text-purple-400">let</span> <span className="text-[#6dd5fa]">i</span> <span className="text-gray-300">=</span> <span className="text-orange-300">0</span><span className="text-gray-300">;</span> <span className="text-[#6dd5fa]">i</span> <span className="text-gray-300">&lt;</span> <span className="text-orange-300">nums</span><span className="text-gray-300">.</span><span className="text-[#6dd5fa]">length</span><span className="text-gray-300">;</span> <span className="text-[#6dd5fa]">i</span><span className="text-gray-300">++)</span> <span className="text-gray-300">{"{"}</span></div>
                                            <div>    <span className="text-purple-400">const</span> <span className="text-[#6dd5fa]">complement</span> <span className="text-gray-300">=</span></div>
                                            <div>      <span className="text-orange-300">target</span> <span className="text-gray-300">-</span> <span className="text-orange-300">nums</span><span className="text-gray-300">[</span><span className="text-[#6dd5fa]">i</span><span className="text-gray-300">];</span></div>
                                            <div></div>
                                            <div>    <span className="text-purple-400">if</span> <span className="text-gray-300">(</span><span className="text-[#6dd5fa]">map</span><span className="text-gray-300">.</span><span className="text-[#6dd5fa]">has</span><span className="text-gray-300">(</span><span className="text-[#6dd5fa]">complement</span><span className="text-gray-300">))</span></div>
                                            <div>      <span className="text-purple-400">return</span> <span className="text-gray-300">[</span><span className="text-[#6dd5fa]">map</span><span className="text-gray-300">.</span><span className="text-[#6dd5fa]">get</span><span className="text-gray-300">(</span><span className="text-[#6dd5fa]">complement</span><span className="text-gray-300">),</span> <span className="text-[#6dd5fa]">i</span><span className="text-gray-300">];</span></div>
                                            <div></div>
                                            <div>    <span className="text-[#6dd5fa]">map</span><span className="text-gray-300">.</span><span className="text-[#6dd5fa]">set</span><span className="text-gray-300">(</span><span className="text-orange-300">nums</span><span className="text-gray-300">[</span><span className="text-[#6dd5fa]">i</span><span className="text-gray-300">],</span> <span className="text-[#6dd5fa]">i</span><span className="text-gray-300">);</span></div>
                                            <div>  <span className="text-gray-300">{"}"}</span></div>
                                            <div><span className="text-gray-300">{"}"}</span></div>
                                        </div>
                                    </div>

                                    {/* AI Feedback bubble */}
                                    <div className="mt-2 p-3 rounded-lg bg-[#6ece3b]/10 border border-[#6ece3b]/20">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-5 h-5 rounded-full bg-[#6ece3b]/20 flex items-center justify-center text-[#6ece3b] text-xs">&#10003;</span>
                                            <span className="text-[#6ece3b] text-xs font-bold tracking-wide">AI FEEDBACK</span>
                                        </div>
                                        <p className="text-gray-400 text-xs leading-relaxed">Optimal O(n) solution using hash map. Clean variable naming. Consider adding input validation for edge cases.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}