import { create } from 'zustand';
import Cookies from 'js-cookie';
import { getProfile, logout as apiLogout } from '@/lib/api';

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
  avatar?: string;
  status: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  syncAuth: () => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, token) => {
    localStorage.setItem('auth_token', token);
    Cookies.set('auth_token', token, { expires: 7 });
    Cookies.set('user_role', user.role, { expires: 7 });
    localStorage.setItem('user_data', JSON.stringify(user));
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    const token = get().token || localStorage.getItem('auth_token');
    if (token) {
      try {
        await apiLogout(token);
      } catch (error) {
        console.error("Logout error", error);
      }
    }
    localStorage.removeItem('auth_token');
    Cookies.remove('auth_token');
    Cookies.remove('user_role');
    localStorage.removeItem('user_data');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  syncAuth: () => {
    const token = localStorage.getItem('auth_token') || Cookies.get('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      const user = JSON.parse(userData);
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      // Optionally refresh profile
      getProfile(token).then(updatedUser => {
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        set({ user: updatedUser });
      }).catch(() => {
        // If profile fetch fails, token might be invalid
      });
    } else {
      set({ isLoading: false });
    }
  },
}));
