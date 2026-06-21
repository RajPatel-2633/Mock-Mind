import { cn } from "../../lib/utils";

export default function TechCard({ title, icon, isSelected, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center p-6 h-40 rounded-2xl border transition-all duration-300 cursor-pointer group",
        isSelected 
          ? "border-accentOrange shadow-[0_0_20px_rgba(249,115,22,0.15)] bg-accentOrange/5" 
          : "border-borderCard bg-black/40 hover:border-white/20 hover:bg-white/[0.02]"
      )}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 text-accentOrange animate-fade-in">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      )}
      
      <div className={cn("mb-4 transition-transform duration-300 flex items-center justify-center w-20 h-20", isSelected ? "scale-110" : "group-hover:scale-110")}>
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-white mt-auto">{title}</h3>
    </div>
  );
}
