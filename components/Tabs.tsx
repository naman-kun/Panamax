import React, { useState } from 'react';

export interface TabsProps {
  defaultTab?: 'account' | 'password';
  className?: string;
}

export function TabsComponent({ defaultTab = 'account', className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'password'>(defaultTab);

  return (
    <div className={`flex flex-col gap-4 w-full max-w-[400px] ${className}`} data-node-id="13:1492">
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-md gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('account')}
          className={`flex-1 py-1.5 px-4 text-sm rounded transition-all ${
            activeTab === 'account'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium'
          }`}
        >
          Account
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('password')}
          className={`flex-1 py-1.5 px-4 text-sm rounded transition-all ${
            activeTab === 'password'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium'
          }`}
        >
          Password
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-6 flex flex-col gap-4 shadow-sm">
        {activeTab === 'account' ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-500 leading-5">
              Make changes to your account here. Click save when you're done.
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-900 dark:text-white">Name</label>
              <input
                defaultValue="Pietro Schirano"
                className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-900 dark:text-white">Username</label>
              <input
                defaultValue="@skirano"
                className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <button
              type="button"
              className="self-start px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-md transition-colors"
            >
              Save changes
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-500 leading-5">
              Change your password here. After saving, you'll be logged out.
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-900 dark:text-white">Current password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-900 dark:text-white">New password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <button
              type="button"
              className="self-start px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-md transition-colors"
            >
              Save password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
