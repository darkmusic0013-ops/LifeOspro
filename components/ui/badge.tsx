import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  tone?: 'purple' | 'red' | 'green' | 'amber' | 'neutral';
}

const tones = {
  purple: 'bg-[#EEEDFE] text-[#534AB7]',
  red: 'bg-[#FBE4E4] text-[#C4554D]',
  green: 'bg-[#DDEDEA] text-[#4D8870]',
  amber: 'bg-[#FAF1DC] text-[#C29343]',
  neutral: 'bg-[#EFEEEC] text-[#37352F]'
};

export function Badge({ children, className, tone = 'neutral' }: BadgeProps) {
  return <span className={cn('inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold', tones[tone], className)}>{children}</span>;
}
