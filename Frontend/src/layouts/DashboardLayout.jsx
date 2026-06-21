import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, BotMessageSquare } from "lucide-react";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden antialiased relative">
      
      {/* Sidebar Drawer (All screen sizes) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full z-50 shadow-[20px_0_40px_rgba(0,0,0,0.5)] border-r border-white/5 bg-[#0A0A0A]"
            >
              <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#050505] relative z-0 w-full flex flex-col">
        
        {/* Global Header with Hamburger */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-white/5 bg-[#0A0A0A] shrink-0 sticky top-0 z-30">
           <div className="flex items-center gap-3">
             <BotMessageSquare size={28} className="text-accentOrange drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
             <h2 className="text-lg font-bold leading-none">
               <span className="text-accentOrange">Mock</span>Mind
             </h2>
           </div>
           <button 
             onClick={() => setIsSidebarOpen(true)} 
             className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
           >
             <Menu size={24} />
           </button>
        </div>

        <div className="w-full max-w-[1800px] mx-auto px-4 md:px-8 pt-4 pb-8 relative z-10 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              <Outlet context={{ setIsSidebarOpen }} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
