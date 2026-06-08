import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden antialiased relative">
      {/* Sidebar Drawer */}
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
              className="fixed top-0 left-0 h-full z-50 shadow-[20px_0_40px_rgba(0,0,0,0.5)] border-r border-white/5 bg-[#050505]"
            >
              <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0a0a0a] relative z-0 w-full">
        <div className="w-full max-w-[1800px] mx-auto px-[4vw] py-8 relative z-10">
          <Outlet context={{ setIsSidebarOpen }} />
        </div>
      </main>
    </div>
  );
}
