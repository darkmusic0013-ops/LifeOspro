import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
  tone: 'purple' | 'blue' | 'amber' | 'green';
}

const toneStyles = {
  purple: 'bg-[#7F77DD]/15 text-[#7F77DD]',
  blue: 'bg-[#378ADD]/15 text-[#378ADD]',
  amber: 'bg-[#EF9F27]/15 text-[#EF9F27]',
  green: 'bg-[#639922]/15 text-[#639922]'
};

export function StatCard({ label, value, helper, icon: Icon, tone }: StatCardProps) {
  return (
    <section className="min-h-[90px] cursor-pointer rounded-[10px] border border-black/5 bg-white p-5 transition hover:bg-[#F7F6F4] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[1px] text-[#9B9A97]">
        <span className={cn('flex h-7 w-7 items-center justify-center rounded-full', toneStyles[tone])}>
          <Icon className="h-4 w-4" />
        </span>
        {label}
      </div>
      <strong className="mt-3 block text-[30px] font-bold leading-none tracking-[-0.02em] text-[#37352F]">{value}</strong>
      <span className="mt-1.5 block text-[13px] text-[#9B9A97]">{helper}</span>
    </section>
  );
}
