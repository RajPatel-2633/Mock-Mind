import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import MockInterview from './pages/MockInterview';
import LiveInterview from './pages/LiveInterview';
import InterviewFeedback from './pages/InterviewFeedback';
import InterviewHistory from './pages/InterviewHistory';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Full Screen Routes */}
      <Route path="/live-interview" element={<LiveInterview />} />
      
      {/* Protected/Dashboard Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mock-interviews" element={<MockInterview />} />
        <Route path="/feedback" element={<InterviewFeedback />} />
        <Route path="/history" element={<InterviewHistory />} />
        <Route path="/settings" element={<div className="text-white p-8">Settings</div>} />
      </Route>
    </Routes>
  );
}

export default App;
