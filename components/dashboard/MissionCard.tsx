import type { Task } from '../../types/lifeos';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

interface MissionCardProps {
  task?: Task;
}

export function MissionCard({ task }: MissionCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge tone="purple" className="rounded-full">Misión del día</Badge>
          <h3 className="mt-3 text-[17px] font-semibold text-[#37352F]">{task?.title || 'Define tu misión principal'}</h3>
          <p className="mt-1 text-sm text-[#9B9A97]">{task ? `${task.category} · ${task.due}` : 'Crea una misión para comenzar.'}</p>
        </div>
        <Badge tone="red">{task?.priority || 'Alta'}</Badge>
      </div>
      <div className="mt-5 grid grid-cols-[1fr_auto] gap-2 text-[13px] text-[#9B9A97]">
        <span>Progreso</span>
        <strong className="font-semibold text-[#37352F]">12%</strong>
        <div className="col-span-2 h-1.5 overflow-hidden rounded-full bg-[#F1F1EF]">
          <div className="h-full w-[12%] rounded-full bg-[#7F77DD] transition-all duration-300" />
        </div>
      </div>
    </Card>
  );
}
