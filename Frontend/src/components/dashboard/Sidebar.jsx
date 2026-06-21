import { NavLink } from "react-router-dom";
import { LayoutDashboard, Mic, History, Settings, BotMessageSquare, ChevronDown, X, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";
import useAuthStore from "../../store/useAuthStore";

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuthStore();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Mock Interviews", icon: Mic, path: "/mock-interviews" },
    { name: "Interview History", icon: History, path: "/history" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  const displayName = user?.name || "John Doe";
  const displayEmail = user?.email || "john.doe@email.com";
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0,2);

  return (
    <div className="w-[280px] h-full bg-[#050505] flex flex-col justify-between py-6 px-4 shrink-0 relative z-20">
      
      {/* Logo and Close Button */}
      <div className="flex items-center justify-between px-4 mb-10">
        <div className="flex items-center gap-3">
          <BotMessageSquare size={32} className="text-accentOrange drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
          <div className="flex flex-col">
            <h2 className="text-xl font-bold leading-tight tracking-tight">
              <span className="text-accentOrange">Mock</span>Mind
            </h2>
            <span className="text-[9px] text-secondary tracking-widest uppercase mt-0.5">Your Personalised Interviewer</span>
          </div>
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
      <div className="mt-auto px-4 pt-6 border-t border-white/5 flex items-center justify-between p-3 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accentOrange/20 border border-accentOrange/30 flex items-center justify-center text-accentOrange font-semibold text-sm shrink-0">
            {initials}
          </div>
          <div className="truncate">
            <p className="text-sm font-semibold text-white truncate">{displayName}</p>
            <p className="text-xs text-secondary truncate">{displayEmail}</p>
          </div>
        </div>
        <button 
          onClick={logout} 
          className="p-2 text-secondary hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>

    </div>
  );
}
