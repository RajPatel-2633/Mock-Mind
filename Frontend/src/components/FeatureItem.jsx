import { motion } from "framer-motion";

export default function FeatureItem({ icon: Icon, title, description, delay = 0 }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={{ y: -5 }}
      className="flex flex-col gap-3 max-w-[200px] cursor-default"
    >
      <div className="w-12 h-12 rounded-xl bg-accentOrange/10 border border-accentOrange/20 flex items-center justify-center text-accentOrange shadow-[0_0_15px_rgba(249,115,22,0.1)]">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-base font-semibold mb-2 text-white">{title}</h3>
        <p className="text-secondary text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
