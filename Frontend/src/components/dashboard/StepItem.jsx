export default function StepItem({ icon: Icon, title, description, isLast }) {
  return (
    <div className="flex gap-4 relative">
      {!isLast && (
        <div className="absolute left-6 top-14 bottom-[-10px] w-px bg-dashed border-l border-dashed border-white/20"></div>
      )}
      <div className="w-12 h-12 shrink-0 rounded-full bg-[#141414] border border-white/5 flex items-center justify-center text-accentOrange relative z-10">
        <Icon size={20} />
      </div>
      <div className="pt-2 pb-8">
        <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
        <p className="text-xs text-secondary leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
