import React, { useState, useRef, useEffect } from 'react';

export interface PopoverProps {
  trigger?: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function Popover({
  trigger,
  title = 'Dimensions',
  subtitle = 'Set the dimensions for the layer.',
  className = '',
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`} data-node-id="13:1296">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || (
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            Update dimensions
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-lg z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="mb-3">
            <h4 className="text-base font-semibold text-slate-900 dark:text-white leading-none">{title}</h4>
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-slate-900 dark:text-white w-24">Width</label>
              <input defaultValue="100%" className="flex-1 px-3 py-1.5 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-slate-900 dark:text-white w-24">Max. width</label>
              <input defaultValue="300px" className="flex-1 px-3 py-1.5 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-slate-900 dark:text-white w-24">Height</label>
              <input defaultValue="25px" className="flex-1 px-3 py-1.5 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-slate-900 dark:text-white w-24">Max. height</label>
              <input defaultValue="none" className="flex-1 px-3 py-1.5 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
