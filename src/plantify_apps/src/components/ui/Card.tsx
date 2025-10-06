import React, { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  padding?: string;
  background?: string;
  rounded?: string;
  shadow?: string;
  border?: string;
}

export default function Card({
  children,
  className = '',
  padding = 'p-6',
  background = 'bg-white',
  rounded = 'rounded-[16px]',
  shadow = 'shadow-sm',
  border = 'border border-gray-200',
  ...props
}: CardProps) {
  const baseStyle = `
    ${background} ${rounded} ${padding} ${shadow} ${border}
  `;

  return (
    <div className={`${baseStyle} ${className}`} {...props}>
      {children}
    </div>
  );
}
