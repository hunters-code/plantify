import React, { InputHTMLAttributes } from 'react';

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export default function Input({
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  label = '',
  required = false,
  error = '',
  className = '',
  disabled = false,
  icon,
  ...props
}: InputProps) {
  const baseStyle = `
    w-full flex items-center gap-2 px-4 py-3 
    rounded-xl border border-gray-200 bg-white 
    shadow-md text-gray-900 placeholder-gray-400
    focus:ring-2 focus:ring-[#7A5AF8] focus:border-transparent 
    transition-all duration-200 text-[16px]
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className='block text-sm font-medium text-gray-700'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}
      <div className='relative'>
        {icon && (
          <div className='absolute left-4 top-1/2 -translate-y-1/2'>{icon}</div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${baseStyle} ${icon ? 'pl-12' : ''} ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          {...props}
        />
      </div>
      {error && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  );
}
