import type { Goal } from '../../types/lifeos';
import { getCurrentUserId } from './auth';
import { createSupabaseBrowserClient } from './client';

type GoalInput = Omit<Goal, 'id'>;

export async function listGoals(): Promise<Goal[]> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from('goals').select('id,name,current,target,unit,category').order('created_at', { ascending: false });
  if (error || !data) return [];

  return data.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    current: Number(row.current),
    target: Number(row.target),
    unit: String(row.unit),
    category: String(row.category)
  }));
}

export async function createGoal(input: GoalInput): Promise<Goal | null> {
  const supabase = createSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return null;

  const { data, error } = await supabase.from('goals').insert({ ...input, user_id: userId }).select('id,name,current,target,unit,category').single();
  if (error || !data) return null;

  return {
    id: String(data.id),
    name: String(data.name),
    current: Number(data.current),
    target: Number(data.target),
    unit: String(data.unit),
    category: String(data.category)
  };
}
