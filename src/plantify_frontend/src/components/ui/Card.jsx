import React from 'react';

export default function Card({
  children,
  className = '',
  padding = 'p-6',
  background = 'bg-white',
  rounded = 'rounded-[16px]',
  shadow = 'shadow-sm',
  border = 'border border-gray-200',
  ...props
}) {
  const baseStyle = `
    ${background} ${rounded} ${padding} ${shadow} ${border}
  `;

  return (
    <div className={`${baseStyle} ${className}`} {...props}>
      {children}
    </div>
  );
}
