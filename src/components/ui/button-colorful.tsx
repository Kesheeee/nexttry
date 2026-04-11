'use client';

import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function ButtonColorful({
  className,
  label = 'Get Started',
  ...props
}: ButtonColorfulProps) {
  return (
    <button
      type="button"
      className={cn(
        'relative h-10 px-5 overflow-hidden rounded-full',
        'bg-background',
        'transition-all duration-200',
        'group inline-flex items-center',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:opacity-50 disabled:pointer-events-none',
        'active:scale-[0.97]',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'absolute inset-0',
          'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
          'opacity-40 group-hover:opacity-80',
          'blur transition-opacity duration-500'
        )}
      />
      <div className="relative flex items-center justify-center gap-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-foreground/80" />
      </div>
    </button>
  );
}
