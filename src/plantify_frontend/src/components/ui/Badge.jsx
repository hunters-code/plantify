import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  icon,
  ...props
}) {
  const baseStyle = 'inline-flex items-center gap-2 font-medium rounded-lg';
  
  const variants = {
    default: 'bg-gray-100 text-gray-700 border border-gray-200',
    primary: 'bg-purple-100 text-purple-700 border border-purple-700',
    success: 'bg-green-100 text-green-700 border border-green-700',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-700',
    danger: 'bg-red-100 text-red-700 border border-red-700',
    info: 'bg-blue-100 text-blue-700 border border-blue-700',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
