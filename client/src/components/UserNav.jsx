import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

export default function UserNav() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#1caee4] flex items-center justify-center text-white font-bold text-sm">
          {user.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {user.name || "User"}
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <FiLogOut className="w-4 h-4" />
        <span className="hidden sm:block">Logout</span>
      </button>
    </div>
  );
}
