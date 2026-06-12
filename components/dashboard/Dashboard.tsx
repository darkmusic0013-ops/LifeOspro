'use client';

import { Flame, ListTodo, Target, TrendingUp } from 'lucide-react';
import { empires, useLifeOSStore } from '../../store/lifeos.store';
import { EmpireList } from './EmpireList';
import { FinanceWidget } from './FinanceWidget';
import { GoalList } from './GoalList';
import { LifeAIWidget } from './LifeAIWidget';
import { MissionCard } from './MissionCard';
import { NextActions } from './NextActions';
import { StatCard } from './StatCard';

const priorityRank = { Alta: 0, Media: 1, Baja: 2 } as const;

export function Dashboard() {
  const { tasks, goals, finance, toggleTask, addQuickTask } = useLifeOSStore();
  const pendingTasks = tasks.filter((task) => !task.done);
  const completedTasks = tasks.filter((task) => task.done);
  const todayTasks = tasks.filter((task) => !task.done && task.due === 'Hoy');
  const topTasks = [...pendingTasks].sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
  const weeklyProgress = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <main className="lifeos-scrollbar min-w-0 flex-1 overflow-x-hidden px-8 pb-10 max-md:px-4 max-md:pb-24">
      <div className="grid w-full gap-5">
        <section className="grid grid-cols-4 gap-5 max-xl:grid-cols-2 max-sm:grid-cols-1">
          <StatCard label="Misiones" value={todayTasks.length} helper="activas hoy" icon={ListTodo} tone="purple" />
          <StatCard label="Progreso" value={`${weeklyProgress}%`} helper="completado" icon={TrendingUp} tone="blue" />
          <StatCard label="Racha" value={Math.max(1, completedTasks.length + 1)} helper="días seguidos" icon={Flame} tone="amber" />
          <StatCard label="Metas" value={goals.length} helper="activas" icon={Target} tone="green" />
        </section>

        <section className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
          <MissionCard task={topTasks[0]} />
          <NextActions tasks={topTasks} onNewTask={() => addQuickTask('Nueva misión rápida')} />
        </section>

        <section className="grid grid-cols-[1.2fr_1fr] gap-5 max-lg:grid-cols-1">
          <FinanceWidget finance={finance} />
          <LifeAIWidget />
        </section>

        <section className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
          <GoalList goals={goals} />
          <EmpireList empires={empires} />
        </section>
      </div>
    </main>
  );
}
