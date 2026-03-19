import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo1.png";

export default function Layout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col font-sans">

      {/* Topbar */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 fixed top-0 left-0 w-full z-50">

        {/* Logo + Text */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="logo"
            className="w-12 h-12 object-contain"
          />
          <span className="text-2xl font-bold text-blue-500 tracking-wide">
            CRESTLANCING
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
            AD
          </div>

          <Bell size={18} className="text-violet-600" />

          <button
            className="border border-violet-500 text-sm text-violet-600 px-4 py-1.5 rounded-lg hover:bg-gray-50"
            onClick={() => {
              logout();              
              navigate("/login");    
            }}
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 pt-20">
        <Sidebar />

        <main className="flex-1 bg-slate-50 p-6 ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
}