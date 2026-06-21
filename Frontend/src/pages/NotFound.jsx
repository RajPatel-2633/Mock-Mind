import React from 'react';
import { Home, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center font-inter relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accentOrange/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
        <Compass size={40} className="text-accentOrange" />
      </div>
      
      <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accentOrange to-orange-400 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
      
      <p className="text-secondary max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      
      <Link 
        to="/dashboard"
        className="flex items-center gap-2 px-6 py-3 bg-accentOrange text-white rounded-xl hover:bg-orange-600 transition-colors font-medium shadow-[0_0_15px_rgba(249,115,22,0.4)] relative z-10"
      >
        <Home size={18} /> Back to Home
      </Link>
    </div>
  );
}
