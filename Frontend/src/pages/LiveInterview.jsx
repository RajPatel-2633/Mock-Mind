import { useState, useEffect, useRef } from "react";
import { 
  Mic, Signal, ExternalLink, SkipForward, Bot, User, CheckCircle2, 
  Lightbulb, Trophy, Check, Clock, Briefcase, BarChart, Code, 
  MessageSquare, Target, BrainCircuit, ClipboardList, Shield, Sparkles, 
  Network, Loader2, Hourglass, FileSearch, X, CalendarDays, BookOpen, Mic2, Menu
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { cn } from "../lib/utils";
import Sidebar from "../components/dashboard/Sidebar";
import { Waveform } from "../components/interview/Waveform";
import { AnalyzingScreen } from "../components/interview/AnalyzingScreen";
import { LoadingNextScreen } from "../components/interview/LoadingNextScreen";

export default function LiveInterview() {
  const navigate = useNavigate();
  const { id: interviewId } = useParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // 'loading_first' -> 'idle' -> 'recording' -> 'loading_next' -> 'analyzing'
  const [interviewState, setInterviewState] = useState('loading_first'); 
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [questionId, setQuestionId] = useState(null);
  const [questionText, setQuestionText] = useState("Loading your question...");
  const [totalQuestions, setTotalQuestions] = useState(8);
  const [interviewType, setInterviewType] = useState('Standard');
  const [code, setCode] = useState("// Write your code here\n");
  
  const [transcript, setTranscript] = useState("");
  const transcriptRef = useRef("");
  useEffect(() => { transcriptRef.current = transcript; }, [transcript]);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);
  const audioChunksRef = useRef([]);
  const [analysisStep, setAnalysisStep] = useState(1);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    const fetchFirstQuestion = async () => {
      try {
        const { data } = await api.post(`/interview/startInterview/${interviewId}`);
        setQuestionId(data.data.questionId);
        setQuestionText(data.data.question);
        if(data.data.totalQuestions) setTotalQuestions(data.data.totalQuestions);
        if(data.data.interviewType) setInterviewType(data.data.interviewType);
        setInterviewState('idle');
        setIsTimerRunning(true);
      } catch (err) {
        console.error("Failed to start interview", err);
      }
    };
    if (interviewId) {
      fetchFirstQuestion();
    }
  }, [interviewId]);

  // Removed SpeechRecognition useEffect

  useEffect(() => {
    if (interviewState === 'analyzing') {
      let step = 1;
      setAnalysisStep(1);
      const interval = setInterval(() => {
        step++;
        if (step > 6) { // 5 steps + 1 extra tick to navigate
          clearInterval(interval);
          navigate(`/feedback?id=${interviewId}`);
        } else {
          setAnalysisStep(step);
        }
      }, 2000); // 2s per step = ~10-12s total analyzing time
      return () => clearInterval(interval);
    }
  }, [interviewState, navigate]);

  const handleMicClick = async () => {
    if (interviewState === 'idle') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.addEventListener("dataavailable", event => {
          audioChunksRef.current.push(event.data);
        });

        mediaRecorderRef.current.addEventListener("stop", async () => {
          setInterviewState('idle');
          setIsTranscribing(true);
          
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append("file", audioBlob, "audio.webm");

          try {
            const { data } = await api.post("/interview/transcribe", formData, {
               headers: {
                  'Content-Type': 'multipart/form-data'
               }
            });
            if (data.data && data.data.text && data.data.text.trim().length > 0) {
                setTranscript(data.data.text);
            }
          } catch (error) {
            console.error("Error transcribing:", error);
          }

          setIsTranscribing(false);
          stream.getTracks().forEach(track => track.stop());
        });

        setInterviewState('recording');
        setTranscript('');
        mediaRecorderRef.current.start();
      } catch (err) {
        console.error("Mic error:", err);
        alert("Please allow microphone access.");
      }
    } else if (interviewState === 'recording') {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    }
  };

  const handleSubmitAnswer = async () => {
    setInterviewState('loading_next');
    
    // Combine transcript and code
    let finalAnswer = transcript;
    if (interviewType === "Technical" && code.trim().length > 0) {
      finalAnswer += `\n\nCode Solution:\n\`\`\`\n${code}\n\`\`\``;
    }

    try {
      const { data } = await api.post(`/interview/answer/${interviewId}`, {
         questionId: questionId,
         answer: finalAnswer
      });
      
      if (data.data.completed) {
         setInterviewState('analyzing');
         setIsTimerRunning(false);
         await api.post(`/interview/report/${interviewId}`, { duration: Math.ceil(timer / 60) || 1 });
         navigate(`/feedback?id=${interviewId}`);
      } else {
         setQuestionId(data.data.nextQuestion.questionId);
         setQuestionText(data.data.nextQuestion.question);
         setCurrentQuestion(prev => prev + 1);
         setTranscript('');
         setInterviewState('idle');
      }
    } catch (err) {
       console.error("Failed to submit answer", err);
       setInterviewState('idle');
    }
  };

  const handleSkipToEnd = async () => {
    try { 
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    } catch (e) {}
    setInterviewState('analyzing');
    setIsTimerRunning(false);
    try {
      await api.post(`/interview/report/${interviewId}`, { duration: Math.ceil(timer / 60) || 1 });
      navigate(`/feedback?id=${interviewId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const renderSidebar = () => (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={() => setIsSidebarOpen(false)}
          />
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full z-[110] shadow-[20px_0_40px_rgba(0,0,0,0.5)] border-r border-white/5 bg-[#0A0A0A]"
          >
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (interviewState === 'analyzing') {
    return <AnalyzingScreen renderSidebar={renderSidebar} setIsSidebarOpen={setIsSidebarOpen} analysisStep={analysisStep} navigate={navigate} />;
  }

  if (interviewState === 'loading_next') {
    return <LoadingNextScreen renderSidebar={renderSidebar} setIsSidebarOpen={setIsSidebarOpen} currentQuestion={currentQuestion} navigate={navigate} />;
  }

  // Layout 1: Main Interview Screen
  return (
    <div className="h-screen w-full bg-[#050505] p-4 lg:p-6 text-white font-inter flex justify-center items-center overflow-hidden relative">
      {renderSidebar()}
      
      {/* Top Absolute Hamburger */}
      <div className="absolute top-4 left-4 lg:top-6 lg:left-6 z-30">
         <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 bg-[#0A0A0A] border border-white/5">
           <Menu size={24} />
         </button>
      </div>

      <div className={cn("w-full h-full max-h-[850px] grid gap-5 transition-all duration-300", interviewType === "Technical" ? "max-w-[1600px] grid-cols-1 lg:grid-cols-[1.5fr_1fr_320px]" : "max-w-[1300px] grid-cols-1 lg:grid-cols-[1fr_320px]")}>
        
        {interviewType === "Technical" && (
          <div className="glass-panel border border-borderCard rounded-2xl overflow-hidden flex flex-col bg-[#0A0A0A] h-full min-h-0">
            <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#111]">
              <div className="flex items-center gap-2 text-accentOrange text-[11px] font-bold tracking-widest uppercase">
                <Code size={14} /> Code Editor
              </div>
            </div>
            <div className="flex-1 bg-[#1e1e1e]">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value)}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>
        )}

        {/* Left Column - Main Interview Area */}
        <div className="flex flex-col gap-4 h-full min-h-0">
          <div className="glass-panel border border-borderCard rounded-2xl p-6 lg:p-8 flex-1 flex flex-col relative overflow-hidden bg-[#0A0A0A]">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h3 className="text-[11px] font-bold text-accentOrange uppercase tracking-widest">Question {currentQuestion} of {totalQuestions}</h3>
                <div className="flex gap-1.5">
                  {[...Array(totalQuestions)].map((_, i) => (
                    <div key={i} className={cn("h-1 w-8 rounded-full", i < currentQuestion ? "bg-accentOrange shadow-[0_0_8px_rgba(249,115,22,0.6)]" : "bg-white/10")} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold">
                <Signal size={14} className="text-accentOrange" /> Medium
              </div>
            </div>

            {/* AI Interviewer Section */}
            <div className="mb-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-accentOrange mb-3">
                    <Bot size={18} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">AI Interviewer</span>
                  </div>
                  <motion.h2 
                    key={currentQuestion}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl lg:text-4xl font-bold text-white mb-3"
                  >
                    {questionText}
                  </motion.h2>
                  <p className="text-sm text-secondary">This is usually an ice-breaker question to start the conversation.</p>
                </div>
                <div className="hidden sm:flex items-center h-16">
                  <Waveform playing={true} count={24} className="h-16 opacity-80" />
                </div>
              </div>
            </div>

            <div className="w-full h-[1px] bg-white/10 mb-6"></div>

            {/* User Response Section */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <div className="flex items-center gap-2 text-accentOrange">
                  <User size={18} />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Your Response (Live)</span>
                </div>
                <div className="flex items-center gap-2 text-green-500 text-[11px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Listening
                </div>
              </div>

              <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl p-5 relative flex flex-col overflow-y-auto">
                <textarea 
                  className="w-full h-full bg-transparent border-none outline-none resize-none text-[14px] leading-relaxed text-gray-300 flex-1 whitespace-pre-wrap"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder={isTranscribing ? "Transcribing audio..." : (interviewState === 'recording' ? "Listening..." : "You can also type your answer here...")}
                  disabled={isTranscribing || interviewState === 'recording'}
                />
                <div className="mt-4 w-full overflow-hidden shrink-0">
                  <Waveform playing={interviewState === 'recording'} count={50} className="w-full justify-between gap-[2px] opacity-60 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between px-2 shrink-0 h-[80px]">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
            >
              <ExternalLink size={16} /> End Interview
            </button>

            <div className="flex flex-col items-center">
              <button 
                onClick={handleMicClick}
                disabled={isTranscribing}
                className={cn(
                  "relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 mb-2",
                  interviewState === 'recording' 
                    ? "bg-[#0A0A0A] border-2 border-accentOrange shadow-[0_0_30px_rgba(249,115,22,0.3)]" 
                    : "bg-accentOrange hover:bg-orange-600 shadow-[0_0_30px_rgba(249,115,22,0.4)]",
                  isTranscribing && "opacity-50 cursor-not-allowed"
                )}
              >
                {interviewState === 'recording' && (
                  <span className="absolute inset-0 rounded-full border-2 border-accentOrange animate-ping opacity-75"></span>
                )}
                {interviewState === 'recording' ? <Mic size={32} className="text-accentOrange drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" /> : <Mic size={32} className="text-white" />}
              </button>
              <span className="text-xs text-secondary tracking-wide">{isTranscribing ? 'Transcribing...' : (interviewState === 'recording' ? 'Tap to Stop' : 'Tap to Start')}</span>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleSubmitAnswer}
                disabled={isTranscribing || interviewState === 'recording' || !transcript.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accentOrange text-white hover:bg-orange-600 transition-colors text-sm font-bold shadow-[0_0_15px_rgba(249,115,22,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 Submit <Check size={16} />
              </button>
              <button 
                onClick={handleSkipToEnd}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-accentOrange hover:text-orange-400 hover:bg-white/10 transition-colors text-sm font-bold shadow-[0_0_15px_rgba(249,115,22,0.2)]"
              >
                 Skip <SkipForward size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="flex flex-col gap-4 h-full min-h-0">
          
          {/* Timer Card */}
          <div className="glass-panel border border-borderCard rounded-2xl p-6 flex flex-col items-center justify-center relative bg-[#0A0A0A] shrink-0">
             <h3 className="text-[9px] font-bold text-secondary uppercase tracking-widest mb-4">Time Taken</h3>
             <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                  <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
                  <circle 
                    cx="80" 
                    cy="80" 
                    r="72" 
                    stroke="currentColor" 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray="452.39" 
                    strokeDashoffset={452.39 - ((timer % 60) / 60) * 452.39} 
                    className="text-accentOrange drop-shadow-[0_0_10px_rgba(249,115,22,0.6)] transition-all duration-1000 ease-linear" 
                    strokeLinecap="round" 
                  />
                  {[...Array(60)].map((_, i) => (
                    <line key={i} x1="80" y1="4" x2="80" y2={i % 5 === 0 ? "10" : "7"} transform={`rotate(${i * 6} 80 80)`} stroke="currentColor" strokeWidth={i % 5 === 0 ? "2" : "1"} className={i % 5 === 0 ? "text-white/20" : "text-white/10"} />
                  ))}
                </svg>
                <div className="text-center relative z-10 flex flex-col items-center">
                  <div className="text-3xl font-bold text-white mb-1 drop-shadow-md">{formatTime(timer)}</div>
                  <div className="text-[9px] text-secondary font-medium tracking-widest mt-1">MIN : SEC</div>
                </div>
             </div>
          </div>

          {/* Progress Card */}
          <div className="glass-panel border border-borderCard rounded-2xl p-5 bg-[#0A0A0A] shrink-0">
            <h3 className="text-[9px] font-bold text-secondary uppercase tracking-widest mb-4">Question Progress</h3>
            <div className="relative flex items-center justify-between mb-2 px-1">
              <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[1px] bg-white/10 z-0"></div>
              {[...Array(totalQuestions)].map((_, index) => {
                const num = index + 1;
                return (
                <div key={num} className="relative z-10">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                    num === currentQuestion 
                      ? "bg-accentOrange text-white shadow-[0_0_10px_rgba(249,115,22,0.5)] border border-accentOrange scale-110" 
                      : num < currentQuestion
                      ? "bg-accentOrange/20 text-accentOrange border border-accentOrange/30"
                      : "bg-[#111] text-secondary border border-white/10"
                  )}>
                    {num}
                  </div>
                </div>
              )})}
            </div>
            <div className="flex items-center justify-between text-[9px] text-secondary tracking-widest uppercase">
               <span>Start</span>
               <span>Finish</span>
            </div>
          </div>

          {/* Tips Card */}
          <div className="glass-panel border border-borderCard rounded-2xl p-5 flex-1 bg-[#0A0A0A] overflow-y-auto min-h-0">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={14} className="text-accentOrange" />
              <h3 className="text-[10px] font-bold text-accentOrange uppercase tracking-widest">Tips</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <CheckCircle2 size={14} className="text-accentOrange shrink-0" />
                <span className="text-xs text-gray-300">Be honest and confident</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={14} className="text-accentOrange shrink-0" />
                <span className="text-xs text-gray-300">Structure your thoughts</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={14} className="text-accentOrange shrink-0" />
                <span className="text-xs text-gray-300">Provide specific examples</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={14} className="text-accentOrange shrink-0" />
                <span className="text-xs text-gray-300">Keep your answer relevant</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={14} className="text-accentOrange shrink-0" />
                <span className="text-xs text-gray-300">Speak clearly and at a moderate pace</span>
              </li>
            </ul>
          </div>

          {/* Alert Card */}
          <div className="border border-white/5 rounded-xl p-3 bg-[#111] flex items-center gap-3 shrink-0 mt-auto">
            <Trophy size={16} className="text-accentOrange shrink-0" />
            <div>
              <h4 className="text-[10px] font-semibold text-accentOrange mb-0.5">AI is listening...</h4>
              <p className="text-[9px] text-secondary">Take your time. We've got you!</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
