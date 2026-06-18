import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[var(--gradient-text-from)] to-[var(--gradient-text-to)] text-white hover:scale-105 hover:shadow-[0_0_20px_rgba(219,39,119,0.3)] border border-transparent',
    secondary: 'bg-[var(--card-bg)] text-[var(--text-main)] hover:bg-black/5 border border-[var(--border-color)]',
    outline: 'bg-transparent text-[var(--text-main)] border border-[var(--border-color)] hover:bg-black/5',
    ghost: 'bg-transparent text-[var(--text-main)] hover:bg-black/5',
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-14 px-8 text-lg min-w-[44px]', // Mobile friendly target
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
