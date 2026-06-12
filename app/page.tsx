'use client';

import { Dashboard } from '../components/dashboard/Dashboard';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { SidebarNav } from '../components/dashboard/SidebarNav';
import { Card } from '../components/ui/card';
import { useLifeOSStore } from '../store/lifeos.store';

export default function Home() {
  const { activeTab, setActiveTab, profile, tasks, addQuickTask } = useLifeOSStore();
  const activeMissions = tasks.filter((task) => !task.done && task.due === 'Hoy').length;

  return (
    <div className="flex min-h-screen bg-[#FBFBFA] text-[#37352F]">
      <div className="hidden md:block">
        <SidebarNav activeTab={activeTab} profile={profile} onChange={setActiveTab} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader name={profile.name} activeMissions={activeMissions} onNewMission={() => addQuickTask('Nueva tarea rapida')} />
        {activeTab === 'Dashboard' ? (
          <Dashboard />
        ) : (
          <main className="min-w-0 flex-1 px-8 pb-10 max-md:px-4">
            <Card>
              <h2 className="text-xl font-bold text-[#37352F]">{activeTab}</h2>
              <p className="mt-2 text-sm text-[#9B9A97]">Modulo preparado para continuar la Fase 1 sin romper la base.</p>
            </Card>
          </main>
        )}
      </div>
    </div>
  );
}
