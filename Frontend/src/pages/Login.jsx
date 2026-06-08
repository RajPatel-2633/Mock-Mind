import InfoSection from '../components/InfoSection';
import LoginForm from '../components/LoginForm';
import { Spotlight } from '../components/ui/Spotlight';

export default function Login() {
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
        <InfoSection />
      </div>
      
      {/* Right Container */}
      <div className="flex-1 flex justify-center relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
