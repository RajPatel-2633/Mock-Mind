import { Check } from "lucide-react";

export default function Stepper({ currentStep, selectedTech }) {
  const steps = [
    { num: 1, title: "Choose Tech Stack", desc: currentStep > 1 && selectedTech ? selectedTech.title : "Select the domain you want to practice" },
    { num: 2, title: "Interview Settings", desc: currentStep > 2 ? "Customized" : "Customize your interview" },
    { num: 3, title: "Start Interview", desc: "Start speaking and get AI feedback" },
  ];

  return (
    <div className="flex items-center justify-between w-full mx-auto glass-panel p-6 rounded-2xl border border-borderCard mb-8 bg-[#0a0a0a]">
      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.num;
        const isActive = currentStep === step.num;
        
        return (
          <div key={idx} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 
                ${isActive ? 'bg-accentOrange text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] border border-transparent' 
                  : isCompleted ? 'bg-[#1a1a1a] text-accentOrange border border-accentOrange' 
                  : 'bg-[#1a1a1a] text-secondary border border-white/10'}`}>
                {isCompleted ? <Check size={18} /> : step.num}
              </div>
              <div>
                <h4 className={`text-sm font-semibold transition-colors ${(isActive || isCompleted) ? 'text-white' : 'text-secondary'}`}>{step.title}</h4>
                <p className={`text-xs transition-colors ${isCompleted && step.num === 1 ? 'text-accentOrange font-medium' : 'text-secondary'}`}>{step.desc}</p>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 mx-6 border-t ${currentStep > idx + 1 ? 'border-solid border-accentOrange' : 'border-dashed border-white/10'} transition-colors duration-300`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
