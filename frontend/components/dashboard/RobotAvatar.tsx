'use client';

import { cn } from '@/app/lib/utils';

export const ROBOT_AVATARS = [
  { id: 1, color: 'bg-blue-500/20 text-blue-500', svg: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-2">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="15" x2="8" y2="15.01" />
      <line x1="16" y1="15" x2="16" y2="15.01" />
    </svg>
  )},
  { id: 2, color: 'bg-emerald-500/20 text-emerald-500', svg: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-2">
      <path d="M12 8V4H8" />
      <rect x="5" y="8" width="14" height="12" rx="2" />
      <circle cx="9" cy="13" r="1" />
      <circle cx="15" cy="13" r="1" />
      <path d="M9 17h6" />
    </svg>
  )},
  { id: 3, color: 'bg-indigo-500/20 text-indigo-500', svg: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-2">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M9 2v4" />
      <path d="M15 2v4" />
      <path d="M4 11h16" />
      <circle cx="8" cy="14" r="1.5" />
      <circle cx="16" cy="14" r="1.5" />
    </svg>
  )},
  { id: 4, color: 'bg-amber-500/20 text-amber-500', svg: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-2">
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <rect x="6" y="6" width="12" height="12" rx="6" />
      <circle cx="9" cy="11" r="1" />
      <circle cx="15" cy="11" r="1" />
      <path d="M9 15h6" />
    </svg>
  )},
  { id: 5, color: 'bg-rose-500/20 text-rose-500', svg: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-2">
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
      <path d="M10 13h4" />
      <path d="M10 16h4" />
    </svg>
  )},
  { id: 6, color: 'bg-cyan-500/20 text-cyan-500', svg: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-2">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 10h8" />
      <path d="M10 14h4" />
      <circle cx="9" cy="9" r="0.5" fill="currentColor" />
      <circle cx="15" cy="9" r="0.5" fill="currentColor" />
    </svg>
  )},
  { id: 7, color: 'bg-violet-500/20 text-violet-500', svg: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-2">
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <path d="M12 5V2" />
      <path d="M12 19v3" />
      <path d="M5 12H2" />
      <path d="M19 12h3" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )},
  { id: 8, color: 'bg-orange-500/20 text-orange-500', svg: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-2">
      <path d="M20 16V8a2 2 0 0 0-2-2h-3V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2H6a2 2 0 0 0-2 2v8a2 2 0 0 0-2 2v2h20v-2a2 2 0 0 0-2-2z" />
      <path d="M9 11v1" />
      <path d="M15 11v1" />
      <path d="M9 15h6" />
    </svg>
  )},
];

export function RobotAvatar({ id, className }: { id: number, className?: string }) {
  const avatar = ROBOT_AVATARS.find(a => a.id === id) || ROBOT_AVATARS[0];
  
  return (
    <div className={cn(
      "rounded-lg flex items-center justify-center overflow-hidden",
      avatar.color,
      className
    )}>
      {avatar.svg}
    </div>
  );
}
