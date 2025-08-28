/// <reference types="react-scripts" />

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}
