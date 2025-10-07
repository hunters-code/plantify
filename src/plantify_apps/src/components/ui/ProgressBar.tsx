import React from 'react';

type ProgressBarProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: string;
  className?: string;
  size?: string;
};

export default function ProgressBar({
  value = 0,
  max = 100,
  label = '',
  showValue = true,
  color = 'bg-purple-600',
  className = '',
  size = 'h-2',
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`} {...props}>
      {label && (
        <div className='flex justify-between items-center mb-1'>
          <span className='text-sm text-gray-500'>{label}</span>
          {showValue && (
            <span className='text-sm text-gray-600'>
              {value} / {max}
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${size}`}>
        <div
          className={`${color} ${size} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
