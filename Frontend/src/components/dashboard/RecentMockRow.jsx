import { ChevronRight } from "lucide-react";

export default function RecentMockRow({ icon: Icon, title, role, score, date, time }) {
  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-500 bg-green-500/10";
    if (score >= 7) return "text-accentOrange bg-accentOrange/10";
    return "text-red-500 bg-red-500/10";
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-borderCard last:border-0 hover:bg-white/[0.02] -mx-4 px-4 rounded-xl transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#141414] border border-white/5 flex items-center justify-center text-accentOrange shrink-0">
          <Icon size={20} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-0.5">{title}</h4>
          <p className="text-xs text-secondary">Role: {role}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className={`px-3 py-1 rounded-md text-xs font-bold ${getScoreColor(score)}`}>
          {score.toFixed(1)}
        </div>
        <div className="text-right w-24 hidden sm:block">
          <p className="text-xs text-secondary mb-0.5">{date}</p>
          <p className="text-[10px] text-gray-500">{time}</p>
        </div>
        <ChevronRight size={16} className="text-secondary group-hover:text-white transition-colors" />
      </div>
    </div>
  );
}
