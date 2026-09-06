import React, { useState } from 'react';

export interface SwitchProps {
  label?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function Switch({
  label = 'Airplane mode',
  defaultChecked = false,
  onChange,
  className = '',
}: SwitchProps) {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const toggle = () => {
    const next = !isChecked;
    setIsChecked(next);
    onChange?.(next);
  };

  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer select-none ${className}`} data-node-id="13:1482">
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={toggle}
        className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 ${
          isChecked ? 'bg-slate-900' : 'bg-slate-300 dark:bg-slate-700'
        }`}
      >
        <span
          className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform ${
            isChecked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      {label && <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{label}</span>}
    </label>
  );
}
