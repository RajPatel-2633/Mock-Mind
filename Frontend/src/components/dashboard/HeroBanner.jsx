import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Button from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    id: 1,
    titleTop: "Practice Interviews.",
    titleBottom: "Speak with ",
    titleHighlight: "Confidence.",
    subtitle: "Start a mock interview, speak your answers,\nand get AI-powered feedback instantly.",
    image: "/carousel-1.png",
    imageAlt: "Carousel 1"
  },
  {
    id: 2,
    titleTop: "Instant AI Evaluation.",
    titleBottom: "Get scored ",
    titleHighlight: "Accurately.",
    subtitle: "Receive detailed insights on your delivery,\ncontent, and areas for improvement.",
    image: "/carousel-2.png",
    imageAlt: "Carousel 2"
  },
  {
    id: 3,
    titleTop: "Improve & Grow.",
    titleBottom: "Track your ",
    titleHighlight: "Progress.",
    subtitle: "See your average scores rise as you\npractice more and become interview ready.",
    image: "/carousel-3.png",
    imageAlt: "Carousel 3"
  },
  {
    id: 4,
    titleTop: "Choose a Role.",
    titleBottom: "Practice for ",
    titleHighlight: "Your Dream Job.",
    subtitle: "Tailored mock interviews for developers,\nproduct managers, and data analysts.",
    image: "/carousel-4.png",
    imageAlt: "Carousel 4"
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Auto-slide every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-[1100px] mx-auto rounded-2xl overflow-hidden min-h-[250px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate('/mock-interviews')}
          className="w-full relative flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        >

          {/* Main Crisp Image */}
          <img 
            src={slides[currentSlide].image} 
            alt={slides[currentSlide].imageAlt} 
            className="w-full h-auto max-h-[300px] md:max-h-[400px] lg:max-h-[550px] object-contain block relative z-10" 
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
