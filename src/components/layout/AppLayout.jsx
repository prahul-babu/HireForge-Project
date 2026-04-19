import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import ChatBot from "@/components/chat/ChatBot";
import Sidebar from "@/components/layout/Sidebar";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 1024);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("hireforge-dark");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("hireforge-dark", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(!darkMode)}
      />
      <main className="lg:ml-[260px] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
          <Outlet />
        </div>
      </main>
      <ChatBot />
    </div>
  );
}
