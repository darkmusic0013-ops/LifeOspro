'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import { listExpenses } from '../lib/supabase/expenses';
import { listGoals } from '../lib/supabase/goals';
import { listIdeas } from '../lib/supabase/ideas';
import { listTasks } from '../lib/supabase/tasks';
import { useLifeOSStore } from '../store/lifeos.store';

export function useSupabaseBootstrap() {
  const { user, configured } = useAuth();
  const setTasks = useLifeOSStore((state) => state.setTasks);
  const setGoals = useLifeOSStore((state) => state.setGoals);
  const setExpenses = useLifeOSStore((state) => state.setExpenses);
  const setIdeas = useLifeOSStore((state) => state.setIdeas);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!configured || !user) return;

    let active = true;
    setLoading(true);

    async function loadData() {
      const [tasks, goals, expenses, ideas] = await Promise.all([
        listTasks(),
        listGoals(),
        listExpenses(),
        listIdeas()
      ]);

      if (!active) return;
      if (tasks.length > 0) setTasks(tasks);
      if (goals.length > 0) setGoals(goals);
      if (expenses.length > 0) setExpenses(expenses);
      if (ideas.length > 0) setIdeas(ideas);
      setLoading(false);
    }

    loadData();

    return () => {
      active = false;
    };
  }, [configured, user, setTasks, setGoals, setExpenses, setIdeas]);

  return { loading };
}
