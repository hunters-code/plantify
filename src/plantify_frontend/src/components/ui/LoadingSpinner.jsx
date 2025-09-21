import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({
  size = 'md',
  text = '',
  className = '',
  ...props
}) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`} {...props}>
      <Loader2 size={sizes[size].split(' ')[0].replace('w-', '')} className={`text-purple-600 animate-spin ${sizes[size]}`} />
      {text && (
        <p className='text-gray-600 text-sm'>{text}</p>
      )}
    </div>
  );
}
