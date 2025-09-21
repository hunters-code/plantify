import React from 'react';

export default function StatsCard({
  label,
  value,
  subtitle,
  icon,
  className = '',
  ...props
}) {
  return (
    <div
      className={`bg-neutral-100 p-4 rounded-lg ${className}`}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm mb-1">{label}</p>
          <p className="text-lg font-semibold">
            {value}{' '}
            {subtitle && (
              <span className="text-gray-500 font-normal">{subtitle}</span>
            )}
          </p>
        </div>
        {icon && (
          <div className="ml-2 text-gray-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
