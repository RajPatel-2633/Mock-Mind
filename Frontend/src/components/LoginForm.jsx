import { useState } from 'react';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import Input from './ui/Input';
import Button from './ui/Button';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Handled in store
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'}/auth/google`;
  };

  const GoogleIcon = (
    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      <path d="M1 1h22v22H1z" fill="none"/>
    </svg>
  );

  const MicrosoftIcon = (
    <svg viewBox="0 0 21 21" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 0H0v10h10V0z" fill="#f25022"/>
      <path d="M21 0H11v10h10V0z" fill="#7fba00"/>
      <path d="M10 11H0v10h10V11z" fill="#00a4ef"/>
      <path d="M21 11H11v10h10V11z" fill="#ffb900"/>
    </svg>
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-center pl-[2vw] pr-[6vw] py-[2vh] min-h-0 relative z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-panel w-full max-w-[390px] p-7 relative"
      >
        <div className="text-center mb-5">
          <h2 className="text-xl font-semibold mb-1 text-white">Welcome Back! 👋</h2>
          <p className="text-secondary text-xs">Login to continue your interview practice</p>
        </div>



        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          {error && (
            <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-xs text-center">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium mb-1 text-gray-200">Email</label>
            <Input 
              icon={Mail} 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-gray-200">Password</label>
            <Input 
              icon={Lock} 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-right mt-1">
              <a href="#" className="text-[11px] text-accentOrange hover:text-accentOrangeHover transition-colors">Forgot Password?</a>
            </div>
          </div>

          <Button type="submit" variant="primary" className="mt-1" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <div className="flex items-center my-4 text-secondary">
          <div className="flex-1 h-px bg-borderCard"></div>
          <span className="px-3 text-xs">or</span>
          <div className="flex-1 h-px bg-borderCard"></div>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="secondary" iconNode={GoogleIcon} onClick={handleGoogleLogin}>Continue with Google</Button>
        </div>

        <div className="text-center mt-4 text-xs text-secondary">
          Don't have an account? <Link to="/signup" className="text-accentOrange font-medium hover:text-accentOrangeHover transition-colors">Sign up</Link>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-center gap-2 mt-[3vh] text-secondary text-xs"
      >
        <ShieldCheck size={16} />
        <span>Your data is secure and protected.</span>
      </motion.div>
    </div>
  );
}
