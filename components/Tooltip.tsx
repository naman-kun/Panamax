import React, { useState } from 'react';

export interface TooltipProps {
  content?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Tooltip({
  content = 'Add to library',
  children,
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      data-node-id="13:1551"
    >
      {children || (
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Add to library
        </button>
      )}

      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded shadow-md whitespace-nowrap z-50 animate-in fade-in duration-150">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
}
