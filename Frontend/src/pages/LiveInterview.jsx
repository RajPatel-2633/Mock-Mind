import { useState, useEffect } from "react";
import { Mic, Square, ChevronRight, X, Volume2, RefreshCw, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export default function LiveInterview() {
  const navigate = useNavigate();
  // State machine: 'idle' -> 'recording' -> 'answered'
  const [interviewState, setInterviewState] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [timer, setTimer] = useState(0);
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  
  // Format timer
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }
    
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    
    rec.onresult = (event) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    setRecognition(rec);
  }, []);

  const handleMicClick = () => {
    if (interviewState === 'idle') {
      if (!isSupported) {
        alert("Your browser does not support Speech Recognition. Please use Google Chrome.");
        return;
      }
      setInterviewState('recording');
      setTranscript('');
      try { recognition?.start(); } catch (e) { console.error(e); }
    } else if (interviewState === 'recording') {
      setInterviewState('answered');
      try { recognition?.stop(); } catch (e) { console.error(e); }
    }
  };

  const handleRetake = () => {
    setInterviewState('recording');
    setTranscript('');
    try { recognition?.start(); } catch (e) { console.error(e); }
  };

  return (
    <div className="h-screen w-full bg-[#050505] flex flex-col relative overflow-hidden text-white font-inter">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accentOrange/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="flex items-center justify-between p-6 relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-accentOrange/20 flex items-center justify-center">
               <Volume2 size={16} className="text-accentOrange" />
             </div>
             <div>
               <h1 className="text-base font-bold text-white">ReactJS Developer Interview</h1>
               <p className="text-xs text-secondary">Question 1 of 6</p>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 font-mono text-sm">
             <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
             {formatTime(timer)}
          </div>
          <button 
            onClick={() => navigate('/feedback')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 text-sm font-semibold transition-colors"
          >
            <X size={16} /> End Interview
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-6 relative z-10 max-w-4xl mx-auto w-full pt-8 overflow-y-auto">
        
        {/* Question Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel border border-borderCard rounded-2xl p-8 md:p-12 w-full shadow-2xl text-center relative overflow-hidden mb-12"
        >
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accentOrange/0 via-accentOrange to-accentOrange/0"></div>
           <h3 className="text-sm font-semibold text-accentOrange mb-6 uppercase tracking-widest flex items-center justify-center gap-2">
             <Volume2 size={16} /> Current Question
           </h3>
           <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
             "Can you explain the difference between the Virtual DOM and the Real DOM in React?"
           </h2>
        </motion.div>

        {/* Dynamic Center Area based on State */}
        <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[300px]">
          <AnimatePresence mode="wait">
            
            {/* IDLE / RECORDING STATE */}
            {(interviewState === 'idle' || interviewState === 'recording') && (
              <motion.div 
                key="recording-view"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full flex flex-col items-center justify-center"
              >
                {/* AI Audio Visualizer */}
                <div className="relative flex items-center justify-center h-48 w-full">
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <motion.div 
                       animate={{ 
                         scale: interviewState === 'recording' ? [1, 1.15, 1] : 1,
                         opacity: interviewState === 'recording' ? [0.3, 0.5, 0.3] : 0.1
                       }}
                       transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                       className="w-48 h-48 rounded-full bg-accentOrange/20 blur-2xl"
                     />
                   </div>
                   
                   <div className="relative z-10 flex items-center justify-center gap-1.5 h-16 pointer-events-none">
                      {Array.from({ length: 32 }).map((_, i) => (
                        <motion.div 
                          key={i}
                          animate={interviewState === 'recording' ? { 
                            height: ["20%", "100%", "20%"] 
                          } : { height: "20%" }}
                          transition={interviewState === 'recording' ? { 
                            duration: 0.8, 
                            repeat: Infinity, 
                            delay: Math.random() * 0.8,
                            ease: "easeInOut"
                          } : {}}
                          className={cn(
                            "w-1.5 rounded-full transition-colors",
                            interviewState === 'recording' ? "bg-accentOrange" : "bg-white/20"
                          )}
                          style={{ minHeight: "8px" }}
                        />
                      ))}
                   </div>
                </div>

                <div className="h-12 mt-4 flex items-center justify-center">
                  {interviewState === 'recording' ? (
                     <div className="flex flex-col items-center gap-4 mt-4">
                       <div className="flex items-center gap-3 text-accentOrange animate-pulse">
                         <Mic size={18} />
                         <span className="text-sm font-semibold tracking-widest uppercase">Listening...</span>
                       </div>
                       <p className="text-lg text-gray-300 text-center italic leading-relaxed max-w-xl">
                         {transcript}
                       </p>
                     </div>
                  ) : (
                    <p className="text-secondary text-sm text-center">Tap the large microphone button below to start answering</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* ANSWERED STATE (Transcript Card) */}
            {interviewState === 'answered' && (
              <motion.div
                key="transcript-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-3xl"
              >
                <div className="glass-panel border border-accentOrange/30 rounded-2xl p-8 relative shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                  <div className="absolute -top-4 left-6 bg-accentOrange text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg">
                    <CheckCircle2 size={14} /> Recorded Answer
                  </div>
                  
                  <p className="text-lg text-gray-200 leading-relaxed italic mt-2">
                    "{transcript}"
                  </p>
                  <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                    <p className="text-xs text-secondary flex items-center gap-2">
                      <Volume2 size={14} /> Speech converted to text successfully
                    </p>
                    <button 
                      onClick={handleRetake}
                      className="text-sm text-secondary hover:text-white flex items-center gap-2 transition-colors"
                    >
                      <RefreshCw size={14} /> Retake Answer
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </main>

      {/* Bottom Controls */}
      <div className="p-8 relative z-10 flex flex-col items-center justify-center border-t border-white/5 bg-black/20 backdrop-blur-md">
         <div className="flex items-center gap-8">
            
            {/* The primary Mic/Stop button */}
            {interviewState !== 'answered' && (
              <button 
                onClick={handleMicClick}
                className={cn(
                  "relative group w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl",
                  interviewState === 'recording'
                    ? "bg-red-500 hover:bg-red-600 shadow-[0_0_30px_rgba(239,68,68,0.5)]" 
                    : "bg-accentOrange hover:bg-orange-600 shadow-[0_0_30px_rgba(249,115,22,0.4)]"
                )}
              >
                 {interviewState === 'recording' && (
                   <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping"></span>
                 )}
                 {interviewState === 'recording' ? <Square size={28} className="text-white" fill="currentColor" /> : <Mic size={32} className="text-white" />}
              </button>
            )}

            {/* Next Question Button (Only prominent when answered) */}
            {interviewState === 'answered' && (
              <button className="flex items-center gap-3 px-8 py-4 rounded-full bg-accentOrange hover:bg-orange-600 text-white font-bold shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all hover:scale-105">
                 Move to next question <ChevronRight size={20} />
              </button>
            )}
            
         </div>
         
         {interviewState === 'idle' && (
           <p className="text-xs text-secondary mt-4 font-medium uppercase tracking-widest">Click to speak</p>
         )}
         {interviewState === 'recording' && (
           <p className="text-xs text-red-500 mt-4 font-medium uppercase tracking-widest">Click to stop</p>
         )}
      </div>

    </div>
  );
}
