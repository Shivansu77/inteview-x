import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMonitor, FiChevronLeft, FiGithub, FiMail, FiLock } from "react-icons/fi";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate login and redirect
        if (email && password) {
            navigate("/choose");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
            {/* Navbar Minimal */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => navigate("/")}
                    className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
                >
                    <FiChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-[#1caee4] flex items-center justify-center">
                        <FiMonitor className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-extrabold text-gray-700 text-xl tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>InterviewAce</span>
                </div>
                <div className="w-10"></div> {/* Spacer for centering */}
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-10 w-full max-w-md">

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Welcome back
                        </h1>
                        <p className="text-gray-500">Log in to track your mock interview progress.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FiMail className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-[#1caee4] focus:ring-2 focus:ring-[#1caee4]/20 transition-all font-medium"
                                    placeholder="alex@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-bold text-gray-900">Password</label>
                                <a href="#" className="text-sm font-semibold text-[#1caee4] hover:text-[#169ad0]">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FiLock className="text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-[#1caee4] focus:ring-2 focus:ring-[#1caee4]/20 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#1caee4] hover:bg-[#169ad0] text-white font-bold text-lg py-3.5 rounded-xl shadow-lg shadow-[#1caee4]/20 transition-all transform hover:-translate-y-0.5 mt-2"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none transition-colors">
                            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="font-semibold text-gray-700">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none transition-colors">
                            <FiGithub className="w-5 h-5 text-gray-900" />
                            <span className="font-semibold text-gray-700">GitHub</span>
                        </button>
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-600 font-medium">
                        Don't have an account?{' '}
                        <button onClick={() => navigate("/signup")} className="text-[#1caee4] hover:text-[#169ad0] font-bold">
                            Sign up today
                        </button>
                    </p>

                </div>
            </div>
        </div>
    );
}
