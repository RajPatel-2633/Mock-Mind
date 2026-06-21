import { motion } from "framer-motion";
import { 
  Menu, Bot, Signal, ExternalLink, Check, MessageSquare, 
  BrainCircuit, Target, ClipboardList, Clock, Lightbulb, Shield, Sparkles 
} from "lucide-react";

export const LoadingNextScreen = ({ 
  renderSidebar, 
  setIsSidebarOpen, 
  currentQuestion, 
  navigate 
}) => {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-inter flex flex-col items-center relative">
      {renderSidebar()}
      
      {/* Top Navigation Bar */}
      <div className="w-full max-w-[1400px] flex items-center justify-between p-6">
        <div className="flex items-center gap-3 text-accentOrange">
          <button onClick={() => setIsSidebarOpen(true)} className="p-1 -ml-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
             <Menu size={24} />
          </button>
          <Bot size={24} />
          <span className="font-semibold text-white">AI Interviewer</span>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/10">
          <Signal size={14} className="text-accentOrange" />
          <span className="text-xs font-semibold text-gray-300">Interview in Progress</span>
          <div className="w-2 h-2 rounded-full bg-accentOrange animate-pulse ml-1"></div>
        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-accentOrange hover:text-orange-400 transition-colors text-sm font-medium"
        >
          Leave Interview <ExternalLink size={16} />
        </button>
      </div>

      {/* Main Grid */}
      <div className="w-full max-w-[1400px] flex-1 px-6 pb-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        
        {/* Left Column - Loading Animation */}
        <div className="glass-panel border border-borderCard rounded-2xl p-8 lg:p-12 flex flex-col items-center justify-center relative overflow-hidden bg-[#0A0A0A]">
          
          {/* Glowing Success Checkmark */}
          <div className="relative mb-8">
             <div className="absolute inset-0 bg-accentOrange/20 blur-3xl rounded-full"></div>
             <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="relative w-32 h-32 rounded-full border-2 border-accentOrange flex items-center justify-center bg-black/40 shadow-[0_0_40px_rgba(249,115,22,0.3)]"
             >
               <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
               >
                 <Check size={48} className="text-accentOrange drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
               </motion.div>
               
               {/* Decorative Particles */}
               <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-accentOrange shadow-[0_0_10px_rgba(249,115,22,1)]"></div>
               <div className="absolute top-8 right-0 w-1.5 h-1.5 rounded-full bg-accentOrange shadow-[0_0_10px_rgba(249,115,22,1)]"></div>
               <div className="absolute bottom-4 left-6 w-1.5 h-1.5 rounded-full bg-accentOrange shadow-[0_0_10px_rgba(249,115,22,1)]"></div>
             </motion.div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Great answer!</h1>
          <p className="text-gray-400 mb-10">You explained that really well.</p>

          <h2 className="text-xl font-bold text-accentOrange mb-2">Preparing your next question...</h2>
          <p className="text-sm text-secondary mb-12">Our AI is crafting a relevant question based on your response.</p>

          {/* AI Stepper */}
          <div className="w-full max-w-3xl flex items-center justify-between mb-16 relative">
            {/* Connecting Line */}
            <div className="absolute left-10 right-10 top-6 h-[1px] bg-gradient-to-r from-accentOrange via-accentOrange/50 to-white/10 z-0"></div>
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-black border border-accentOrange text-accentOrange flex items-center justify-center relative shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                <MessageSquare size={18} />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-accentOrange flex items-center justify-center border-2 border-black">
                  <Check size={10} className="text-black" strokeWidth={4} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-[11px] text-gray-300 font-medium">Analyzing</p>
                <p className="text-[11px] text-gray-300 font-medium">Your Answer</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-black border border-accentOrange text-accentOrange flex items-center justify-center relative shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                <BrainCircuit size={18} />
              </div>
              <div className="text-center">
                <p className="text-[11px] text-gray-300 font-medium">Understanding</p>
                <p className="text-[11px] text-gray-300 font-medium">Key Concepts</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-black border border-accentOrange text-accentOrange flex items-center justify-center relative shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                <Target size={18} />
              </div>
              <div className="text-center">
                <p className="text-[11px] text-gray-300 font-medium">Identifying</p>
                <p className="text-[11px] text-gray-300 font-medium">Focus Areas</p>
              </div>
            </div>

            {/* Step 4 (Active) */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-black border border-accentOrange text-accentOrange flex items-center justify-center relative shadow-[0_0_20px_rgba(249,115,22,0.6)] animate-pulse">
                <ClipboardList size={18} />
                <div className="absolute -bottom-2 bg-accentOrange text-black text-[10px] font-bold px-1.5 rounded-sm">4</div>
              </div>
              <div className="text-center">
                <p className="text-[11px] text-white font-medium">Crafting Next</p>
                <p className="text-[11px] text-white font-medium">Question</p>
              </div>
            </div>

            {/* Step 5 (Pending) */}
            <div className="relative z-10 flex flex-col items-center gap-3 opacity-30">
              <div className="w-12 h-12 rounded-full bg-black border border-white/20 text-white/50 flex items-center justify-center">
                <Clock size={18} />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-medium">Finalizing</p>
                <p className="text-[11px] font-medium">Question</p>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-accentOrange mb-2">Question {currentQuestion + 1}</h3>
          <div className="flex items-center gap-2 mb-12">
            <span className="text-xl font-bold text-white">Loading...</span>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 rounded-full bg-accentOrange animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 rounded-full bg-accentOrange animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2 h-2 rounded-full bg-accentOrange animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>

          <div className="w-full max-w-md bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex items-start gap-4 mb-auto">
            <Lightbulb size={24} className="text-accentOrange shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">Keep it up!</h4>
              <p className="text-xs text-secondary leading-relaxed">You're doing great. Take a deep breath and get ready for the next question.</p>
            </div>
          </div>

          {/* Footer */}
          <div className="w-full flex items-center justify-center gap-6 mt-8 pt-6 border-t border-white/5 text-[11px] text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <Shield size={12} /> Your answers are secure and private
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-700"></div>
            <div className="flex items-center gap-2">
              <Sparkles size={12} /> Powered by Advanced AI
            </div>
          </div>
        </div>

        {/* Right Column - Placeholder for Loading screen sidebar */}
        <div className="flex flex-col gap-5">
           <div className="glass-panel border border-borderCard rounded-2xl p-6 bg-[#0A0A0A] h-full flex flex-col items-center justify-center opacity-50">
               <BrainCircuit size={48} className="text-white/10 mb-4" />
               <p className="text-sm text-white/40 font-medium text-center">Loading next section...</p>
           </div>
        </div>
      </div>
    </div>
  );
};
