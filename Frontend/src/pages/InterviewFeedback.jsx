import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { 
  Trophy, Download, Share2, MessageSquare, Lightbulb, 
  BookOpen, User, Gauge, CheckCircle2, MinusCircle, 
  XCircle, ChevronDown, ChevronUp, RefreshCw, Clock, 
  FileText, Star, BrainCircuit, Play
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/axios";

// Removed mockDetailedFeedback

export default function InterviewFeedback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const interviewId = searchParams.get('id');
  
  const [expandedId, setExpandedId] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data } = await api.get(`/interview/getInterviewById/${interviewId}`);
        setInterviewData(data.data.interview);
        setQuestions(data.data.questions || []);
      } catch (err) {
        console.error("Failed to fetch feedback", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (interviewId) {
      fetchFeedback();
    }
  }, [interviewId]);

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-500";
    if (score >= 5) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getScoreBg = (score) => {
    if (score >= 8) return "bg-green-500/10 border-green-500/20";
    if (score >= 5) return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-red-500/10 border-red-500/20";
  };
  
  const getScoreIcon = (score) => {
    if (score >= 8) return CheckCircle2;
    if (score >= 5) return MinusCircle;
    return XCircle;
  };
  
  const getScoreStatus = (score) => {
    if (score >= 8) return "Good";
    if (score >= 5) return "Partial";
    return "Needs Improvement";
  };

  let reportJson = {};
  if (interviewData?.report) {
    try {
      reportJson = JSON.parse(interviewData.report);
    } catch (e) {
      console.error("Failed to parse report JSON", e);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-inter flex justify-center p-6 pb-20">
      <div className="w-full max-w-[1400px] grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
        
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-4">
            {/* Glowing Trophy */}
            <div className="relative shrink-0 mt-2">
              <div className="absolute inset-0 bg-accentOrange/20 blur-2xl rounded-full"></div>
              <div className="relative w-32 h-32 rounded-full border border-accentOrange/30 flex items-center justify-center bg-[#0A0A0A]">
                <Trophy size={48} className="text-accentOrange drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
              </div>
              {/* Decorative Stars */}
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-accentOrange rounded-full shadow-[0_0_8px_rgba(249,115,22,1)] animate-pulse"></div>
              <div className="absolute bottom-6 left-2 w-2 h-2 bg-accentOrange rounded-full shadow-[0_0_8px_rgba(249,115,22,1)] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Interview Completed!</h1>
              <h2 className="text-2xl font-bold text-accentOrange mb-4">Great effort, keep it up!</h2>
              <p className="text-sm text-secondary max-w-xl mb-8 leading-relaxed">
                You've successfully completed the interview. Here's your AI-powered feedback and insights to help you improve.
              </p>
              
              <div className="flex items-center justify-center md:justify-start gap-4">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors">
                  <Share2 size={16} /> Share Feedback
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="glass-panel border border-borderCard rounded-2xl p-6 bg-[#0A0A0A]">
            <h3 className="text-[11px] font-bold text-white uppercase tracking-widest mb-6">Key Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
                 <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                   <MessageSquare size={16} className="text-green-500" />
                 </div>
                 <div>
                   <h4 className="text-xl font-bold text-white mb-0.5">{isLoading ? '--' : (reportJson?.metrics?.communication || 0)}%</h4>
                   <p className="text-[10px] text-secondary mb-1">Communication</p>
                 </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
                 <div className="w-8 h-8 rounded-lg bg-accentOrange/10 flex items-center justify-center">
                   <Lightbulb size={16} className="text-accentOrange" />
                 </div>
                 <div>
                   <h4 className="text-xl font-bold text-white mb-0.5">{isLoading ? '--' : (reportJson?.metrics?.problem_solving || 0)}%</h4>
                   <p className="text-[10px] text-secondary mb-1">Problem Solving</p>
                 </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
                 <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                   <FileText size={16} className="text-blue-500" />
                 </div>
                 <div>
                   <h4 className="text-xl font-bold text-white mb-0.5">{isLoading ? '--' : (reportJson?.metrics?.technical_knowledge || 0)}%</h4>
                   <p className="text-[10px] text-secondary mb-1">Technical Knowledge</p>
                 </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
                 <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                   <User size={16} className="text-purple-500" />
                 </div>
                 <div>
                   <h4 className="text-xl font-bold text-white mb-0.5">{isLoading ? '--' : (reportJson?.metrics?.confidence || 0)}%</h4>
                   <p className="text-[10px] text-secondary mb-1">Confidence</p>
                 </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
                 <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                   <Gauge size={16} className="text-red-500" />
                 </div>
                 <div>
                   <h4 className="text-xl font-bold text-white mb-0.5">{isLoading ? '--' : (reportJson?.metrics?.pace || 0)}%</h4>
                   <p className="text-[10px] text-secondary mb-1">Pace</p>
                 </div>
              </div>

            </div>
          </div>

          {/* Summary & Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Performance Summary */}
            <div className="glass-panel border border-borderCard rounded-2xl p-6 bg-[#0A0A0A]">
              <h3 className="text-[11px] font-bold text-white uppercase tracking-widest mb-4">Performance Summary</h3>
              {isLoading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : (
                <div className="space-y-4">
                  {interviewData?.strengths?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-green-500 mb-1">Strengths</h4>
                      <ul className="list-disc pl-4 text-sm text-gray-300">
                        {interviewData.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  {interviewData?.weaknesses?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-red-500 mb-1">Areas for Improvement</h4>
                      <ul className="list-disc pl-4 text-sm text-gray-300">
                        {interviewData.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Question Breakdown */}
            <div className="glass-panel border border-borderCard rounded-2xl p-6 bg-[#0A0A0A]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">Question Breakdown</h3>
                <div className="flex items-center gap-3 text-[9px] font-semibold">
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Correct / Good</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Partial</div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Needs Improvement</div>
                </div>
              </div>
              
              {/* Stacked Bar */}
              {isLoading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : (
                <>
                  <div className="w-full h-8 flex rounded-md overflow-hidden mb-3">
                    <div className="bg-green-500 flex items-center justify-center text-xs font-bold text-green-950" style={{ width: `${questions.length > 0 ? (questions.filter(q => q.score >= 8).length / questions.length) * 100 : 0}%` }}>{questions.filter(q => q.score >= 8).length || ''}</div>
                    <div className="bg-yellow-500 flex items-center justify-center text-xs font-bold text-yellow-950" style={{ width: `${questions.length > 0 ? (questions.filter(q => q.score >= 5 && q.score < 8).length / questions.length) * 100 : 0}%` }}>{questions.filter(q => q.score >= 5 && q.score < 8).length || ''}</div>
                    <div className="bg-red-500 flex items-center justify-center text-xs font-bold text-red-950" style={{ width: `${questions.length > 0 ? (questions.filter(q => q.score < 5).length / questions.length) * 100 : 0}%` }}>{questions.filter(q => q.score < 5).length || ''}</div>
                  </div>
                  <p className="text-[11px] text-secondary">Total Questions: {questions.length}</p>
                </>
              )}
            </div>

          </div>

          {/* Detailed Feedback Accordion */}
          <div className="glass-panel border border-borderCard rounded-2xl p-6 bg-[#0A0A0A]">
            <h3 className="text-[11px] font-bold text-white uppercase tracking-widest mb-6">Detailed Feedback</h3>
            
            <div className="space-y-3">
              {isLoading ? (
                <p className="text-secondary text-center py-4">Loading feedback...</p>
              ) : questions.length === 0 ? (
                <p className="text-secondary text-center py-4">No questions answered.</p>
              ) : questions.map((item, index) => {
                const Icon = getScoreIcon(item.score);
                const color = getScoreColor(item.score);
                const bgBorder = getScoreBg(item.score);
                
                return (
                  <div key={item._id} className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden transition-all duration-300">
                    
                    {/* Accordion Header */}
                    <button 
                      onClick={() => toggleAccordion(item._id)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                         <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 border", bgBorder, color)}>
                           <Icon size={16} />
                         </div>
                         <div>
                           <h4 className="text-sm font-semibold text-white mb-1">{index + 1}. {item.question}</h4>
                           <p className="text-[11px] text-gray-400">Score: {item.score}/10</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", color)}>
                          {getScoreStatus(item.score)}
                        </span>
                        {expandedId === item._id ? <ChevronUp size={16} className="text-secondary" /> : <ChevronDown size={16} className="text-secondary" />}
                      </div>
                    </button>

                    {/* Accordion Content */}
                    <AnimatePresence>
                      {expandedId === item._id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 pt-2 ml-12 border-t border-white/5 mt-2">
                            <h5 className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-2">Your Answer</h5>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4 italic">
                              "{item.answer}"
                            </p>
                            <h5 className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-2">AI Feedback</h5>
                            <p className="text-sm text-gray-300 leading-relaxed">
                              {item.feedback}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col items-center">
              <p className="text-sm text-gray-300 mb-4">Keep practicing and improve every day!</p>
              <button 
                onClick={() => navigate('/mock-interviews')}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-accentOrange hover:bg-orange-600 text-white font-bold shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all hover:scale-105"
              >
                <RefreshCw size={16} /> Start Another Interview
              </button>
            </div>
          </div>

        </div>

        {/* Right Column - Sidebar */}
        <div className="flex flex-col gap-6">
          
           {/* Total Time */}
           <div className="glass-panel border border-borderCard rounded-2xl p-6 bg-[#0A0A0A] flex items-center gap-6">
              <div className="w-16 h-16 rounded-full border-2 border-accentOrange flex items-center justify-center shrink-0">
                <Clock size={24} className="text-accentOrange" />
              </div>
              <div>
                <p className="text-[11px] text-secondary font-semibold uppercase tracking-widest mb-1">Total Time</p>
                <h3 className="text-2xl font-bold text-white leading-none mb-1">{isLoading ? '--' : (interviewData?.duration || (interviewData?.totalQuestions * 3))}:00</h3>
                <p className="text-xs text-gray-400">Minutes</p>
              </div>
           </div>

          {/* Overall Score */}
          <div className="glass-panel border border-borderCard rounded-2xl p-8 bg-[#0A0A0A] flex flex-col items-center text-center">
            <h3 className="text-[11px] font-bold text-secondary uppercase tracking-widest self-start mb-6 w-full text-left">Overall Score</h3>
            
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="452" strokeDashoffset={isLoading ? 452 : 452 - (452 * (interviewData?.overallScore || 0) / 100)} className="text-accentOrange drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" strokeLinecap="round" />
              </svg>
              <div className="text-center relative z-10 flex flex-col items-center">
                <div className="text-4xl font-bold text-white leading-none">{isLoading ? '--' : Math.round(interviewData?.overallScore || 0)}</div>
                <div className="text-[10px] text-secondary font-medium mt-1">/100</div>
              </div>
            </div>

            <h4 className="text-lg font-bold text-accentOrange mb-2">Very Good</h4>
            <p className="text-xs text-secondary leading-relaxed px-4">
              You performed well in the interview. Keep practicing to strengthen your weak areas.
            </p>
          </div>

          {/* Top Strengths */}
          <div className="glass-panel border border-borderCard rounded-2xl p-6 bg-[#0A0A0A]">
            <h3 className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-6">Top Strengths</h3>
            
            <div className="space-y-6">
              {isLoading ? (
                <p className="text-xs text-gray-500">Loading...</p>
              ) : interviewData?.strengths?.length > 0 ? (
                interviewData.strengths.slice(0, 3).map((strength, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                      <Star size={16} className="text-green-500" />
                    </div>
                    <div className="pt-1">
                      <p className="text-[12px] text-gray-300">{strength}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">No specific strengths highlighted.</p>
              )}
            </div>
          </div>

          {/* Areas to Improve */}
          <div className="glass-panel border border-borderCard rounded-2xl p-6 bg-[#0A0A0A]">
            <h3 className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-6">Areas to Improve</h3>
            
            <div className="space-y-6">
              {isLoading ? (
                <p className="text-xs text-gray-500">Loading...</p>
              ) : (interviewData?.weaknesses?.length > 0 || interviewData?.suggestions?.length > 0) ? (
                [...(interviewData?.weaknesses || []), ...(interviewData?.suggestions || [])].slice(0, 3).map((area, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accentOrange/10 border border-accentOrange/20 flex items-center justify-center shrink-0">
                      <FileText size={16} className="text-accentOrange" />
                    </div>
                    <div className="pt-1">
                      <p className="text-[12px] text-gray-300">{area}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">No specific areas to improve highlighted.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
