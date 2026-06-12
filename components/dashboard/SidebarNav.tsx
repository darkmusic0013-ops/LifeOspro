'use client';

import { BarChart3, Brain, CalendarDays, CircleDollarSign, ClipboardCheck, Home, Lightbulb, Target, Utensils, UserRound } from 'lucide-react';
import type { LifeOSTab, Profile } from '../../types/lifeos';
import { cn } from '../../lib/utils';

const navItems: Array<{ label: LifeOSTab; icon: typeof Home }> = [
  { label: 'Dashboard', icon: Home },
  { label: 'Misiones', icon: ClipboardCheck },
  { label: 'Metas', icon: Target },
  { label: 'Imperios', icon: BarChart3 },
  { label: 'Planner', icon: CalendarDays },
  { label: 'Ideas', icon: Lightbulb },
  { label: 'Finanzas', icon: CircleDollarSign },
  { label: 'Comidas', icon: Utensils },
  { label: 'Life AI', icon: Brain }
];

interface SidebarNavProps {
  activeTab: LifeOSTab;
  profile: Profile;
  onChange: (tab: LifeOSTab) => void;
}

export function SidebarNav({ activeTab, profile, onChange }: SidebarNavProps) {
  return (
    <aside className="sticky top-0 flex h-screen w-[220px] shrink-0 flex-col border-r border-black/5 bg-[#FBFBFA]">
      <div className="px-5 py-4 text-base font-bold text-[#37352F]">LifeOS Pro</div>
      <nav className="flex flex-1 flex-col gap-0.5">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = activeTab === item.label;
          return (
            <button
              key={item.label}
              onClick={() => onChange(item.label)}
              className={cn(
                'mx-2 flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium text-[#5F5E5B] transition hover:bg-[#EFEEEC]',
                active && 'bg-[#EFEEEC] font-semibold text-[#37352F]',
                (index === 3 || index === 7) && 'mb-3'
              )}
            >
              <Icon className={cn('h-4 w-4 text-[#9B9A97]', active && 'text-[#37352F]')} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <button onClick={() => onChange('Perfil')} className={cn('mx-2 mb-3 flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-[#EFEEEC]', activeTab === 'Perfil' && 'bg-[#EFEEEC] font-semibold')}>
        <UserRound className="h-4 w-4 text-[#9B9A97]" />
        {profile.name}
      </button>
    </aside>
  );
}
