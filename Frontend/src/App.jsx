import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import DashboardLayout from './layouts/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loading pages
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MockInterview = lazy(() => import('./pages/MockInterview'));
const LiveInterview = lazy(() => import('./pages/LiveInterview'));
const InterviewFeedback = lazy(() => import('./pages/InterviewFeedback'));
const InterviewHistory = lazy(() => import('./pages/InterviewHistory'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Global Loader
const PageLoader = () => {
  const [showSlowMessage, setShowSlowMessage] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSlowMessage(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white/10 border-t-accentOrange rounded-full animate-spin"></div>
        <p className="text-sm font-medium tracking-widest text-accentOrange uppercase">Loading</p>
        {showSlowMessage && (
          <p className="text-xs text-secondary mt-2 text-center max-w-xs animate-pulse">
            Please wait, the server is waking up...<br/>(This can take up to 50 seconds on free hosting)
          </p>
        )}
      </div>
    </div>
  );
};

const ProtectedRoute = () => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();
  
  if (isCheckingAuth) {
    return <PageLoader />;
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();
  
  if (isCheckingAuth) {
    return <PageLoader />;
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

import { Toaster } from 'react-hot-toast';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ErrorBoundary>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
          success: {
            iconTheme: {
              primary: '#f97316',
              secondary: '#fff',
            },
          },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Full Screen Routes */}
            <Route path="/live-interview/:id" element={<LiveInterview />} />
            
            {/* Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/mock-interviews" element={<MockInterview />} />
              <Route path="/feedback" element={<InterviewFeedback />} />
              <Route path="/history" element={<InterviewHistory />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
