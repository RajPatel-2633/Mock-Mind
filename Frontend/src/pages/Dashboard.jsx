import { useState, useEffect } from "react";
import { Bell, Plus, BarChart2, TrendingUp, Star, Calendar, Briefcase, Code, Mic, Sparkles, Lightbulb, ArrowRight, Menu, Clock } from "lucide-react";
import Button from "../components/ui/Button";
import HeroBanner from "../components/dashboard/HeroBanner";
import StatCard from "../components/dashboard/StatCard";
import RecentMockRow from "../components/dashboard/RecentMockRow";
import StepItem from "../components/dashboard/StepItem";
import { motion } from "framer-motion";
import { useOutletContext, Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import api from "../lib/axios";

export default function Dashboard() {
  const { setIsSidebarOpen } = useOutletContext();
  const { user } = useAuthStore();
  
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    totalPracticeTime: 0,
    dayStreak: 0,
    recentInterviews: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/interview/dashboard-stats');
        setStats(data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Background ping to wake up the Hugging Face AI server early
    const wakeUpAI = async () => {
      try {
        await api.get('/interview/wake-up');
      } catch (error) {
        // Silently ignore errors since it's just a background ping
      }
    };

    fetchStats();
    wakeUpAI();
  }, []);

  return (
    <div className="w-full pb-10">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-5">

          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
            <p className="text-sm text-secondary">Let's practice and build your confidence.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">

          <div className="w-56">
            <Link to="/mock-interviews">
              <Button variant="primary">
                <Plus size={16} /> Start New Mock Interview
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <HeroBanner />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <StatCard icon={BarChart2} title="Mocks Taken" value={stats.totalInterviews.toString()} highlight="Total Interviews" delay={0.1} />
        <StatCard icon={TrendingUp} title="Average Score" value={stats.averageScore.toString()} subValue="/100" highlight="Across all mocks" delay={0.2} />
        <StatCard icon={Clock} title="Practice Time" value={stats.totalPracticeTime.toString()} subValue=" mins" highlight={<span className="text-accentOrange">Keep it up! 🔥</span>} delay={0.3} />
        <StatCard icon={Calendar} title="Day Streak" value={stats.dayStreak.toString()} highlight="Consecutive days" delay={0.4} />
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
            {isLoading ? (
              <div className="flex flex-col items-center justify-center flex-1 h-32">
                <div className="w-8 h-8 border-2 border-white/10 border-t-accentOrange rounded-full animate-spin mb-3"></div>
                <p className="text-secondary text-xs">Loading recent mocks...</p>
              </div>
            ) : stats.recentInterviews.length > 0 ? (
              stats.recentInterviews.map((mock) => (
                <RecentMockRow 
                  key={mock.id} 
                  icon={Briefcase} 
                  title={`${mock.techStack} Mock`} 
                  role={mock.role} 
                  score={mock.overallScore} 
                  date={new Date(mock.createdAt).toLocaleDateString()} 
                  time={new Date(mock.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 bg-white/[0.02] border border-white/5 rounded-xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-accentOrange/10 border border-accentOrange/20 flex items-center justify-center mb-4">
                  <Sparkles size={28} className="text-accentOrange" />
                </div>
                <h4 className="text-white font-semibold mb-2">No Mocks Yet</h4>
                <p className="text-secondary text-sm max-w-[250px] mb-6">Your recent interview history will appear here once you complete a mock interview.</p>
                <Link to="/mock-interviews">
                  <Button variant="primary" className="text-sm px-6 py-2">Start First Mock ✨</Button>
                </Link>
              </div>
            )}
          </div>
          {stats.recentInterviews.length > 0 && (
            <div className="mt-4 pt-4 border-t border-borderCard text-center">
              <Link to="/history" className="text-sm text-accentOrange font-medium hover:text-accentOrangeHover transition-colors flex items-center justify-center gap-1">
                View all history <ArrowRight size={14} />
              </Link>
            </div>
          )}
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
