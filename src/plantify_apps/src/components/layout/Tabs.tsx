'use client';

import { useState, ReactNode, useEffect } from 'react';

interface Tab {
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  onChange: (index: number) => void;
  activeTab?: number;
}

export default function Tabs({ tabs, onChange, activeTab }: TabsProps) {
  const [active, setActive] = useState<number>(activeTab ?? 0);

  useEffect(() => {
    if (activeTab !== undefined) setActive(activeTab);
  }, [activeTab]);

  const handleClick = (index: number) => {
    setActive(index);
    onChange(index);
  };

  return (
    <div className='flex gap-2 mb-6 border border-neutral-200 rounded-full'>
      {tabs.map((tab, i) => (
        <button
          key={i}
          onClick={() => handleClick(i)}
          className={`flex items-center justify-center gap-[6px] px-4 py-2 text-sm font-medium transition rounded-[12px] ${
            active === i
              ? 'border border-gray-200 bg-gray-100 shadow-[0_3px_3px_rgba(255,255,255,0.40)_inset,0_-2px_1px_rgba(0,0,0,0.25)_inset,0_2px_4px_rgba(0,0,0,0.16)] text-gray-900'
              : 'text-gray-600 hover:bg-white'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
