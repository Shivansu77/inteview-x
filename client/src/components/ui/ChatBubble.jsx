import React from "react";
import { FiUser, FiCpu } from "react-icons/fi";

export default function ChatBubble({ message }) {
  if (!message) return null;
  const isInterviewer = message.role === "interviewer";

  return (
    <div className={`chat-bubble ${isInterviewer ? "interviewer" : "candidate"}`}>
      <div className="chat-avatar-icon">
        {isInterviewer ? <FiCpu size={16} /> : <FiUser size={16} />}
      </div>
      <div className="chat-content">
        <span className="chat-role">{isInterviewer ? "Interviewer" : "You"}</span>
        <p className="chat-text">{message.text}</p>
      </div>
    </div>
  );
}
