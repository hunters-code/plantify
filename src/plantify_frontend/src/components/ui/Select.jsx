import React from 'react';

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
}) {
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
        className={`${baseStyle} ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option key={option.value || index} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {error && (
        <p className='text-red-500 text-sm'>{error}</p>
      )}
    </div>
  );
}
