import React from 'react';
import { cn } from '../../lib/utils';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  animate?: boolean;
}

export function Card({ className, children, delay = 0, animate = true, ...props }: CardProps) {
  const { targetRef, isIntersecting } = useIntersectionObserver();

  return (
    <div
      ref={targetRef}
      className={cn(
        'glass-card p-6 md:p-8 relative overflow-hidden group',
        animate && !isIntersecting ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0 transition-all duration-700 ease-out',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[--accent-from] to-[--accent-to] opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-xl pointer-events-none" />
      {children}
    </div>
  );
}
