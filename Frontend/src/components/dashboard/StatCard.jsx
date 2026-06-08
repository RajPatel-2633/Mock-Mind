import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, title, value, subValue, highlight, delay = 0 }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel border border-borderCard rounded-2xl p-6 flex items-center gap-5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
    >
      <div className="w-14 h-14 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-accentOrange group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all duration-300 shrink-0">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-secondary text-xs mb-1 font-medium">{title}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          {subValue && <span className="text-secondary text-xs font-medium">{subValue}</span>}
        </div>
        {highlight && <div className="text-xs text-secondary mt-1">{highlight}</div>}
      </div>
    </motion.div>
  );
}
