import React from "react";
import { FiUser, FiCpu, FiHelpCircle, FiCornerDownRight } from "react-icons/fi";

export default function ChatBubble({ message }) {
  if (!message) return null;
  const isInterviewer = message.role === "interviewer";
  const isHint = message.type === "hint";
  const isFollowUp = message.type === "follow_up";

  return (
    <div className={`chat-bubble ${isInterviewer ? "interviewer" : "candidate"} ${isHint ? "hint" : ""}`}>
      <div className="chat-avatar-icon">
        {isHint ? <FiHelpCircle size={16} /> : isInterviewer ? <FiCpu size={16} /> : <FiUser size={16} />}
      </div>
      <div className="chat-content">
        <span className="chat-role">
          {isHint ? "Hint" : isInterviewer ? "Interviewer" : "You"}
          {isFollowUp && <span className="chat-badge follow-up-badge"><FiCornerDownRight size={10} /> Follow-up</span>}
        </span>
        <p className="chat-text">{message.text}</p>
      </div>
    </div>
  );
}
