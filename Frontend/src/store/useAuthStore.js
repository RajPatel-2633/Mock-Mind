import { create } from 'zustand';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  isLoading: false,
  error: null,

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', { name, email, password });
      set({ isLoading: false });
      toast.success('Account created successfully!');
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Signup failed';
      set({ isLoading: false, error: errorMsg });
      toast.error(errorMsg);
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/login', { email, password });
      const profileRes = await api.get('/auth/profile');
      set({ user: profileRes.data.data, isAuthenticated: true, isLoading: false });
      toast.success('Welcome back!');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      set({ isLoading: false, error: errorMsg });
      toast.error(errorMsg);
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/logout');
      set({ user: null, isAuthenticated: false, isLoading: false });
      toast.success('Logged out successfully');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Logout failed';
      set({ isLoading: false, error: errorMsg });
      toast.error(errorMsg);
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await api.get('/auth/profile');
      set({ user: response.data.data, isAuthenticated: true, isCheckingAuth: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },
  
  clearError: () => set({ error: null })
}));

export default useAuthStore;
