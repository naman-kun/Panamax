import * as React from 'react';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { cn } from '@/lib/utils';

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = 'center', sideOffset = 10, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      'z-50 w-80 rounded-xl border border-white/10 bg-zinc-950/95 p-4 text-zinc-200 shadow-2xl backdrop-blur-xl outline-none origin-[var(--radix-hover-card-content-transform-origin)]',
      'data-[state=open]:animate-hover-card-in data-[state=closed]:animate-hover-card-out',
      className
    )}
    {...props}
  />
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };
