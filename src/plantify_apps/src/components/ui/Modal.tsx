'use client';

import { X } from 'lucide-react';
import React, { useEffect } from 'react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: ModalSize;
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen = false,
  onClose,
  title = '',
  children,
  className = '',
  size = 'md',
  showCloseButton = true,
  ...props
}: ModalProps) {
  const sizes: Record<ModalSize, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
        onClick={onClose}
      />
      {/* Modal Content */}
      <div
        className={`relative bg-white rounded-2xl shadow-xl w-full ${sizes[size]} ${className}`}
        {...props}
      >
        {(title || showCloseButton) && (
          <div className='flex items-center justify-between p-6 border-b border-gray-200'>
            {title && (
              <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <X size={20} className='text-gray-500' />
              </button>
            )}
          </div>
        )}
        <div className='p-6'>{children}</div>
      </div>
    </div>
  );
}
