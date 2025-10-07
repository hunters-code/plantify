import React from 'react';

type Option = {
  value: string | number;
  label: string;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options?: (Option | string)[];
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
};

export default function Select({
  options = [],
  value = '',
  onChange,
  label = '',
  required = false,
  error = '',
  className = '',
  disabled = false,
  placeholder = 'Select an option',
  ...props
}: SelectProps) {
  const baseStyle = `
    w-full flex items-center gap-2 px-4 py-3 
    rounded-xl border border-gray-200 bg-white 
    shadow-md text-gray-900
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
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${baseStyle} ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        }`}
        {...props}
      >
        {placeholder && (
          <option value='' disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) =>
          typeof option === 'string' ? (
            <option key={index} value={option}>
              {option}
            </option>
          ) : (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )
        )}
      </select>
      {error && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  );
}
