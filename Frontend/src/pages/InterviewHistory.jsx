import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, Filter, ClipboardList, TrendingUp, Clock, 
  Trophy, MoreVertical, ChevronLeft, ChevronRight,
  Cloud, MessageSquare, Sparkles, Check
} from "lucide-react";
import Button from "../components/ui/Button";
import { cn } from "../lib/utils";
import { ReactIcon } from "../components/mock-interview/icons";
import api from "../lib/axios";

// Removed mock data
const ScoreGauge = ({ score, colorClass }) => (
  <div className="relative w-12 h-12 flex flex-col items-center justify-center mx-auto">
    <svg className="w-full h-full transform -rotate-90 absolute inset-0">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
      <circle 
        cx="24" cy="24" r="20" 
        stroke="currentColor" strokeWidth="3" fill="transparent" 
        strokeDasharray="125.6" 
        strokeDashoffset={125.6 - (125.6 * score) / 100} 
        className={colorClass} 
        strokeLinecap="round" 
      />
    </svg>
    <span className="text-sm font-bold text-white relative z-10">{score}</span>
  </div>
);

const getIcon = (type) => {
  switch(type) {
    case 'react':
      return <ReactIcon />;
    case 'node':
      return <img src="/NodeJS.jpg" alt="Node" className="w-full h-full object-contain rounded-md" />;
    case 'aws':
      return <Cloud className="text-orange-400 w-full h-full p-0.5" />;
    case 'java':
      return <img src="/Java.png" alt="Java" className="w-full h-full object-contain rounded-md" />;
    case 'behavioral':
      return <MessageSquare className="text-purple-400 w-full h-full p-1" />;
    default:
      return <div className="w-full h-full bg-white/10 rounded-md"></div>;
  }
};

