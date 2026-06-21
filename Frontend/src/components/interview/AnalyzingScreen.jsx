import { 
  Bot, BrainCircuit, Lightbulb, X, Code, Briefcase, ClipboardList, Clock, CalendarDays,
  Mic2, FileSearch, BarChart, MessageSquare, Trophy, Sparkles, Menu
} from "lucide-react";
import { AnalysisStepItem } from "./AnalysisStepItem";

export const AnalyzingScreen = ({ 
  renderSidebar, 
  setIsSidebarOpen, 
  analysisStep, 
  navigate 
}) => {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-inter flex flex-col items-center justify-center p-6 relative">
      {renderSidebar()}
      {/* Top Hamburger */}
      <div className="absolute top-6 left-6 z-30">
         <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
           <Menu size={24} />
         </button>
      </div>

      <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        
        {/* Left Column */}
        <div className="flex flex-col gap-6 h-full">
          <div className="glass-panel border border-borderCard rounded-2xl p-8 lg:p-12 flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-[#0A0A0A]">
            
            {/* Header Title */}
            <div className="flex flex-col items-center text-center mb-12 relative z-10">
              <div className="w-16 h-16 rounded-full bg-accentOrange/10 border border-accentOrange/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                <Bot size={32} className="text-accentOrange drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">AI is analyzing your interview...</h1>
              <p className="text-secondary max-w-lg">This may take a few moments. Our AI is evaluating your responses to generate comprehensive feedback.</p>
            </div>

            {/* Central Abstract Graphic */}
            <div className="relative flex items-center justify-center w-64 h-64 mb-12">
              <div className="absolute inset-[-40px] border border-white/5 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-0 border border-white/5 rounded-full"></div>
              <div className="absolute inset-6 border border-white/10 rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute inset-0 bg-accentOrange/10 rounded-full blur-3xl"></div>
              
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
                <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="690" strokeDashoffset={690 - (690 * (analysisStep / 5))} className="text-accentOrange transition-all duration-1000" strokeLinecap="round" />
              </svg>

              <div className="relative z-10 w-32 h-32 bg-black rounded-full border border-accentOrange/40 shadow-[0_0_50px_rgba(249,115,22,0.4)] flex items-center justify-center">
                <BrainCircuit size={48} className="text-accentOrange drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
              </div>
              
              {/* Floating particles */}
              <div className="absolute top-10 left-10 w-1.5 h-1.5 bg-accentOrange rounded-full shadow-[0_0_8px_rgba(249,115,22,1)] animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-2 h-2 bg-accentOrange rounded-full shadow-[0_0_8px_rgba(249,115,22,1)] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-1/2 -left-10 w-1 h-1 bg-white/50 rounded-full"></div>
              <div className="absolute bottom-4 left-1/2 w-1.5 h-1.5 bg-white/50 rounded-full"></div>
            </div>

            {/* Info Box */}
            <div className="glass-panel border border-white/5 rounded-xl p-5 max-w-lg flex items-center gap-4 mb-8">
              <Lightbulb size={24} className="text-accentOrange shrink-0" />
              <p className="text-[13px] text-gray-300 leading-relaxed">
                We're using advanced AI to evaluate your communication, technical knowledge, problem-solving approach and more.
              </p>
            </div>

            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-gray-300 transition-colors text-sm font-medium mb-4"
            >
              <X size={16} /> Cancel Analysis
            </button>
            <p className="text-[11px] text-gray-500">You can leave this page, we'll notify you when it's ready.</p>
          </div>

          {/* Bottom Summary Bar */}
          <div className="glass-panel border border-borderCard rounded-2xl p-6 bg-[#0A0A0A]">
            <h3 className="text-sm font-bold text-white mb-6">Interview Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[11px] text-secondary">
                  <Code size={14} className="text-accentOrange" /> Role
                </div>
                <p className="text-xs font-semibold text-white">Frontend Developer</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[11px] text-secondary">
                  <Briefcase size={14} className="text-accentOrange" /> Experience
                </div>
                <p className="text-xs font-semibold text-white">2-3 Years</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[11px] text-secondary">
                  <ClipboardList size={14} className="text-accentOrange" /> Questions
                </div>
                <p className="text-xs font-semibold text-white">8</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[11px] text-secondary">
                  <Clock size={14} className="text-accentOrange" /> Duration
                </div>
                <p className="text-xs font-semibold text-white">25 Min 32 Sec</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[11px] text-secondary">
                  <CalendarDays size={14} className="text-accentOrange" /> Completed On
                </div>
                <p className="text-xs font-semibold text-white">7 Jun 2024, 10:30 AM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Status */}
        <div className="glass-panel border border-borderCard rounded-2xl p-8 bg-[#0A0A0A] flex flex-col h-full overflow-y-auto">
          <h3 className="text-sm font-bold text-white mb-8">Analysis Progress</h3>
          
          <div className="flex-1">
            <AnalysisStepItem 
              icon={Mic2} stepNum={1} analysisStep={analysisStep}
              title="Processing Speech" 
              description="Converting your responses to text" 
            />
            <AnalysisStepItem 
              icon={FileSearch} stepNum={2} analysisStep={analysisStep}
              title="Understanding Content" 
              description="Analyzing the meaning and context" 
            />
            <AnalysisStepItem 
              icon={BrainCircuit} stepNum={3} analysisStep={analysisStep}
              title="Evaluating Performance" 
              description="Assessing your answers and approach" 
            />
            <AnalysisStepItem 
              icon={BarChart} stepNum={4} analysisStep={analysisStep}
              title="Scoring & Benchmarking" 
              description="Comparing with industry standards" 
            />
            <AnalysisStepItem 
              icon={MessageSquare} stepNum={5} analysisStep={analysisStep}
              title="Generating Feedback" 
              description="Creating personalized insights" 
              isLast={true}
            />
          </div>

          <div className="mt-8 pt-8 border-t border-white/5">
            <h3 className="text-sm font-bold text-white mb-6">What we analyze</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Code size={14} className="text-accentOrange" />
                  <h4 className="text-[11px] font-semibold text-white">Technical Accuracy</h4>
                </div>
                <p className="text-[9px] text-secondary pl-5.5 leading-relaxed">How correct and relevant your answers were</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Mic2 size={14} className="text-accentOrange" />
                  <h4 className="text-[11px] font-semibold text-white">Confidence & Tone</h4>
                </div>
                <p className="text-[9px] text-secondary pl-5.5 leading-relaxed">Your confidence and speaking tone</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <BrainCircuit size={14} className="text-accentOrange" />
                  <h4 className="text-[11px] font-semibold text-white">Problem Solving</h4>
                </div>
                <p className="text-[9px] text-secondary pl-5.5 leading-relaxed">Your approach to solving problems</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <BookOpen size={14} className="text-accentOrange" />
                  <h4 className="text-[11px] font-semibold text-white">Depth of Knowledge</h4>
                </div>
                <p className="text-[9px] text-secondary pl-5.5 leading-relaxed">How deep your knowledge is in the topic</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <MessageSquare size={14} className="text-accentOrange" />
                  <h4 className="text-[11px] font-semibold text-white">Communication</h4>
                </div>
                <p className="text-[9px] text-secondary pl-5.5 leading-relaxed">Clarity, structure and effectiveness</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Trophy size={14} className="text-accentOrange" />
                  <h4 className="text-[11px] font-semibold text-white">Overall Performance</h4>
                </div>
                <p className="text-[9px] text-secondary pl-5.5 leading-relaxed">Overall evaluation and improvement areas</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-start gap-3">
            <Sparkles size={16} className="text-accentOrange shrink-0" />
            <p className="text-[10px] text-gray-400 leading-relaxed">
              <span className="text-accentOrange font-medium">Tip:</span> Detailed feedback helps you identify strengths and areas to improve for your next interview.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
