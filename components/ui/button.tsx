import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

const styles = {
  primary: 'border border-[#111111] bg-[#111111] text-white hover:bg-[#2f2f2f]',
  secondary: 'border border-black/10 bg-white text-[#37352F] hover:bg-[#EFEEEC]',
  ghost: 'border border-transparent bg-transparent text-[#37352F] hover:bg-[#EFEEEC]'
};

export function Button({ children, className, variant = 'secondary', ...props }: ButtonProps) {
  return <button className={cn('inline-flex min-h-9 items-center justify-center rounded-lg px-3 text-sm font-semibold transition', styles[variant], className)} {...props}>{children}</button>;
}
