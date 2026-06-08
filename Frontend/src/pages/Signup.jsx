import InfoSection from '../components/InfoSection';
import SignupForm from '../components/SignupForm';
import { Spotlight } from '../components/ui/Spotlight';

export default function Signup() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background relative antialiased">
      {/* Background Effects */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="#f97316"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#050505_100%)] z-0 pointer-events-none"></div>

      {/* Left Container */}
      <div className="flex-[1.3] flex relative z-10">
        <InfoSection 
          titleTop="Elevate Your Career."
          titleBottom="Start Practicing "
          titleHighlight="Today."
          subtitle="Create your free account to unlock AI-driven feedback, real-time analytics, and personalized interview scenarios."
        />
      </div>
      
      {/* Right Container */}
      <div className="flex-1 flex justify-center relative z-10">
        <SignupForm />
      </div>
    </div>
  );
}
