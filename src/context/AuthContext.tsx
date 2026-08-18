import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/job';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const USER_STORAGE_KEY = 'careerpulse_auth_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading cached user:', e);
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = apiService.getAuthToken();
      if (token) {
        const currentUser = await apiService.getMe();
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
        } else {
          setUser(null);
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiService.login(email, password);
    setUser(res.user);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
    setIsAuthModalOpen(false);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await apiService.register(name, email, password);
    setUser(res.user);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    apiService.setAuthToken(null);
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
