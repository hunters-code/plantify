import React from 'react';

type StatsCardProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  loading?: boolean;
  error?: string | null;
};

export default function StatsCard({
  label,
  value,
  subtitle,
  icon,
  className = '',
  loading = false,
  error = null,
  ...props
}: StatsCardProps) {
  if (loading) {
    return (
      <div
        className={`bg-neutral-100 p-4 rounded-lg animate-pulse ${className}`}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          </div>
          {icon && <div className="ml-2 text-gray-400">{icon}</div>}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-red-50 p-4 rounded-lg border border-red-200 ${className}`}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-red-600 text-sm mb-1">{label}</p>
            <p className="text-red-500 text-sm">Error loading data</p>
          </div>
          {icon && <div className="ml-2 text-red-400">{icon}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-neutral-100 p-4 rounded-lg ${className}`} {...props}>
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
        {icon && <div className="ml-2 text-gray-400">{icon}</div>}
      </div>
    </div>
  );
}
