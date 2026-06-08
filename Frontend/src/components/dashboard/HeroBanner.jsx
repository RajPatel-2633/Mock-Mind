import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Button from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    titleTop: "Practice Interviews.",
    titleBottom: "Speak with ",
    titleHighlight: "Confidence.",
    subtitle: "Start a mock interview, speak your answers,\nand get AI-powered feedback instantly.",
    image: "/glowing_microphone.png",
    imageAlt: "Glowing Microphone"
  },
  {
    id: 2,
    titleTop: "Instant AI Evaluation.",
    titleBottom: "Get scored ",
    titleHighlight: "Accurately.",
    subtitle: "Receive detailed insights on your delivery,\ncontent, and areas for improvement.",
    image: "/glowing_brain.png",
    imageAlt: "Glowing AI Brain"
  },
  {
    id: 3,
    titleTop: "Improve & Grow.",
    titleBottom: "Track your ",
    titleHighlight: "Progress.",
    subtitle: "See your average scores rise as you\npractice more and become interview ready.",
    image: "/glowing_chart.png",
    imageAlt: "Glowing Rising Chart"
  },
  {
    id: 4,
    titleTop: "Choose a Role.",
    titleBottom: "Practice for ",
    titleHighlight: "Your Dream Job.",
    subtitle: "Tailored mock interviews for developers,\nproduct managers, and data analysts.",
    image: "/glowing_briefcase.png",
    imageAlt: "Glowing Briefcase"
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Auto-slide every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden glass-panel border border-borderCard p-10 flex items-center justify-between min-h-[320px]">
      {/* Background Gradient */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accentOrange/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-lg min-h-[160px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold leading-tight mb-4 tracking-tight text-white">
              {slides[currentSlide].titleTop}<br />
              {slides[currentSlide].titleBottom}<span className="text-accentOrange">{slides[currentSlide].titleHighlight}</span>
            </h1>
            <p className="text-secondary text-sm leading-relaxed mb-8 whitespace-pre-line">
              {slides[currentSlide].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
        <div className="w-[260px]">
          <Button variant="primary">
            Start New Mock Interview <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex justify-center items-center">
        {/* Sound Wave Graphic (Simulated glowing effect) */}
        <div className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-60 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div 
              key={i} 
              className="w-1 bg-accentOrange rounded-full" 
              style={{ height: `${Math.random() * 50 + 10}px`, opacity: Math.random() * 0.5 + 0.2 }}
            ></div>
          ))}
        </div>
        
        {/* Image Container */}
        <div className="relative w-56 h-56 rounded-full border border-accentOrange/30 flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.4)] bg-[#050505]/60 backdrop-blur-md overflow-hidden">
          <div className="absolute inset-0 rounded-full border border-accentOrange/50 animate-ping opacity-20 duration-3000"></div>
          
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.5 }}
              src={slides[currentSlide].image} 
              alt={slides[currentSlide].imageAlt} 
              className="absolute w-36 h-36 object-contain drop-shadow-[0_0_20px_rgba(249,115,22,0.6)]" 
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? "bg-accentOrange w-6" : "bg-white/20 hover:bg-white/40"}`}
          ></button>
        ))}
      </div>
    </div>
  );
}
