import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlay, FiUser, FiBriefcase, FiBookOpen } from 'react-icons/fi'

const ROLES = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'DevOps Engineer',
    'Mobile Developer',
    'UI/UX Designer',
    'Product Manager',
    'QA Engineer',
    'System Architect',
]

const EXPERIENCE_LEVELS = ['Fresher', 'Junior (1-2 yrs)', 'Mid (3-5 yrs)', 'Senior (5+ yrs)', 'Lead (8+ yrs)']

const TOPICS = [
    'JavaScript & React',
    'Python & Django',
    'Data Structures & Algorithms',
    'System Design',
    'Database & SQL',
    'Cloud & AWS',
    'Machine Learning',
    'REST APIs',
    'Behavioral Questions',
    'CSS & Web Design',
]

export default function LandingPage() {
    const navigate = useNavigate()
    const [role, setRole] = useState('')
    const [experience, setExperience] = useState('')
    const [topic, setTopic] = useState('')
    const [isHovering, setIsHovering] = useState(false)

    const canStart = role && experience && topic

    const handleStart = () => {
        if (!canStart) return
        navigate('/interview', { state: { role, experience, topic } })
    }

    return (
        <div className="landing-page">
            {/* Background decorations */}
            <div className="bg-orb bg-orb-1"></div>
            <div className="bg-orb bg-orb-2"></div>
            <div className="bg-orb bg-orb-3"></div>

            <div className="landing-container">
                {/* Logo */}
                <div className="landing-logo">
                    <div className="logo-icon">
                        <FiUser size={28} />
                    </div>
                    <h1>Interview<span className="accent">Ace</span></h1>
                </div>

                <p className="landing-subtitle">
                    AI-powered mock interviews with a virtual interviewer. <br />
                    Practice, get feedback, and ace your next interview.
                </p>

                {/* Form */}
                <div className="landing-form">
                    {/* Role */}
                    <div className="form-group">
                        <label><FiBriefcase size={16} /> Job Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="">Select a role...</option>
                            {ROLES.map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    {/* Experience */}
                    <div className="form-group">
                        <label><FiUser size={16} /> Experience Level</label>
                        <div className="chip-group">
                            {EXPERIENCE_LEVELS.map((level) => (
                                <button
                                    key={level}
                                    className={`chip ${experience === level ? 'active' : ''}`}
                                    onClick={() => setExperience(level)}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Topic */}
                    <div className="form-group">
                        <label><FiBookOpen size={16} /> Interview Topic</label>
                        <div className="chip-group">
                            {TOPICS.map((t) => (
                                <button
                                    key={t}
                                    className={`chip ${topic === t ? 'active' : ''}`}
                                    onClick={() => setTopic(t)}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Start Button */}
                    <button
                        className={`start-btn ${canStart ? 'ready' : 'disabled'}`}
                        onClick={handleStart}
                        disabled={!canStart}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <FiPlay size={20} />
                        <span>Start Interview</span>
                        {canStart && <div className="btn-shimmer"></div>}
                    </button>
                </div>

                <p className="landing-footer">
                    Powered by Google Gemini AI • Your data stays in your browser
                </p>
            </div>
        </div>
    )
}
