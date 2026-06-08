import { Link } from "react-router-dom";
import { Clock, Calendar, ChevronRight, Award, History, CheckCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { ReactIcon, NodeIcon, PythonIcon } from "../components/mock-interview/icons";

const mockHistory = [
  {
    id: "int_1",
    role: "ReactJS Developer",
    icon: ReactIcon,
    date: "Oct 24, 2026",
    duration: "15 mins",
    questions: 6,
    score: 8.5
  },
  {
    id: "int_2",
    role: "NodeJS Backend Engineer",
    icon: NodeIcon,
    date: "Oct 20, 2026",
    duration: "20 mins",
    questions: 8,
    score: 7.0
  },
  {
    id: "int_3",
    role: "Python Data Scientist",
    icon: PythonIcon,
    date: "Sep 15, 2026",
    duration: "10 mins",
    questions: 5,
    score: 4.5
  }
];

export default function InterviewHistory() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <History className="text-accentOrange" /> Interview History
          </h1>
          <p className="text-secondary mt-2 text-sm leading-relaxed max-w-lg">
            Review your past performance and track your improvement over time. Click on any past interview to dive deep into the AI feedback.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel px-6 py-4 rounded-xl border border-white/5 flex flex-col justify-center shadow-lg">
             <span className="text-[10px] text-secondary uppercase tracking-widest font-bold mb-1">Total Interviews</span>
             <span className="text-3xl font-bold text-white">12</span>
          </div>
          <div className="glass-panel px-6 py-4 rounded-xl border border-white/5 flex flex-col justify-center shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-16 h-16 bg-accentOrange/20 blur-xl"></div>
             <span className="text-[10px] text-secondary uppercase tracking-widest font-bold mb-1">Avg Score</span>
             <span className="text-3xl font-bold text-accentOrange flex items-center gap-1">7.2<span className="text-sm text-secondary">/10</span></span>
          </div>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {mockHistory.map((interview) => (
          <div key={interview.id} className="glass-panel border border-borderCard rounded-2xl overflow-hidden hover:border-accentOrange/50 transition-colors group flex flex-col relative shadow-xl">
             
             {/* Score Badge Absolute */}
             <div className="absolute top-4 right-4">
               <div className={cn(
                 "px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 shadow-lg",
                 interview.score >= 8 ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                 interview.score >= 6 ? "bg-accentOrange/10 text-accentOrange border-accentOrange/20" : 
                 "bg-red-500/10 text-red-500 border-red-500/20"
               )}>
                 <Award size={14} /> {interview.score}/10
               </div>
             </div>

             {/* Card Top */}
             <div className="p-6 pb-5 flex items-start justify-between">
                <div className="flex flex-col gap-4">
                   <div className="w-14 h-14 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-2 shadow-inner">
                     <interview.icon />
                   </div>
                   <div className="pr-12">
                     <h3 className="font-bold text-white text-lg leading-tight mb-1">{interview.role}</h3>
                     <p className="text-xs text-secondary flex items-center gap-1"><Calendar size={12}/> {interview.date}</p>
                   </div>
                </div>
             </div>

             {/* Card Stats Grid */}
             <div className="px-6 py-5 grid grid-cols-2 gap-4 border-t border-white/5 bg-black/20">
                <div className="flex flex-col">
                  <span className="text-[10px] text-secondary uppercase tracking-widest font-bold mb-1 flex items-center gap-1"><Clock size={12}/> Duration</span>
                  <span className="text-sm font-semibold text-gray-200">{interview.duration}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-secondary uppercase tracking-widest font-bold mb-1 flex items-center gap-1"><CheckCircle size={12}/> Questions</span>
                  <span className="text-sm font-semibold text-gray-200">{interview.questions} answered</span>
                </div>
             </div>

             {/* Card Action */}
             <div className="p-4 mt-auto border-t border-white/5 bg-black/40">
                <Link to="/feedback" className="w-full py-3 rounded-xl bg-white/5 hover:bg-accentOrange text-white text-sm font-medium flex items-center justify-center gap-2 transition-all group-hover:bg-accentOrange group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                  Review Feedback <ChevronRight size={16} />
                </Link>
             </div>

          </div>
        ))}
      </div>

    </div>
  );
}
