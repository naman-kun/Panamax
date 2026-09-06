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
      className={`bg-white border border-[#e5e7eb] rounded-[6px] p-[17px] flex gap-[16px] items-start shadow-[0px_4px_12px_rgba(174,174,174,0.25)] w-[320px] text-left ${className}`}
      data-node-id="4:462"
      data-name="hover card"
    >
      <div className="relative shrink-0 size-[40px] rounded-full overflow-hidden bg-black flex items-center justify-center" data-node-id="4:444">
        {avatarUrl ? (
          <img alt={handle} className="size-full object-cover" src={avatarUrl} />
        ) : (
          <svg className="size-full" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#000000" />
            <path d="M26.4 28.5L16.2 15.3H14V24.7H16.1V17.8L25.3 29.8C25.7 29.4 26.1 29 26.4 28.5Z" fill="url(#next_grad_react_1)" />
            <rect x="23.9" y="15.3" width="2.1" height="9.4" fill="url(#next_grad_react_2)" />
            <defs>
              <linearGradient id="next_grad_react_1" x1="20.8" y1="21.3" x2="26.7" y2="28.9" gradientUnits="userSpaceOnUse">
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="next_grad_react_2" x1="24.9" y1="15.3" x2="24.9" y2="22.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>
      <div className="flex flex-col gap-[4px] items-start relative shrink-0 flex-1" data-node-id="4:448">
        <span className="font-semibold leading-[20px] text-[#0f172a] text-[14px]" data-node-id="4:445">
          {handle}
        </span>
        <p className="font-normal leading-[20px] text-[#0f172a] text-[14px] break-words" data-node-id="4:446">
          {bio}
        </p>
        <div className="flex gap-[4px] items-center relative shrink-0 mt-[4px]" data-node-id="4:460">
          <svg
            className="size-[16px] text-[#64748b]"
            data-node-id="4:449"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="font-normal leading-[16px] text-[#64748b] text-[12px]" data-node-id="4:447">
            {joinedDate}
          </span>
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
      <span className="cursor-pointer underline underline-offset-4 decoration-slate-400 font-semibold text-slate-900 hover:text-sky-600 transition-colors">
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

export default function HoverCardPage() {
  return (
    <div className="bg-white flex flex-col gap-[64px] items-center pb-[64px] pt-[32px] px-[32px] w-full max-w-[820px] mx-auto rounded-xl border border-slate-200" data-node-id="13:1246" data-name="Hover Card">
      <div className="flex flex-col gap-[32px] items-center w-full" data-node-id="13:1247">
        <div className="flex justify-between items-start w-full" data-node-id="13:1248">
          <div className="flex flex-col gap-[16px] items-start" data-node-id="13:1249">
            <h1 className="font-semibold leading-[36px] text-[#0f172a] text-[30px] tracking-[-0.225px]" data-node-id="13:1250">
              Hover Card
            </h1>
            <p className="font-normal leading-[28px] text-[#475569] text-[20px] max-w-[584px]" data-node-id="13:1251">
              For sighted users to preview content available behind a link.
            </p>
          </div>
          <div className="shrink-0" data-node-id="13:1252">
            <a
              className="bg-[#0f172a] hover:bg-slate-800 text-white text-[14px] font-medium px-[16px] py-[8px] rounded-[6px] inline-flex items-center justify-center transition-colors"
              href="https://ui.shadcn.com/docs/primitives/hover-card"
              target="_blank"
              rel="noopener noreferrer"
              data-node-id="13:1253"
              data-name="button"
            >
              <span className="underline decoration-solid">View docs</span>
            </a>
          </div>
        </div>
        <div className="h-[1px] w-full bg-[#e2e8f0]" data-node-id="13:1254" />
      </div>

      <div className="flex flex-col items-center gap-6 w-full">
        <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-lg w-full flex justify-center items-center">
          <p className="text-slate-700 text-[15px]">
            Hover over <HoverCard>@nextjs</HoverCard> to preview details.
          </p>
        </div>

        <HoverCardContent />
      </div>
    </div>
  );
}
