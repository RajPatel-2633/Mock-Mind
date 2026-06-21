import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import { 
  Edit3, MapPin, Calendar, Bot, Trophy, Clock, TrendingUp,
  User, Mail, Phone, ChevronRight, Code, Briefcase, BarChart, 
  Gauge, List, MessageSquare, Bell, CalendarDays, Lightbulb,
  Lock, Link as LinkIcon, Trash2, LogOut, Headphones, Camera
} from 'lucide-react';
import api from '../lib/axios';



const SettingItem = ({ icon: Icon, title, value, hasChevron = true, valueClass = "text-gray-300", iconClass = "text-accentOrange" }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] -mx-4 px-4 rounded-lg transition-colors cursor-pointer">
    <div className="flex items-center gap-3">
      <Icon size={18} className={iconClass} />
      <span className="text-sm font-medium text-white">{title}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-sm ${valueClass}`}>{value}</span>
      {hasChevron && <ChevronRight size={16} className="text-secondary" />}
    </div>
  </div>
);

export default function Settings() {
  const { user: userProfile, logout } = useAuthStore();
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    totalPracticeTime: 0,
    dayStreak: 0
  });
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/interview/dashboard-stats');
        setStats(statsRes.data.data);
      } catch (error) {
        console.error("Failed to fetch settings data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Profile & Settings</h1>
        <p className="text-sm text-secondary">Manage your account, preferences and interview settings.</p>
      </header>

      {/* Top Profile Card */}
      <div className="glass-panel border border-borderCard rounded-2xl p-6 lg:p-8 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        
        {/* Left: User Info */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-accentOrange/10 border-2 border-accentOrange/30 flex items-center justify-center text-accentOrange text-3xl font-bold uppercase">
              {userProfile ? userProfile.name.slice(0, 2) : 'RP'}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-white hover:text-accentOrange hover:border-accentOrange transition-colors">
              <Camera size={14} />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-white">{isLoading ? 'Loading...' : (userProfile?.name || 'User')}</h2>
              <button className="flex items-center gap-1 text-xs font-semibold text-accentOrange hover:underline">
                Edit <Edit3 size={12} />
              </button>
            </div>
            <p className="text-sm text-secondary mb-3">{isLoading ? 'Loading...' : (userProfile?.email || '')}</p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <MapPin size={14} className="text-secondary" /> {userProfile?.location || 'Unknown Location'}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar size={14} className="text-secondary" /> Member since {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown'}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex items-center gap-6 md:gap-10 pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-white/5 md:pl-10 w-full md:w-auto">
          <div className="flex flex-col items-center gap-2">
            <div className="text-accentOrange bg-accentOrange/10 p-2 rounded-full"><Bot size={18} /></div>
            <div className="text-xl font-bold text-white">{isLoading ? '--' : stats.totalInterviews}</div>
            <div className="text-[11px] text-secondary">Total Interviews</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-purple-500 bg-purple-500/10 p-2 rounded-full"><Trophy size={18} /></div>
            <div className="text-xl font-bold text-white">{isLoading ? '--' : stats.averageScore}</div>
            <div className="text-[11px] text-secondary">Average Score</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-blue-500 bg-blue-500/10 p-2 rounded-full"><Clock size={18} /></div>
            <div className="text-xl font-bold text-white">{isLoading ? '--' : `${Math.floor(stats.totalPracticeTime / 60)}h ${stats.totalPracticeTime % 60}m`}</div>
            <div className="text-[11px] text-secondary">Total Practice Time</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-green-500 bg-green-500/10 p-2 rounded-full"><TrendingUp size={18} /></div>
            <div className="text-xl font-bold text-white">{isLoading ? '--' : stats.dayStreak}</div>
            <div className="text-[11px] text-secondary">Day Streak</div>
          </div>
        </div>

      </div>

      <div className="space-y-6">
          {/* Account Information */}
          <div className="glass-panel border border-borderCard rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4">Account Information</h3>
            <div className="flex flex-col">
              <SettingItem icon={User} title="Full Name" value={userProfile?.name || '---'} />
              <SettingItem icon={Mail} title="Email Address" value={userProfile?.email || '---'} />
              <SettingItem icon={Phone} title="Phone Number" value={userProfile?.phone || 'Not provided'} />
              <SettingItem icon={MapPin} title="Location" value={userProfile?.location || 'Unknown Location'} />
            </div>
          </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button 
          onClick={async () => {
             await logout();
             window.location.href = '/login';
          }}
          className="flex items-center gap-3 px-6 py-4 glass-panel border border-borderCard rounded-xl hover:bg-white/[0.02] transition-colors group"
        >
          <LogOut size={18} className="text-secondary group-hover:text-white transition-colors" />
          <div className="text-left">
            <h4 className="text-sm font-semibold text-white">Logout</h4>
            <p className="text-xs text-secondary">Sign out from your account</p>
          </div>
        </button>

        <button className="flex items-center gap-3 px-6 py-4 border border-accentOrange/30 bg-accentOrange/5 rounded-xl hover:bg-accentOrange/10 transition-colors group shadow-[0_0_15px_rgba(249,115,22,0.1)]">
          <Headphones size={20} className="text-accentOrange" />
          <div className="text-left">
            <h4 className="text-sm font-semibold text-white">Need Help?</h4>
            <p className="text-xs text-secondary">Contact our support team</p>
          </div>
        </button>
      </div>

    </div>
  );
}
