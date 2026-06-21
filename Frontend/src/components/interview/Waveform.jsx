import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const Waveform = ({ playing, className, count = 30 }) => (
  <div className={cn("flex items-center justify-center gap-1", className)}>
    {Array.from({ length: count }).map((_, i) => {
      const minHeight = 4 + Math.random() * 8;
      const maxHeight = minHeight + Math.random() * 24;
      return (
        <motion.div 
          key={i}
          animate={playing ? { height: [minHeight, maxHeight, minHeight] } : { height: minHeight }}
          transition={playing ? { duration: 0.6, repeat: Infinity, delay: Math.random() * 0.6, ease: "easeInOut" } : {}}
          className={cn("w-1 rounded-full", playing ? "bg-accentOrange" : "bg-white/20")}
        />
      );
    })}
  </div>
);
