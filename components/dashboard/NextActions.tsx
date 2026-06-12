'use client';

import type { Task } from '../../types/lifeos';
import { Card } from '../ui/card';

interface NextActionsProps {
  tasks: Task[];
  onNewTask: () => void;
}

export function NextActions({ tasks, onNewTask }: NextActionsProps) {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-[#37352F]">Qué hacer ahora</h3>
      <div className="grid gap-2">
        {tasks.slice(0, 3).map((task) => (
          <div key={task.id} className="flex min-h-9 items-center gap-2.5 rounded-lg border border-black/5 bg-white px-3 text-sm font-semibold text-[#37352F]">
            <span className="h-4 w-4 rounded-full border border-black/20" />
            {task.title}
          </div>
        ))}
        <button onClick={onNewTask} className="min-h-9 rounded-lg border border-black/10 bg-white px-3 text-left text-sm font-semibold text-[#9B9A97] hover:bg-[#F7F6F4]">
          Agregar próxima tarea
        </button>
      </div>
    </Card>
  );
}
