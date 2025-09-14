import React from 'react';

export default function Button({
  children,
  as = 'button',
  href,
  variant = 'primary',
  className = '',
  ...props
}) {
  const Comp = as === 'a' ? 'a' : 'button';

  const baseStyle = [
    'flex items-center justify-center gap-1.5 px-4 py-3',
    'rounded-[12px] text-sm font-medium transition-colors',
  ];

  const variants = {
    primary: [
      'border border-white/20 text-white',
      'bg-[#7A5AF8]',
      'shadow-[inset_0_3px_3px_rgba(255,255,255,0.4),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)]',
      'hover:bg-[#6b46f8]',
    ],
    secondary: [
      'border border-[#E5E5E5] text-gray-800',
      'bg-[#F5F5F5]',
      'shadow-[inset_0_3px_3px_rgba(255,255,255,0.4),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)]',
      'hover:bg-gray-200',
    ],
  };

  return (
    <Comp
      href={href}
      className={[...baseStyle, ...variants[variant], className].join(' ')}
      {...props}
    >
      {children}
    </Comp>
  );
}
