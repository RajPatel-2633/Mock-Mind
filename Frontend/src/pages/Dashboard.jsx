import { Bell, Plus, BarChart2, TrendingUp, Star, Calendar, Briefcase, Code, Mic, Sparkles, Lightbulb, ArrowRight, Menu } from "lucide-react";
import Button from "../components/ui/Button";
import HeroBanner from "../components/dashboard/HeroBanner";
import StatCard from "../components/dashboard/StatCard";
import RecentMockRow from "../components/dashboard/RecentMockRow";
import StepItem from "../components/dashboard/StepItem";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";

export default function Dashboard() {
  const { setIsSidebarOpen } = useOutletContext();
  
  const recentMocks = [
    { icon: Briefcase, title: "Frontend Developer Mock", role: "Frontend Developer", score: 8.6, date: "May 12, 2024", time: "02:30 PM" },
    { icon: Briefcase, title: "Product Manager Mock", role: "Product Manager", score: 7.2, date: "May 10, 2024", time: "11:15 AM" },
    { icon: BarChart2, title: "Data Analyst Mock", role: "Data Analyst", score: 8.1, date: "May 8, 2024", time: "04:45 PM" },
    { icon: Code, title: "Backend Developer Mock", role: "Backend Developer", score: 6.9, date: "May 6, 2024", time: "10:20 AM" },
  ];

  return (
    <div className="w-full pb-10">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-black/40 border border-white/5 text-secondary hover:text-white hover:bg-white/5 transition-all shadow-lg"
          >
            <Menu size={22} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back, John! 👋</h1>
            <p className="text-sm text-secondary">Let's practice and build your confidence.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-[#141414] border border-borderCard flex items-center justify-center text-secondary hover:text-white transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accentOrange rounded-full"></span>
          </button>
          <div className="w-56">
            <Button variant="primary">
              <Plus size={16} /> Start New Mock Interview
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <HeroBanner />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <StatCard icon={BarChart2} title="Mocks Taken" value="12" highlight="Total Interviews" delay={0.1} />
        <StatCard icon={TrendingUp} title="Average Score" value="7.8" subValue="/10" highlight="Across all mocks" delay={0.2} />
        <StatCard icon={Star} title="Best Score" value="9.3" subValue="/10" highlight={<span className="text-accentOrange">Keep it up! 🔥</span>} delay={0.3} />
        <StatCard icon={Calendar} title="Last Interview" value="May 12, 2024" highlight="2:30 PM" delay={0.4} />
      </div>

      {/* Bottom Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mt-8">
        
        {/* Recent Mocks */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-panel border border-borderCard rounded-2xl p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white">Recent Mocks</h3>
          </div>
          <div className="flex flex-col flex-1">
            {recentMocks.map((mock, idx) => (
              <RecentMockRow key={idx} {...mock} />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-borderCard text-center">
            <a href="#" className="text-sm text-accentOrange font-medium hover:text-accentOrangeHover transition-colors flex items-center justify-center gap-1">
              View all history <ArrowRight size={14} />
            </a>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-panel border border-borderCard rounded-2xl p-6 flex flex-col"
        >
          <h3 className="text-base font-bold text-white mb-6">How It Works</h3>
          <div className="flex flex-col flex-1">
            <StepItem icon={Briefcase} title="1. Choose a Role" description="Select the job role and experience level." />
            <StepItem icon={Mic} title="2. Start Speaking" description="Answer the questions out loud using your microphone." />
            <StepItem icon={Sparkles} title="3. Get AI Feedback" description="Receive instant feedback and score based on your response." isLast />
          </div>

          <div className="mt-6 bg-[#141414]/50 border border-borderCard rounded-xl p-4 flex gap-3">
            <Lightbulb size={18} className="text-accentOrange shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white mb-1">Tip</p>
              <p className="text-xs text-secondary leading-relaxed">Speak clearly and confidently for better results!</p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
