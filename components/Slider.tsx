import React, { useState } from 'react';

export interface SliderProps {
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (val: number) => void;
  className?: string;
}

export function Slider({
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  className = '',
}: SliderProps) {
  const [val, setVal] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    setVal(next);
    onChange?.(next);
  };

  const percentage = ((val - min) / (max - min)) * 100;

  return (
    <div className={`relative w-full max-w-[414px] flex items-center ${className}`} data-node-id="13:1472">
      <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-slate-900 dark:bg-slate-100 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Slider input"
      />
      <div
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-slate-900 rounded-full shadow-sm"
        style={{ left: `${percentage}%` }}
      />
    </div>
  );
}
