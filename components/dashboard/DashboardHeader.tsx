'use client';

import { Plus, Search } from 'lucide-react';
import { Button } from '../ui/button';

interface DashboardHeaderProps {
  name: string;
  activeMissions: number;
  onNewMission: () => void;
}

export function DashboardHeader({ name, activeMissions, onNewMission }: DashboardHeaderProps) {
  const firstName = name.split(' ')[0] || 'Ramon';

  return (
    <header className="sticky top-0 z-20 grid grid-cols-[minmax(260px,1fr)_240px_40px_auto] items-center gap-3 border-b border-black/[0.04] bg-[#FBFBFA]/90 px-8 py-7 backdrop-blur-xl max-md:relative max-md:grid-cols-1 max-md:px-4 max-md:py-4">
      <div>
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-[#37352F]">Buenos días, {firstName}</h1>
        <p className="mt-1 text-[13px] text-[#9B9A97]">Jueves 11 junio · {activeMissions} misión activa · ahorro del día activo</p>
      </div>
      <div className="flex h-9 w-[240px] items-center gap-2 rounded-lg border border-black/5 bg-white px-3 text-[13px] text-[#9B9A97] max-md:w-full">
        <Search className="h-4 w-4" />
        Buscar en LifeOS...
      </div>
      <Button variant="secondary" className="h-9 w-10 px-0 max-md:hidden" onClick={onNewMission}>
        <Plus className="h-4 w-4" />
      </Button>
      <Button variant="primary" className="h-9" onClick={onNewMission}>Nueva misión</Button>
    </header>
  );
}
