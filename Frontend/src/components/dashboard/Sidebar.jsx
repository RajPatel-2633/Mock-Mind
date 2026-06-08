import { NavLink } from "react-router-dom";
import { LayoutDashboard, Mic, History, Settings, BotMessageSquare, ChevronDown, X } from "lucide-react";
import { cn } from "../../lib/utils";

export default function Sidebar({ onClose }) {
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Mock Interviews", icon: Mic, path: "/mock-interviews" },
    { name: "Interview History", icon: History, path: "/history" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <div className="w-[280px] h-full bg-[#050505] flex flex-col justify-between py-6 px-4 shrink-0 relative z-20">
      
      {/* Logo and Close Button */}
      <div className="flex items-center justify-between px-4 mb-10">
        <div className="flex items-center gap-3">
          <BotMessageSquare size={32} className="text-accentOrange drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
          <h2 className="text-xl font-bold">
            <span className="text-accentOrange">AI</span> Interview
          </h2>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-secondary hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
              isActive 
                ? "bg-[#1f160e] text-accentOrange border border-accentOrange/20 shadow-[inset_0_0_20px_rgba(249,115,22,0.05)]" 
                : "text-secondary hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="mt-auto px-4 pt-6 border-t border-white/5 flex items-center justify-between cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accentOrange/20 border border-accentOrange/30 flex items-center justify-center text-accentOrange font-semibold text-sm">
            JD
          </div>
          <div>
            <p className="text-sm font-semibold text-white">John Doe</p>
            <p className="text-xs text-secondary">john.doe@email.com</p>
          </div>
        </div>
        <ChevronDown size={16} className="text-secondary" />
      </div>

    </div>
  );
}
