import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Star, CheckCircle, Lightbulb, AlertCircle, RefreshCw, Home, BrainCircuit } from "lucide-react";
import { cn } from "../lib/utils";

const mockFeedbackData = [
  {
    id: 1,
    question: "Can you explain the difference between the Virtual DOM and the Real DOM in React?",
    userAnswer: "I think the Virtual DOM is a lightweight copy of the actual DOM, which allows React to update the browser efficiently by comparing the new Virtual DOM with a pre-update version. It only applies the calculated differences, or 'diffs', to the real DOM, making it much faster.",
    expectedAnswer: "The Virtual DOM is an in-memory representation of the Real DOM. React uses it to improve performance by calculating the most efficient way to update the Real DOM (a process called Reconciliation). Instead of updating the whole tree, it only updates the specific nodes that changed.",
    feedback: "Great answer! You correctly identified that it's a lightweight copy and mentioned the 'diffing' process. To improve, you could explicitly mention the term 'Reconciliation' as it's a key React concept interviewers look for.",
    rating: 8
  },
  {
    id: 2,
    question: "What are React Hooks?",
    userAnswer: "Hooks are functions that let you use state and other React features without writing a class.",
    expectedAnswer: "Hooks are special functions introduced in React 16.8 that allow you to 'hook into' React state and lifecycle features from function components. Examples include useState, useEffect, and useContext.",
    feedback: "Your answer is correct but quite brief. An interviewer would expect you to mention a few common hooks (like useState or useEffect) and perhaps mention that they were introduced to replace class component lifecycles.",
    rating: 6
  }
];

export default function InterviewFeedback() {
  const [expandedId, setExpandedId] = useState(mockFeedbackData[0].id);

  // Calculate overall rating
  const totalRating = mockFeedbackData.reduce((acc, curr) => acc + curr.rating, 0);
  const averageRating = Math.round((totalRating / (mockFeedbackData.length * 10)) * 10);

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header & Scorecard */}
      <div className="glass-panel p-8 rounded-2xl border border-borderCard relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accentOrange/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          
          {/* Circular Progress */}
          <div className="relative w-40 h-40 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle 
                cx="50" cy="50" r="45" 
                className="text-white/10 stroke-current" 
                strokeWidth="8" fill="transparent" 
              />
              <circle 
                cx="50" cy="50" r="45" 
                className={cn("stroke-current transition-all duration-1000 ease-out", averageRating >= 7 ? "text-green-500" : averageRating >= 5 ? "text-accentOrange" : "text-red-500")}
                strokeWidth="8" fill="transparent" 
                strokeDasharray="283" 
                strokeDashoffset={283 - (283 * (averageRating * 10)) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">{averageRating}/10</span>
              <span className="text-xs text-secondary uppercase tracking-widest mt-1">Score</span>
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-white mb-3">Interview Completed! 🎉</h1>
            <p className="text-secondary leading-relaxed mb-6">
              Great job finishing your ReactJS mock interview. Review your detailed question-by-question feedback below to identify areas of improvement before your real interview.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
               <Link to="/dashboard" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors">
                 <Home size={16} /> Go to Dashboard
               </Link>
               <Link to="/mock-interviews" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accentOrange hover:bg-orange-600 text-white font-medium shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all hover:scale-105">
                 <RefreshCw size={16} /> Try Another Interview
               </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Detailed Feedback Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <CheckCircle className="text-accentOrange" size={20} /> Detailed Breakdown
        </h2>
        
        <div className="space-y-4">
          {mockFeedbackData.map((item, index) => (
            <div key={item.id} className="glass-panel border border-borderCard rounded-xl overflow-hidden transition-all duration-300">
              {/* Accordion Header */}
              <button 
                onClick={() => toggleAccordion(item.id)}
                className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-white/5 transition-colors focus:outline-none"
              >
                <div>
                  <span className="text-xs font-bold text-accentOrange uppercase tracking-widest mb-2 block">Question {index + 1}</span>
                  <h3 className="text-lg font-semibold text-white leading-snug">{item.question}</h3>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 mt-1">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold border",
                    item.rating >= 8 ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                    item.rating >= 5 ? "bg-accentOrange/10 text-accentOrange border-accentOrange/20" : 
                    "bg-red-500/10 text-red-500 border-red-500/20"
                  )}>
                    {item.rating}/10
                  </span>
                  {expandedId === item.id ? <ChevronUp className="text-secondary" /> : <ChevronDown className="text-secondary" />}
                </div>
              </button>

              {/* Accordion Body */}
              <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                expandedId === item.id ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="p-6 pt-0 space-y-6 border-t border-white/5 mt-2">
                  
                  {/* User vs Expected Answer Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Your Answer */}
                    <div className="bg-black/30 rounded-xl p-5 border border-red-500/10">
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                        <AlertCircle size={16} className="text-red-400" /> Your Answer
                      </h4>
                      <p className="text-sm text-gray-300 leading-relaxed italic">
                        "{item.userAnswer}"
                      </p>
                    </div>

                    {/* Expected Answer */}
                    <div className="bg-black/30 rounded-xl p-5 border border-green-500/10">
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                        <Lightbulb size={16} className="text-green-400" /> Expected Answer
                      </h4>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {item.expectedAnswer}
                      </p>
                    </div>
                  </div>

                  {/* AI Feedback Box */}
                  <div className="relative bg-accentOrange/5 border border-accentOrange/20 rounded-xl p-6 overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accentOrange"></div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-accentOrange mb-3">
                      <BrainCircuit size={18} /> AI Feedback
                    </h4>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {item.feedback}
                    </p>
                  </div>

                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
