// API configuration for different environments
declare const process: any;

const API_BASE_URL = (window as any).REACT_APP_API_URL || 
  (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) ||
  (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production' 
    ? 'https://your-backend-url.herokuapp.com' 
    : 'http://localhost:3001');

export const API_ENDPOINTS = {
  AUTH: {
    TELEGRAM: `${API_BASE_URL}/api/auth/telegram`,
  },
  USERS: {
    PROFILE: `${API_BASE_URL}/api/users/profile`,
  },
  GAMES: {
    PLAY_ROULETTE: `${API_BASE_URL}/api/games/roulette/play`,
    HISTORY: `${API_BASE_URL}/api/games/history`,
    STATS: `${API_BASE_URL}/api/games/stats`,
  },
};

export default API_BASE_URL;
