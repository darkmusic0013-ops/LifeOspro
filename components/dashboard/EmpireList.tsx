import type { Empire } from '../../types/lifeos';
import { Card } from '../ui/card';

interface EmpireListProps {
  empires: Empire[];
}

export function EmpireList({ empires }: EmpireListProps) {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-[#37352F]">Mis Imperios</h3>
      <div className="divide-y divide-black/5">
        {empires.map((empire) => (
          <article key={empire.name} className="cursor-pointer py-3 transition hover:bg-[#F7F6F4]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[#37352F]">{empire.icon} {empire.name}</div>
                <p className="mt-1 text-xs text-[#9B9A97]">{empire.description}</p>
              </div>
              <span className="rounded-md bg-[#FAF1DC] px-2 py-1 text-xs font-semibold text-[#C29343]">{empire.progress}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F1F1EF]">
              <div className="h-full rounded-full bg-[#7F77DD] transition-all duration-300" style={{ width: `${empire.progress}%` }} />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
