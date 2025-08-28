import React, { createContext, useContext, useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    auth_date: number;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  ready: () => void;
  expand: () => void;
  close: () => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
}

interface TelegramContextType {
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  isReady: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
  isReady: false,
});

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};

interface TelegramProviderProps {
  children: React.ReactNode;
}

export const TelegramProvider: React.FC<TelegramProviderProps> = ({ children }) => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if we're running in Telegram Web App
    const tg = (window as any).Telegram?.WebApp;
    
    if (tg) {
      tg.ready();
      setWebApp(tg);
      setUser(tg.initDataUnsafe?.user || null);
      setIsReady(true);
      
      // Expand the app to full height
      tg.expand();
      
      // Set theme
      if (tg.colorScheme === 'dark') {
        document.documentElement.classList.add('dark-theme');
      }
    } else {
      // Development mode - create mock user
      const mockUser: TelegramUser = {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
      };
      
      const mockWebApp = {
        initDataUnsafe: {
          user: mockUser,
          auth_date: Math.floor(Date.now() / 1000),
          hash: 'mock_hash',
        },
        HapticFeedback: {
          impactOccurred: (style: string) => console.log('Haptic:', style),
          notificationOccurred: (type: string) => console.log('Notification:', type),
          selectionChanged: () => console.log('Selection changed'),
        },
        MainButton: {
          show: () => {},
          hide: () => {},
          setText: () => {},
          onClick: () => {},
        },
        ready: () => {},
        expand: () => {},
        close: () => {},
      } as any;
      
      setWebApp(mockWebApp);
      setUser(mockUser);
      setIsReady(true);
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ webApp, user, isReady }}>
      {children}
    </TelegramContext.Provider>
  );
};
