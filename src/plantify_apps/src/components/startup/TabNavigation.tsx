'use client';

import { useMemo } from 'react';

import { cn } from '../../lib/utils';

export interface Tab {
  id: number;
  label: string;
  disabled?: boolean;
}

export interface TabNavigationProps {
  tabs: Tab[];
  currentStep: number;
  onStepChange: (step: number) => void;
  className?: string;
  'aria-label'?: string;
}

const getTabState = (currentStep: number, tabId: number) => {
  if (currentStep === tabId) return 'active';
  if (currentStep > tabId) return 'completed';
  return 'pending';
};

const getTabStyles = (
  state: 'active' | 'completed' | 'pending',
  disabled?: boolean
) => {
  const baseStyles =
    'box-border content-stretch flex gap-[6px] items-center justify-center pl-[12px] pr-[16px] py-[8px] relative rounded-[12px] shrink-0';

  if (disabled) {
    return cn(baseStyles, 'opacity-50 cursor-not-allowed');
  }

  switch (state) {
    case 'active':
      return cn(
        baseStyles,
        'bg-neutral-100 border border-neutral-200 border-solid cursor-pointer'
      );
    case 'completed':
      return cn(baseStyles, 'hover:bg-neutral-50 cursor-pointer');
    case 'pending':
      return cn(baseStyles, 'hover:bg-neutral-50 cursor-pointer');
    default:
      return cn(baseStyles, 'cursor-pointer');
  }
};

const getTextStyles = (
  state: 'active' | 'completed' | 'pending',
  disabled?: boolean
) => {
  if (disabled) {
    return 'text-neutral-400';
  }

  switch (state) {
    case 'active':
      return 'text-neutral-950';
    case 'completed':
      return 'text-neutral-500';
    case 'pending':
      return 'text-neutral-500';
    default:
      return 'text-neutral-500';
  }
};

export default function TabNavigation({
  tabs,
  currentStep,
  onStepChange,
  className,
}: TabNavigationProps) {
  const tabStates = useMemo(
    () =>
      tabs.map(tab => ({
        ...tab,
        state: getTabState(currentStep, tab.id),
      })),
    [tabs, currentStep]
  );

  const handleTabClick = (tabId: number, disabled?: boolean) => {
    if (!disabled) {
      onStepChange(tabId);
    }
  };

  return (
    <div
      className={cn(
        'content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full',
        className
      )}
    >
      <div className='bg-white border border-neutral-200 border-solid relative rounded-[16px] shrink-0 w-full'>
        <div className='flex gap-1 p-0.5 justify-between overflow-clip relative rounded-[inherit] w-full'>
          {tabStates.map(tab => {
            return (
              <button
                key={tab.id}
                type='button'
                role='tab'
                aria-selected={currentStep === tab.id}
                aria-disabled={tab.disabled}
                aria-label={`Step ${tab.id}: ${tab.label}`}
                className={getTabStyles(
                  tab.state as 'active' | 'completed' | 'pending',
                  tab.disabled
                )}
                onClick={() => handleTabClick(tab.id, tab.disabled)}
                disabled={tab.disabled}
              >
                <div className='flex items-center justify-center gap-2'>
                  <span
                    className={cn(
                      'font-medium text-[16px]',
                      getTextStyles(
                        tab.state as 'active' | 'completed' | 'pending',
                        tab.disabled
                      )
                    )}
                  >
                    {tab.id}.
                  </span>
                  <span
                    className={cn(
                      'font-medium text-[16px] leading-[1.4]',
                      getTextStyles(
                        tab.state as 'active' | 'completed' | 'pending',
                        tab.disabled
                      )
                    )}
                  >
                    {tab.label}
                  </span>
                </div>
                {tab.state === 'active' && (
                  <div className='absolute inset-0 pointer-events-none shadow-2xl rounded-2xl' />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
