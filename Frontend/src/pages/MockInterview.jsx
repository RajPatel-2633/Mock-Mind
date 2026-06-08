import { useState } from "react";
import { ArrowLeft, HelpCircle, Sun, MessageSquare, Mic, Star, CheckCircle2, ArrowRight, ChevronDown, User, Code, Briefcase, BarChart, Clock, Sparkles, BrainCircuit, Lightbulb, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import Stepper from "../components/mock-interview/Stepper";
import TechCard from "../components/mock-interview/TechCard";
import Button from "../components/ui/Button";
import { ReactIcon, NodeIcon, PythonIcon, JavaIcon, MernIcon, AIIcon, GenAIIcon, DsaIcon, SystemDesignIcon, OtherIcon } from "../components/mock-interview/icons";
import { cn } from "../lib/utils";

const techStacks = [
  { id: "react", title: "ReactJS", icon: <ReactIcon />, description: "Questions will be focused on React concepts, hooks, state management, components, lifecycle, and best practices.", role: "Suitable for frontend developer roles." },
  { id: "node", title: "NodeJS", icon: <NodeIcon />, description: "Focus on Event Loop, Express.js, APIs, async programming, and backend architecture.", role: "Suitable for backend developer roles." },
  { id: "mern", title: "MERN Stack", icon: <MernIcon />, description: "Full-stack questions covering MongoDB, Express, React, and Node.js integration.", role: "Suitable for full-stack developer roles." },
  { id: "aiml", title: "AI / ML", icon: <AIIcon />, description: "Questions on machine learning algorithms, model training, and data processing.", role: "Suitable for ML engineers and Data Scientists." },
  { id: "genai", title: "Gen-AI", icon: <GenAIIcon />, description: "Focus on LLMs, prompt engineering, RAG, and generative architectures.", role: "Suitable for AI Engineers." },
  { id: "java", title: "Java Developer", icon: <JavaIcon />, description: "Core Java, multithreading, collections, JVM memory management, and Spring Boot.", role: "Suitable for enterprise backend roles." },
  { id: "python", title: "Python Developer", icon: <PythonIcon />, description: "Python fundamentals, data structures, generators, Django/FastAPI, and scripting.", role: "Suitable for backend and automation roles." },
  { id: "dsa", title: "Data Structures & Algorithms", icon: <DsaIcon />, description: "Algorithmic problem solving, Big O notation, trees, graphs, and dynamic programming.", role: "Suitable for any software engineering interview." },
  { id: "system_design", title: "System Design", icon: <SystemDesignIcon />, description: "Scalability, microservices, databases, caching, and designing large-scale systems.", role: "Suitable for senior developer and architect roles." },
  { id: "other", title: "Other (Custom)", icon: <OtherIcon />, description: "Define your own custom role and specify the technologies you want to be tested on.", role: "Suitable for specialized or niche roles." },
];

const experienceLevels = ["Fresher (0-1 Yrs)", "Junior (1-3 Yrs)", "Mid (3-5 Yrs)", "Senior (5+ Yrs)"];

const difficulties = [
  { id: "easy", label: "Easy", desc: "Basic concepts" },
  { id: "medium", label: "Medium", desc: "Industry standard" },
  { id: "hard", label: "Hard", desc: "Advanced concepts" }
];

const interviewTypes = [
  { id: "technical", label: "Technical Interview", icon: <Code size={20} className="text-accentOrange" />, desc: "Focus on coding, concepts and problem solving" },
  { id: "behavioral", label: "Behavioral Interview", icon: <User size={20} className="text-secondary" />, desc: "Focus on soft skills, experience and situational questions" }
];

export default function MockInterview() {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1 State
  const [selectedTech, setSelectedTech] = useState(techStacks[0]);

  // Step 2 State
  const [role, setRole] = useState("Frontend Developer");
  const [experience, setExperience] = useState("Junior (1-3 Yrs)");
  const [difficulty, setDifficulty] = useState("Medium");
  const [type, setType] = useState("Technical Interview");
  const [numQuestions, setNumQuestions] = useState("6 Questions");

  return (
    <div className="w-full pb-20">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 border border-white/10 hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} className="text-white" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Mock Interview</h1>
            <p className="text-sm text-secondary">Select your preferences and start practicing</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-sm font-medium hover:bg-white/5 transition-colors">
            <HelpCircle size={16} /> How it works?
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/5 transition-colors text-secondary hover:text-white">
            <Sun size={18} />
          </button>
        </div>
      </header>

      {/* Stepper */}
      <Stepper currentStep={currentStep} selectedTech={selectedTech} />

      {/* --- STEP 1 --- */}
      {currentStep === 1 && (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-1">1. Choose Your Tech Stack</h2>
            <p className="text-sm text-secondary mb-6">Select the technology or role you want to be interviewed on.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {techStacks.map((tech) => (
                <TechCard 
                  key={tech.id} 
                  title={tech.title} 
                  icon={tech.icon} 
                  isSelected={selectedTech.id === tech.id}
                  onClick={() => setSelectedTech(tech)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mt-8">
            <div className="glass-panel border border-borderCard rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 opacity-[0.03] pointer-events-none scale-150">
                {selectedTech.icon}
              </div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center scale-75 origin-left">
                  {selectedTech.icon}
                </div>
                <h3 className="text-base font-bold text-white">About {selectedTech.title} Interview</h3>
              </div>
              <ul className="space-y-4 relative z-10">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-accentOrange shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">{selectedTech.description}</p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-accentOrange shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">{selectedTech.role}</p>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-accentOrange shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">Questions adapt based on your answers.</p>
                </li>
              </ul>
            </div>

            <div className="glass-panel border border-borderCard rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-6">What to expect?</h3>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-accentOrange/10 border border-accentOrange/20 flex items-center justify-center text-accentOrange">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-0.5">5-8 Questions</h4>
                    <p className="text-xs text-secondary">AI will ask one question at a time</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-accentOrange/10 border border-accentOrange/20 flex items-center justify-center text-accentOrange">
                    <Mic size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-0.5">Speak Your Answers</h4>
                    <p className="text-xs text-secondary">Answer out loud using your microphone</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-accentOrange/10 border border-accentOrange/20 flex items-center justify-center text-accentOrange">
                    <Star size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-0.5">AI Feedback</h4>
                    <p className="text-xs text-secondary">Get instant feedback and suggestions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <div className="w-48">
              <Button variant="primary" onClick={() => setCurrentStep(2)}>
                Continue <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* --- STEP 2 --- */}
      {currentStep === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          
          {/* Left Column - Settings Form */}
          <div className="glass-panel border border-borderCard rounded-2xl p-6 lg:p-8">
            <h2 className="text-lg font-bold text-white mb-1">2. Interview Settings</h2>
            <p className="text-sm text-secondary mb-8">Customize your interview experience</p>

            <div className="space-y-8">
              {/* Interview Role */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Interview Role</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accentOrange"><User size={18} /></div>
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white appearance-none focus:outline-none focus:border-accentOrange transition-colors"
                  >
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Full Stack Developer</option>
                    <option>Data Scientist</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
                     <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Experience Level</label>
                <div className="flex flex-wrap gap-3">
                  {experienceLevels.map(lvl => (
                    <button 
                      key={lvl}
                      onClick={() => setExperience(lvl)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border",
                        experience === lvl 
                          ? "bg-accentOrange/10 border-accentOrange text-accentOrange shadow-[0_0_15px_rgba(249,115,22,0.15)]" 
                          : "bg-transparent border-white/10 text-secondary hover:text-white hover:border-white/30"
                      )}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Difficulty Level</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {difficulties.map(diff => (
                    <div 
                      key={diff.id}
                      onClick={() => setDifficulty(diff.label)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-300",
                        difficulty === diff.label
                          ? "border-accentOrange bg-accentOrange/5 shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                          : "border-white/10 bg-transparent hover:bg-white/[0.02]"
                      )}
                    >
                      <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors", difficulty === diff.label ? "border-accentOrange" : "border-secondary")}>
                        {difficulty === diff.label && <div className="w-2 h-2 rounded-full bg-accentOrange"></div>}
                      </div>
                      <div>
                        <h4 className={cn("text-sm font-semibold", difficulty === diff.label ? "text-white" : "text-gray-300")}>{diff.label}</h4>
                        <p className="text-xs text-secondary">{diff.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interview Type */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Interview Type</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {interviewTypes.map(typ => (
                    <div 
                      key={typ.id}
                      onClick={() => setType(typ.label)}
                      className={cn(
                        "relative flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all duration-300",
                        type === typ.label
                          ? "border-accentOrange bg-accentOrange/5 shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                          : "border-white/10 bg-transparent hover:bg-white/[0.02]"
                      )}
                    >
                      {type === typ.label && (
                        <div className="absolute top-3 right-3 text-accentOrange animate-fade-in">
                          <CheckCircle2 size={18} />
                        </div>
                      )}
                      <div className="mt-0.5">{typ.icon}</div>
                      <div>
                        <h4 className={cn("text-sm font-semibold mb-1 transition-colors", type === typ.label ? "text-white" : "text-gray-300")}>{typ.label}</h4>
                        <p className="text-xs text-secondary">{typ.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Number of Questions</label>
                <div className="relative mb-2">
                  <select 
                    value={numQuestions} 
                    onChange={(e) => setNumQuestions(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 px-4 text-sm text-white appearance-none focus:outline-none focus:border-accentOrange transition-colors"
                  >
                    <option>4 Questions</option>
                    <option>6 Questions</option>
                    <option>8 Questions</option>
                    <option>10 Questions</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
                     <ChevronDown size={16} />
                  </div>
                </div>
                <p className="text-xs text-secondary">Recommended: 5-8 questions</p>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <button 
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
                >
                  Back
                </button>
                <div className="w-40">
                  <Button variant="primary" onClick={() => setCurrentStep(3)}>
                    Continue <ArrowRight size={16} />
                  </Button>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <div className="glass-panel border border-borderCard rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-1">Preview Your Interview</h3>
              <p className="text-xs text-secondary mb-6">Here's what your interview will look like</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3 text-accentOrange"><Code size={16} /><span className="text-sm font-medium text-secondary">Tech Stack</span></div>
                  <div className="flex items-center gap-2"><div className="w-5 h-5 flex items-center justify-center scale-75">{selectedTech.icon}</div><span className="text-sm font-semibold text-white">{selectedTech.title}</span></div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3 text-accentOrange"><Briefcase size={16} /><span className="text-sm font-medium text-secondary">Role</span></div>
                  <div className="flex items-center gap-2"><span className="text-sm font-semibold text-white">{role}</span></div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3 text-accentOrange"><BarChart size={16} /><span className="text-sm font-medium text-secondary">Experience Level</span></div>
                  <div className="flex items-center gap-2"><span className="text-sm font-semibold text-white">{experience}</span></div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3 text-accentOrange"><BarChart size={16} className="rotate-90" /><span className="text-sm font-medium text-secondary">Difficulty Level</span></div>
                  <div className="flex items-center gap-2"><span className="text-sm font-semibold text-white">{difficulty}</span></div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3 text-accentOrange"><Code size={16} /><span className="text-sm font-medium text-secondary">Interview Type</span></div>
                  <div className="flex items-center gap-2"><span className="text-sm font-semibold text-white">{type}</span></div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3 text-accentOrange"><HelpCircle size={16} /><span className="text-sm font-medium text-secondary">Number of Questions</span></div>
                  <div className="flex items-center gap-2"><span className="text-sm font-semibold text-white">{numQuestions}</span></div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3 text-accentOrange"><Clock size={16} /><span className="text-sm font-medium text-secondary">Duration (Estimated)</span></div>
                  <div className="flex items-center gap-2"><span className="text-sm font-semibold text-white">20 - 25 mins</span></div>
                </div>
              </div>
            </div>

            {/* What to expect? */}
            <div className="glass-panel border border-borderCard rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-6">What to expect?</h3>
              <ul className="space-y-4 mb-6">
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-accentOrange shrink-0" />
                  <p className="text-sm text-gray-300">AI will ask one question at a time</p>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-accentOrange shrink-0" />
                  <p className="text-sm text-gray-300">Speak your answers out loud</p>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-accentOrange shrink-0" />
                  <p className="text-sm text-gray-300">Get instant AI feedback and suggestions</p>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-accentOrange shrink-0" />
                  <p className="text-sm text-gray-300">You can't skip or go back to previous questions</p>
                </li>
              </ul>
              
              <div className="bg-accentOrange/5 border border-accentOrange/20 rounded-xl p-4 flex gap-3">
                <Sparkles size={18} className="text-accentOrange shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-accentOrange mb-1">Tip</h4>
                  <p className="text-xs text-secondary leading-relaxed">Find a quiet place and use a good microphone for the best experience.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- STEP 3 --- */}
      {currentStep === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          
          {/* Left Column - Start Screen */}
          <div className="glass-panel border border-borderCard rounded-2xl p-6 lg:p-10 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Audio Wave / Mic Graphic */}
            <div className="flex items-center justify-center mb-10 w-full relative h-32">
              <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20 pointer-events-none">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} className="w-1 bg-accentOrange rounded-full" style={{ height: `${Math.random() * 40 + 10}px` }}></div>
                ))}
              </div>
              
              <div className="relative z-10 w-24 h-24 rounded-full border border-accentOrange/30 flex items-center justify-center bg-[#050505]/60 backdrop-blur-md shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                <div className="absolute inset-0 rounded-full border border-accentOrange/50 animate-ping opacity-20 duration-3000"></div>
                <Mic size={36} className="text-accentOrange drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              </div>
            </div>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">
                Ready to start your<br />
                <span className="text-accentOrange">{selectedTech.title}</span> interview?
              </h2>
              <p className="text-secondary">You'll be asked {numQuestions}.</p>
            </div>

            {/* Info Cards */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-10 w-full max-w-xl">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-black/40 flex-1 min-w-[180px]">
                <div className="text-accentOrange"><Mic size={24} /></div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-0.5">Speak clearly</h4>
                  <p className="text-[11px] text-secondary">Answer out loud</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-black/40 flex-1 min-w-[180px]">
                <div className="text-accentOrange"><BrainCircuit size={24} /></div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-0.5">AI is listening</h4>
                  <p className="text-[11px] text-secondary">We analyze in real-time</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-black/40 flex-1 min-w-[180px]">
                <div className="text-accentOrange"><MessageSquare size={24} /></div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-0.5">Get feedback</h4>
                  <p className="text-[11px] text-secondary">After each answer</p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="w-full max-w-md p-6 rounded-2xl border border-white/5 bg-white/[0.02] mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb size={18} className="text-accentOrange" />
                <h4 className="text-sm font-semibold text-white">Tips for best experience</h4>
              </div>
              <ul className="space-y-3 pl-2">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accentOrange shrink-0"></div>
                  <p className="text-xs text-gray-300">Find a quiet place</p>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accentOrange shrink-0"></div>
                  <p className="text-xs text-gray-300">Use a good quality microphone</p>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accentOrange shrink-0"></div>
                  <p className="text-xs text-gray-300">Speak at a normal pace and be clear</p>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-4 w-full max-w-[240px]">
              <Link to="/live-interview" className="w-full">
                <Button variant="primary">
                  Start Interview <ArrowRight size={18} />
                </Button>
              </Link>
              <button 
                onClick={() => setCurrentStep(2)}
                className="text-xs text-secondary hover:text-white underline underline-offset-4 transition-colors"
              >
                Back to settings
              </button>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <div className="glass-panel border border-borderCard rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-6">Interview Details</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3 text-accentOrange"><Code size={16} /><span className="text-sm font-medium text-secondary">Tech Stack</span></div>
                  <div className="flex items-center gap-2"><div className="w-5 h-5 flex items-center justify-center scale-75">{selectedTech.icon}</div><span className="text-sm font-semibold text-white">{selectedTech.title}</span></div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3 text-accentOrange"><Briefcase size={16} /><span className="text-sm font-medium text-secondary">Role</span></div>
                  <div className="flex items-center gap-2"><span className="text-sm font-semibold text-white">{role}</span></div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3 text-accentOrange"><BarChart size={16} /><span className="text-sm font-medium text-secondary">Experience Level</span></div>
                  <div className="flex items-center gap-2"><span className="text-sm font-semibold text-white">{experience}</span></div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3 text-accentOrange"><BarChart size={16} className="rotate-90" /><span className="text-sm font-medium text-secondary">Difficulty Level</span></div>
                  <div className="flex items-center gap-2"><span className="text-sm font-semibold text-white">{difficulty}</span></div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3 text-accentOrange"><Code size={16} /><span className="text-sm font-medium text-secondary">Interview Type</span></div>
                  <div className="flex items-center gap-2"><span className="text-sm font-semibold text-white">{type}</span></div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3 text-accentOrange"><HelpCircle size={16} /><span className="text-sm font-medium text-secondary">Number of Questions</span></div>
                  <div className="flex items-center gap-2"><span className="text-sm font-semibold text-white">{numQuestions}</span></div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3 text-accentOrange"><Clock size={16} /><span className="text-sm font-medium text-secondary">Duration (Estimated)</span></div>
                  <div className="flex items-center gap-2"><span className="text-sm font-semibold text-white">20 - 25 mins</span></div>
                </div>
              </div>
            </div>

            {/* What to expect? */}
            <div className="glass-panel border border-borderCard rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-6">What to expect?</h3>
              <ul className="space-y-4 mb-6">
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-accentOrange shrink-0" />
                  <p className="text-sm text-gray-300">AI will ask one question at a time</p>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-accentOrange shrink-0" />
                  <p className="text-sm text-gray-300">Speak your answers out loud</p>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-accentOrange shrink-0" />
                  <p className="text-sm text-gray-300">Get instant AI feedback and suggestions</p>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-accentOrange shrink-0" />
                  <p className="text-sm text-gray-300">You can't skip or go back to previous questions</p>
                </li>
              </ul>
              
              <div className="bg-gradient-to-r from-accentOrange/5 to-transparent border border-accentOrange/20 rounded-xl p-5 flex items-center justify-between relative overflow-hidden">
                <div className="relative z-10 w-full">
                  <h4 className="text-sm font-semibold text-accentOrange mb-1 flex items-center gap-2">
                    <Star size={16} /> All the best!
                  </h4>
                  <p className="text-xs text-secondary leading-relaxed max-w-[80%]">Stay confident, think out loud, and enjoy the learning.</p>
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 -rotate-12 translate-x-2 text-accentOrange drop-shadow-[0_0_15px_rgba(249,115,22,0.6)] z-0">
                  <Rocket size={48} strokeWidth={1} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
