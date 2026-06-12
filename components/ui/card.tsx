import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return <section className={cn('rounded-[10px] border border-black/5 bg-white p-6 transition hover:bg-[#F7F6F4] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)]', className)}>{children}</section>;
}
