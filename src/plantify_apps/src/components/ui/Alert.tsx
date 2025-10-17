import React, { ReactNode } from 'react';

import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AlertType;
  title?: string;
  message?: string | ReactNode;
  onDismiss?: () => void;
  className?: string;
  showIcon?: boolean;
}

export default function Alert({
  type = 'info',
  title = '',
  message = '',
  onDismiss,
  className = '',
  showIcon = true,
  ...props
}: AlertProps) {
  const variants: Record<
    AlertType,
    {
      container: string;
      icon: string;
      title: string;
      message: string;
      iconComponent: React.ElementType;
    }
  > = {
    success: {
      container: 'bg-green-50 border-green-200',
      icon: 'text-green-500',
      title: 'text-green-700',
      message: 'text-green-600',
      iconComponent: CheckCircle,
    },
    error: {
      container: 'bg-red-50 border-red-200',
      icon: 'text-red-500',
      title: 'text-red-700',
      message: 'text-red-600',
      iconComponent: AlertCircle,
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-500',
      title: 'text-yellow-700',
      message: 'text-yellow-600',
      iconComponent: AlertCircle,
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-500',
      title: 'text-blue-700',
      message: 'text-blue-600',
      iconComponent: Info,
    },
  };

  const variant = variants[type];
  const IconComponent = variant.iconComponent;

  return (
    <div
      className={`p-4 border rounded-lg ${variant.container} ${className}`}
      {...props}
    >
      <div className='flex items-start gap-3'>
        {showIcon && (
          <IconComponent
            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${variant.icon}`}
          />
        )}
        <div className='flex-1'>
          {title && (
            <div className={`text-sm font-medium mb-1 ${variant.title}`}>
              {title}
            </div>
          )}
          {message && (
            <div className={`text-sm ${variant.message}`}>{message}</div>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className='flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors'
          >
            <X size={16} className='text-gray-500' />
          </button>
        )}
      </div>
    </div>
  );
}
