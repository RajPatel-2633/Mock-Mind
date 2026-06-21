import { Loader2, Hourglass, Check } from "lucide-react";
import { cn } from "../../lib/utils";

export const AnalysisStepItem = ({ icon: Icon, stepNum, title, description, isLast, analysisStep }) => {
  const isActive = analysisStep === stepNum;
  const isCompleted = analysisStep > stepNum;
  const isPending = analysisStep < stepNum;

  return (
    <div className="relative flex items-start gap-4 mb-8">
      {!isLast && (
        <div className="absolute left-[23px] top-[48px] bottom-[-32px] w-[2px] bg-white/5"></div>
      )}
      
      <div className={cn(
        "relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-500 bg-[#0A0A0A]",
        isActive ? "border-accentOrange text-accentOrange shadow-[0_0_15px_rgba(249,115,22,0.3)]" : 
        isCompleted ? "border-white/10 text-white/50" : "border-white/5 text-white/20"
      )}>
        <Icon size={20} />
        {isActive && (
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-accentOrange rounded-full text-black flex items-center justify-center text-[10px] font-bold">
            {stepNum}
          </div>
        )}
      </div>
      
      <div className="flex-1 pt-1">
        <h4 className={cn("text-sm font-semibold mb-1 transition-colors duration-500", isActive ? "text-white" : isCompleted ? "text-gray-300" : "text-gray-500")}>{title}</h4>
        <p className="text-[11px] text-secondary">{description}</p>
      </div>
      
      <div className="pt-2 pl-2">
        {isCompleted && <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"><Check size={12} className="text-white" strokeWidth={3} /></div>}
        {isActive && <Loader2 size={20} className="text-accentOrange animate-spin" />}
        {isPending && <Hourglass size={18} className="text-white/20" />}
      </div>
    </div>
  );
};
