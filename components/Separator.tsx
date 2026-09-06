import React from 'react';

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Separator({ orientation = 'horizontal', className = '' }: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={`${
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'w-[1px] h-4'
      } bg-slate-200 dark:bg-slate-800 ${className}`}
      data-node-id="13:1458"
    />
  );
}

export function SeparatorDemo() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[280px]">
      <div>
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Radix Primitives</h4>
        <p className="text-sm text-slate-500">An open-source UI component library.</p>
      </div>
      <Separator />
      <div className="flex items-center gap-4 text-sm text-slate-900 dark:text-slate-100">
        <a href="#blog" className="hover:underline">Blog</a>
        <Separator orientation="vertical" />
        <a href="#docs" className="hover:underline">Docs</a>
        <Separator orientation="vertical" />
        <a href="#source" className="hover:underline">Source</a>
      </div>
    </div>
  );
}
