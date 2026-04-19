import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Heart,
  LayoutDashboard,
  Map,
  Menu,
  MessageSquare,
  Moon,
  Sun,
  UserCircle,
  X
} from "lucide-react";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/analyze", icon: FileText, label: "Resume Analyzer" },
  { path: "/roadmap", icon: Map, label: "Career Roadmap" },
  { path: "/wellness", icon: Heart, label: "Wellness" },
  { path: "/interview", icon: MessageSquare, label: "Interview Prep" },
  { path: "/profile", icon: UserCircle, label: "My Profile" }
];

export default function Sidebar({ collapsed, onToggle, darkMode, onToggleDark }) {
  const location = useLocation();

  return (
    <>
      {!collapsed && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={onToggle} />
      )}

      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card border border-border shadow-sm"
      >
        {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full w-[260px] bg-card border-r border-border z-50 flex flex-col transition-transform duration-300 ease-out ${
          collapsed ? "-translate-x-full" : "translate-x-0"
        } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="p-5 flex items-center gap-3">
            <img
              src="/brand-mark.svg"
              alt="HireForge"
              className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 shadow-sm border border-border"
            />
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                HireForge
              </h1>
              <p className="text-xs text-muted-foreground">Career growth workspace</p>
            </div>
          </div>

          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                >
                  <motion.div
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 space-y-1 border-t border-border">
            <button
              onClick={onToggleDark}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary w-full transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <div className="px-3 py-2 text-xs text-muted-foreground">
              Connect Supabase to sync your data across devices.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
