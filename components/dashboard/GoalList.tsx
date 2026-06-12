import type { Goal } from '../../types/lifeos';
import { Card } from '../ui/card';

interface GoalListProps {
  goals: Goal[];
}

const progress = (current: number, target: number) => target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

const badgeTone = (value: number) => {
  if (value <= 30) return 'bg-[#FBE4E4] text-[#C4554D]';
  if (value <= 70) return 'bg-[#FAF1DC] text-[#C29343]';
  return 'bg-[#DDEDEA] text-[#4D8870]';
};

export function GoalList({ goals }: GoalListProps) {
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-[#37352F]">Metas medibles</h3>
      <div className="divide-y divide-black/5">
        {goals.map((goal) => {
          const value = progress(goal.current, goal.target);
          return (
            <article key={goal.id} className="cursor-pointer py-3.5 transition hover:bg-[#F7F6F4]">
              <div className="flex items-center justify-between gap-3">
                <strong className="text-sm font-medium text-[#37352F]">{goal.name}</strong>
                <span className={`rounded-md px-2 py-1 text-xs font-semibold ${badgeTone(value)}`}>{value}%</span>
              </div>
              <p className="mt-1 text-xs text-[#9B9A97]">{goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F1F1EF]">
                <div className="h-full rounded-full bg-[#7F77DD] transition-all duration-300" style={{ width: `${value}%` }} />
              </div>
            </article>
          );
        })}
      </div>
    </Card>
  );
}
