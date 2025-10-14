import React, {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  ReactNode,
} from 'react';

type ButtonVariants = 'primary' | 'secondary';
type AsType = 'button' | 'a';

interface CommonProps {
  children: ReactNode;
  variant?: ButtonVariants;
  className?: string;
  as?: AsType;
  leftIcon?: ReactNode;
}

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

export default function Button({
  children,
  as = 'button',
  href,
  variant = 'primary',
  className = '',
  leftIcon,
  style,
  ...props
}: ButtonProps) {
  const Comp = as === 'a' ? 'a' : 'button';

  const baseStyle = [
    'flex items-center justify-center gap-2 px-4 py-3',
    'rounded-[12px] text-sm font-medium transition-colors cursor-pointer',
  ];

  const variants: Record<ButtonVariants, string[]> = {
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
      href={as === 'a' ? href : undefined}
      className={[...baseStyle, ...variants[variant], className].join(' ')}
      style={style}
      {...props}
    >
      {leftIcon && <span className='flex-shrink-0'>{leftIcon}</span>}
      {children}
    </Comp>
  );
}
