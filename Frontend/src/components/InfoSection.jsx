import { Mic, BrainCircuit, TrendingUp, BotMessageSquare } from 'lucide-react';
import FeatureItem from './FeatureItem';
import { motion } from 'framer-motion';

export default function InfoSection({
  titleTop = "Practice Interviews.",
  titleBottom = "Speak with ",
  titleHighlight = "Confidence.",
  subtitle = "AI-powered mock interviews that listen, evaluate, and help you improve — one answer at a time."
}) {
  return (
    <div className="flex-1 flex flex-col px-[4vw] py-[4vh] relative z-10">
      
      {/* Brand Logo */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-3 mb-[4vh]"
      >
        <BotMessageSquare size={36} className="text-accentOrange drop-shadow-[0_0_10px_rgba(249,115,22,0.4)]" />
        <div>
          <h2 className="text-2xl font-bold">
            <span className="text-accentOrange">Mock</span> Mind
          </h2>
          <p className="text-secondary text-sm">Practice. Speak. Improve.</p>
        </div>
      </motion.div>

      {/* Main Copy */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-[520px] mb-[3vh]"
      >
        <h1 className="text-5xl font-bold leading-tight mb-4 tracking-tight">
          {titleTop}<br />
          {titleBottom}<span className="text-accentOrange">{titleHighlight}</span>
        </h1>
        <p className="text-secondary text-base leading-relaxed">
          {subtitle}
        </p>
      </motion.div>

      {/* Features Row */}
      <div className="flex gap-6 mb-[2vh]">
        <FeatureItem 
          icon={Mic} 
          title="Speak Naturally" 
          description="Answer out loud using your microphone." 
          delay={0.3} 
        />
        <FeatureItem 
          icon={BrainCircuit} 
          title="AI Evaluation" 
          description="Get instant AI feedback and scoring." 
          delay={0.4} 
        />
        <FeatureItem 
          icon={TrendingUp} 
          title="Improve & Grow" 
          description="Track your progress and become interview ready." 
          delay={0.5} 
        />
      </div>

      {/* Podium Image */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex-1 flex justify-center items-end mt-auto min-h-0 relative"
      >
        <div className="absolute inset-0 bg-accentOrange/5 blur-[100px] rounded-full"></div>
        <img 
          src="/glowing_microphone.png" 
          alt="Glowing AI Microphone" 
          className="max-w-full max-h-[35vh] object-contain drop-shadow-[0_0_40px_rgba(249,115,22,0.2)] relative z-10" 
        />
      </motion.div>

    </div>
  );
}
