import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTelegram } from './TelegramContext';
import { API_ENDPOINTS } from '../config/api';

interface User {
  id: string;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (telegramData: any) => Promise<void>;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  updateBalance: () => {},
  isLoading: true,
  isAuthenticated: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user: telegramUser, isReady } = useTelegram();

  const login = async (telegramData: any) => {
    try {
      setIsLoading(true);
      const response = await fetch(API_ENDPOINTS.AUTH.TELEGRAM, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(telegramData),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      setUser(data.user);
      setToken(data.token);
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateBalance = (newBalance: number) => {
    if (user) {
      setUser({ ...user, balance: newBalance });
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      console.log('AuthContext: Initializing auth...', { isReady, telegramUser: telegramUser ? 'exists' : 'missing' });
      
      // For development/demo purposes, use mock data instead of real API calls
      setTimeout(() => {
        const mockUser: User = {
          id: '1',
          telegramId: telegramUser?.id?.toString() || '123456789',
          username: telegramUser?.username || 'demo_user',
          firstName: telegramUser?.first_name || 'Demo',
          lastName: telegramUser?.last_name || 'User',
          balance: 1000
        };
        
        const mockToken = 'mock_jwt_token_' + Date.now();
        
        setUser(mockUser);
        setToken(mockToken);
        localStorage.setItem('token', mockToken);
        setIsLoading(false);
        
        console.log('AuthContext: Mock auth completed', mockUser);
      }, 500);

      // TODO: Replace with real API calls when backend is deployed
      /*
      if (!isReady) return;

      // Check for stored token
      const storedToken = localStorage.getItem('token');
      if (storedToken && telegramUser) {
        try {
          // Verify token and get user data
          const response = await fetch(API_ENDPOINTS.USERS.PROFILE, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setToken(storedToken);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
        }
      }

      // If no valid token and we have Telegram user data, authenticate
      if (!storedToken && telegramUser) {
        try {
          await login({
            id: telegramUser.id,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
            username: telegramUser.username,
            auth_date: Math.floor(Date.now() / 1000),
            hash: 'mock_hash', // In production, this would be the real hash
          });
        } catch (error) {
          console.error('Auto-login failed:', error);
        }
      }

      setIsLoading(false);
      */
    };

    initAuth();
  }, [isReady, telegramUser]);

  const isAuthenticated = !!(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateBalance,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
