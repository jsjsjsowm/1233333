import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const GameIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" fill="none"/>
    <circle cx="12" cy="12" r="2" fill={color}/>
    <path d="M12 2v4M12 18v4M22 12h-4M6 12H2" stroke={color} strokeWidth="2"/>
  </svg>
);

export const ProfileIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke={color} strokeWidth="2"/>
  </svg>
);

export const StatsIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 3v18h18" stroke={color} strokeWidth="2"/>
    <path d="M18 17l-3-3-4 4-4-4-3 3" stroke={color} strokeWidth="2"/>
  </svg>
);

export const HistoryIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M12 6v6l4 2" stroke={color} strokeWidth="2"/>
  </svg>
);

export const TrophyIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke={color} strokeWidth="2"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke={color} strokeWidth="2"/>
    <path d="M4 22h16" stroke={color} strokeWidth="2"/>
    <path d="M10 14.66V17c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.34" stroke={color} strokeWidth="2"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" stroke={color} strokeWidth="2"/>
  </svg>
);

export const CoinsIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M18.09 10.37A6 6 0 1 1 10.37 18.09" stroke={color} strokeWidth="2"/>
    <path d="M7 6h2v4" stroke={color} strokeWidth="2"/>
    <path d="M10.5 9.5h-4" stroke={color} strokeWidth="2"/>
  </svg>
);

export const WinIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
  </svg>
);

export const LossIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M15 9l-6 6M9 9l6 6" stroke={color} strokeWidth="2"/>
  </svg>
);

export const LoadingIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M21 12a9 9 0 11-6.219-8.56" stroke={color} strokeWidth="2"/>
  </svg>
);

export const EmptyIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M8 15s1.5 2 4 2 4-2 4-2" stroke={color} strokeWidth="2"/>
    <path d="M9 9h.01M15 9h.01" stroke={color} strokeWidth="2"/>
  </svg>
);
