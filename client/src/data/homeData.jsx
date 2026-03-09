import React from "react";
import { FiChevronDown, FiMonitor, FiUsers, FiCheckSquare, FiBarChart2, FiCode, FiShare2, FiGrid, FiBook, FiActivity, FiStar, FiMapPin, FiBookOpen, FiMic, FiCpu, FiAward, FiTrendingUp } from "react-icons/fi";

export const navLinks = [
    { label: "Mock Interviews", hasDropdown: true },
    { label: "Platform", hasDropdown: true },
    { label: "Coding Practice", hasDropdown: false },
    { label: "AI Feedback", hasDropdown: false },
    { label: "Resources", hasDropdown: true },
    { label: "Pricing", hasDropdown: false },
];

export const platformItems = {
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

export const mockInterviewsItems = {
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

export const resourcesItems = {
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

export const features = [
    { icon: <FiCpu className="w-8 h-8" />, title: "AI Interviewer", desc: "Realistic AI-powered mock interviews that simulate real technical interviews with adaptive difficulty." },
    { icon: <FiCode className="w-8 h-8" />, title: "Live Code Editor", desc: "Write, run, and debug code in 15+ languages directly in your browser during interviews." },
    { icon: <FiBarChart2 className="w-8 h-8" />, title: "Real-time Feedback", desc: "Get instant, detailed feedback on your answers, communication, and problem-solving approach." },
    { icon: <FiTrendingUp className="w-8 h-8" />, title: "Progress Dashboard", desc: "Track your improvement over time with comprehensive analytics and performance metrics." },
    { icon: <FiMic className="w-8 h-8" />, title: "Voice Interviews", desc: "Practice speaking through solutions naturally with speech-to-text and AI voice interaction." },
    { icon: <FiAward className="w-8 h-8" />, title: "Skill Certifications", desc: "Earn verifiable skill badges in DSA, System Design, React, Node.js, and more." },
];

export const trustedStats = [
    { number: "50,000+", label: "Mock Interviews" },
    { number: "10,000+", label: "Active Users" },
    { number: "95%", label: "Success Rate" },
];
