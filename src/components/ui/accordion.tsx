import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionContextType {
  value: string | string[];
  onValueChange: (val: string) => void;
  type?: 'single' | 'multiple';
}

const AccordionContext = React.createContext<AccordionContextType | null>(null);

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (val: string) => void;
}

export function Accordion({
  type = 'single',
  defaultValue,
  value: controlledValue,
  onValueChange: controlledChange,
  className,
  children,
  ...props
}: AccordionProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | string[]>(
    defaultValue || (type === 'multiple' ? [] : '')
  );

  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;

  const handleValueChange = (itemValue: string) => {
    let nextValue: string | string[];
    if (type === 'single') {
      nextValue = value === itemValue ? '' : itemValue;
    } else {
      const arr = Array.isArray(value) ? value : [];
      nextValue = arr.includes(itemValue)
        ? arr.filter((v) => v !== itemValue)
        : [...arr, itemValue];
    }
    if (controlledChange) {
      controlledChange(itemValue);
    } else {
      setUncontrolledValue(nextValue);
    }
  };

  return (
    <AccordionContext.Provider value={{ value, onValueChange: handleValueChange, type }}>
      <div className={cn('divide-y divide-white/10', className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItemContext = React.createContext<{ value: string; isOpen: boolean }>({
  value: '',
  isOpen: false,
});

export function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  const ctx = React.useContext(AccordionContext);
  const isOpen = Array.isArray(ctx?.value)
    ? ctx.value.includes(value)
    : ctx?.value === value;

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div
        data-state={isOpen ? 'open' : 'closed'}
        className={cn('border-b border-white/10 last:border-b-0 py-1', className)}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(AccordionContext);
  const itemCtx = React.useContext(AccordionItemContext);

  return (
    <button
      type="button"
      onClick={() => ctx?.onValueChange(itemCtx.value)}
      data-state={itemCtx.isOpen ? 'open' : 'closed'}
      className={cn(
        'flex w-full items-center justify-between py-4 text-sm font-medium text-white transition-all hover:text-zinc-200 text-left outline-none group',
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          'h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 group-hover:text-white',
          itemCtx.isOpen && 'rotate-180'
        )}
      />
    </button>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const itemCtx = React.useContext(AccordionItemContext);

  if (!itemCtx.isOpen) return null;

  return (
    <div
      data-state={itemCtx.isOpen ? 'open' : 'closed'}
      className={cn(
        'pb-4 pt-0 text-sm text-zinc-400 leading-relaxed transition-all animate-in fade-in-50 duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
