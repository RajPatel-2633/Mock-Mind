import React from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center font-inter">
          <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Oops! Something went wrong.</h1>
          <p className="text-secondary max-w-md mb-8">
            An unexpected error has occurred in the application. We've been notified and are looking into it.
          </p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
            >
              <RefreshCw size={18} /> Reload Page
            </button>
            <Link 
              to="/dashboard"
              className="flex items-center gap-2 px-6 py-3 bg-accentOrange text-white rounded-xl hover:bg-orange-600 transition-colors font-medium shadow-[0_0_15px_rgba(249,115,22,0.4)]"
            >
              <Home size={18} /> Go to Dashboard
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
