import React, { useState, useRef, useEffect } from 'react';

export interface HoverCardProps {
  handle?: string;
  bio?: string;
  joinedDate?: string;
  avatarUrl?: string;
  className?: string;
}

export function HoverCardContent({
  handle = '@nextjs',
  bio = 'The React Framework - created and maintained by @vercel',
  joinedDate = 'Joined December 2021',
  avatarUrl,
  className = '',
}: HoverCardProps) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-4 flex gap-4 items-start shadow-lg w-80 text-left ${className}`}
      data-node-id="4:462"
      data-name="hover card"
    >
      <div className="relative shrink-0 size-10 rounded-full overflow-hidden bg-black flex items-center justify-center">
        {avatarUrl ? (
          <img alt={handle} className="size-full object-cover" src={avatarUrl} />
        ) : (
          <svg className="size-full" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#000000" />
            <path d="M26.4 28.5L16.2 15.3H14V24.7H16.1V17.8L25.3 29.8C25.7 29.4 26.1 29 26.4 28.5Z" fill="white" />
            <rect x="23.9" y="15.3" width="2.1" height="9.4" fill="white" />
          </svg>
        )}
      </div>
      <div className="flex flex-col gap-1 items-start relative shrink-0 flex-1">
        <span className="font-semibold leading-5 text-slate-900 dark:text-white text-sm">
          {handle}
        </span>
        <p className="font-normal leading-5 text-slate-700 dark:text-slate-300 text-sm break-words">
          {bio}
        </p>
        <div className="flex gap-1.5 items-center relative shrink-0 mt-1 text-slate-500 text-xs">
          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{joinedDate}</span>
        </div>
      </div>
    </div>
  );
}

export interface HoverCardRootProps {
  children: React.ReactNode;
  contentProps?: HoverCardProps;
  openDelay?: number;
  closeDelay?: number;
}

export function HoverCard({
  children,
  contentProps,
  openDelay = 250,
  closeDelay = 200,
}: HoverCardRootProps) {
  const [isOpen, setIsOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(() => setIsOpen(true), openDelay);
  };

  const handleMouseLeave = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setIsOpen(false), closeDelay);
  };

  useEffect(() => {
    return () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <span className="cursor-pointer underline underline-offset-4 decoration-slate-400 font-semibold text-slate-900 dark:text-white hover:text-sky-600 transition-colors">
        {children}
      </span>
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <HoverCardContent {...contentProps} />
        </div>
      )}
    </div>
  );
}
