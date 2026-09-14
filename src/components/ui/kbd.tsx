import * as React from 'react';
import { cn } from '@/lib/utils';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {}

export function Kbd({ className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        'pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-zinc-900 px-1.5 font-mono text-[10px] font-medium text-zinc-300 shadow-sm',
        className
      )}
      {...props}
    />
  );
}