export default function InterviewHistory() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    totalPracticeTime: 0,
    dayStreak: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const itemsPerPage = 5;

  let filteredInterviews = interviews.filter(interview => 
    interview.techStack?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    interview.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  filteredInterviews.sort((a, b) => {
    if (sortBy === "score-desc") return (b.overallScore || 0) - (a.overallScore || 0);
    if (sortBy === "score-asc") return (a.overallScore || 0) - (b.overallScore || 0);
    if (sortBy === "date-desc") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "date-asc") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === "diff-desc" || sortBy === "diff-asc") {
        const diffValues = { "easy": 1, "medium": 2, "hard": 3 };
        const diffA = diffValues[a.difficulty?.toLowerCase()] || 2;
        const diffB = diffValues[b.difficulty?.toLowerCase()] || 2;
        return sortBy === "diff-desc" ? diffB - diffA : diffA - diffB;
    }
    return 0;
  });

  const totalPages = Math.ceil(filteredInterviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInterviews = filteredInterviews.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [interviewsRes, statsRes] = await Promise.all([
          api.get('/interview/getInterviews'),
          api.get('/interview/dashboard-stats')
        ]);
        setInterviews(interviewsRes.data.data || []);
        setStats(statsRes.data.data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDifficultyColor = (diff) => {
    switch(diff?.toLowerCase()) {
      case 'easy': return 'text-green-500';
      case 'hard': return 'text-red-500';
      default: return 'text-accentOrange';
    }
  };

  const getScoreInfo = (score) => {
    if (score >= 80) return { text: "Excellent", color: "text-green-500" };
    if (score >= 60) return { text: "Good", color: "text-accentOrange" };
    if (score > 0) return { text: "Needs Work", color: "text-red-500" };
    return { text: "Pending", color: "text-gray-500" };
  };
  return (
    <div className="min-h-screen w-full pb-20 max-w-7xl mx-auto font-inter">
      
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">My Interviews</h1>
          <p className="text-sm text-secondary">View all your past AI mock interviews and track your progress.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search interviews..." 
              className="pl-10 pr-4 py-2.5 bg-black border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-accentOrange/50 w-64"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors text-sm font-medium", isFilterOpen ? "border-accentOrange bg-accentOrange/10 text-accentOrange" : "border-white/10 bg-black hover:bg-white/5 text-white")}
            >
              <Filter size={16} /> Sort By
            </button>
            
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-[#0a0a0a] shadow-xl py-2 z-50 text-sm">
                <div className="px-4 py-2 text-[10px] font-bold text-secondary uppercase tracking-wider">Sort Options</div>
                
                <button onClick={() => {setSortBy('date-desc'); setIsFilterOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-white/5 text-white flex items-center justify-between transition-colors">
                  <span>Newest First</span>
                  {sortBy === 'date-desc' && <Check size={14} className="text-accentOrange" />}
                </button>
                <button onClick={() => {setSortBy('date-asc'); setIsFilterOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-white/5 text-white flex items-center justify-between transition-colors">
                  <span>Oldest First</span>
                  {sortBy === 'date-asc' && <Check size={14} className="text-accentOrange" />}
                </button>
                
                <div className="my-1 border-t border-white/5"></div>
                
                <button onClick={() => {setSortBy('score-desc'); setIsFilterOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-white/5 text-white flex items-center justify-between transition-colors">
                  <span>Highest Score</span>
                  {sortBy === 'score-desc' && <Check size={14} className="text-accentOrange" />}
                </button>
                <button onClick={() => {setSortBy('score-asc'); setIsFilterOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-white/5 text-white flex items-center justify-between transition-colors">
                  <span>Lowest Score</span>
                  {sortBy === 'score-asc' && <Check size={14} className="text-accentOrange" />}
                </button>
                
                <div className="my-1 border-t border-white/5"></div>
                
                <button onClick={() => {setSortBy('diff-desc'); setIsFilterOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-white/5 text-white flex items-center justify-between transition-colors">
                  <span>Hardest Difficulty</span>
                  {sortBy === 'diff-desc' && <Check size={14} className="text-accentOrange" />}
                </button>
                <button onClick={() => {setSortBy('diff-asc'); setIsFilterOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-white/5 text-white flex items-center justify-between transition-colors">
                  <span>Easiest Difficulty</span>
                  {sortBy === 'diff-asc' && <Check size={14} className="text-accentOrange" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="glass-panel border border-borderCard rounded-2xl p-6 md:p-8 mb-8 bg-[#0A0A0A]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x divide-transparent md:divide-white/5">
          
          <div className="flex items-center gap-4 md:px-4">
            <div className="w-12 h-12 rounded-full bg-accentOrange/10 border border-accentOrange/20 flex items-center justify-center shrink-0">
              <ClipboardList size={20} className="text-accentOrange" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-0.5">{stats.totalInterviews}</h3>
              <p className="text-xs text-secondary">Total Interviews</p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:px-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
              <TrendingUp size={20} className="text-green-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-0.5">{stats.averageScore}</h3>
              <p className="text-xs text-secondary">Average Score</p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:px-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Clock size={20} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-0.5">{stats.totalPracticeTime}m</h3>
              <p className="text-xs text-secondary">Total Practice Time</p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:px-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Trophy size={20} className="text-purple-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-0.5">{stats.dayStreak}</h3>
              <p className="text-xs text-secondary">Day Streak</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Table Area */}
      <div className="glass-panel border border-borderCard rounded-2xl bg-[#0A0A0A] overflow-hidden flex flex-col">
        


        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b border-white/5 bg-black/20 text-[10px] font-bold text-secondary uppercase tracking-widest">
          <div className="col-span-3">Interview</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Difficulty</div>
          <div className="col-span-1 text-center">Score</div>
          <div className="col-span-1 text-center">Duration</div>
          <div className="col-span-2">Date ↓</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {/* Table Rows */}
        <div className="flex flex-col">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-white/10 border-t-accentOrange rounded-full animate-spin mb-3"></div>
              <div className="text-secondary text-sm">Loading interviews...</div>
            </div>
          ) : interviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-accentOrange/10 border border-accentOrange/20 flex items-center justify-center mb-4">
                <Sparkles size={28} className="text-accentOrange" />
              </div>
              <h4 className="text-white text-lg font-semibold mb-2">No Interviews Yet</h4>
              <p className="text-secondary text-sm max-w-sm mb-6">You haven't completed any mock interviews. Start one today to get personalized AI feedback!</p>
              <Link to="/mock-interviews">
                <Button variant="primary" className="text-sm px-6 py-2">Start Your First Mock ✨</Button>
              </Link>
            </div>
          ) : (
            currentInterviews.map((interview) => {
              const diffColor = getDifficultyColor(interview.difficulty);
              const scoreInfo = getScoreInfo(interview.overallScore);
              
              return (
                <div key={interview._id} className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center group">
                  
                  {/* Interview Column */}
                  <div className="col-span-3 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center p-2 shrink-0">
                      {getIcon(interview.techStack?.toLowerCase() || 'other')}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">{interview.techStack} Interview</h4>
                      <p className="text-xs text-secondary">{interview.totalQuestions} Questions</p>
                    </div>
                  </div>

                  {/* Role Column */}
                  <div className="col-span-2 flex flex-col justify-center">
                    <p className="text-sm font-semibold text-gray-300 mb-1">{interview.role}</p>
                    <p className="text-xs text-secondary">{interview.experience}</p>
                  </div>

                  {/* Difficulty Column */}
                  <div className="col-span-2 flex items-center">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <span className={cn("w-2 h-2 rounded-full", diffColor)}></span>
                      {interview.difficulty || "Medium"}
                    </div>
                  </div>

                  {/* Score Column */}
                  <div className="col-span-1 flex flex-col items-center justify-center gap-1">
                    <ScoreGauge score={interview.overallScore} colorClass={scoreInfo.color} />
                    <span className={cn("text-[10px] font-bold", scoreInfo.color)}>{scoreInfo.text}</span>
                  </div>

                  {/* Duration Column */}
                  <div className="col-span-1 flex items-center justify-center">
                    <p className="text-xs text-gray-300 flex items-center gap-1.5">
                      <Clock size={12} className="text-secondary" /> {interview.duration || (interview.totalQuestions ? interview.totalQuestions * 3 : 0)} min
                    </p>
                  </div>

                  {/* Date Column */}
                  <div className="col-span-2 flex flex-col justify-center">
                    <p className="text-sm text-gray-300 mb-1">
                      {new Date(interview.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit', month: '2-digit', year: '2-digit'
                      })}
                    </p>
                    <p className="text-xs text-secondary">{new Date(interview.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>

                  {/* Action Column */}
                  <div className="col-span-1 flex items-center justify-end gap-3">
                    <button 
                      onClick={() => navigate(`/feedback?id=${interview._id}`)}
                      className="px-4 py-1.5 text-xs font-semibold text-accentOrange border border-accentOrange/20 bg-accentOrange/5 hover:bg-accentOrange/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      View Feedback
                    </button>
                    <button className="text-secondary hover:text-white transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Pagination Footer */}
      {filteredInterviews.length > 0 && (
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-secondary">
          <p>Showing {filteredInterviews.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredInterviews.length)} of {filteredInterviews.length} interviews</p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-lg border transition-colors text-sm",
                    currentPage === i + 1 
                      ? "border-accentOrange text-accentOrange font-medium bg-accentOrange/10" 
                      : "border-white/10 hover:bg-white/5 text-gray-300"
                  )}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
