import type { Priority, Task, TaskStatus } from '../../types/lifeos';
import { getCurrentUserId } from './auth';
import { createSupabaseBrowserClient } from './client';

type TaskRow = {
  id: string;
  title: string;
  category: string;
  due: string;
  priority: Priority;
  status: TaskStatus;
  done: boolean;
};

type TaskInput = Omit<Task, 'id'>;

const toTask = (row: TaskRow): Task => ({
  id: row.id,
  title: row.title,
  category: row.category,
  due: row.due,
  priority: row.priority,
  status: row.status,
  done: row.done
});

export async function listTasks(): Promise<Task[]> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from('tasks').select('id,title,category,due,priority,status,done').order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map((row) => toTask(row as TaskRow));
}

export async function createTask(input: TaskInput): Promise<Task | null> {
  const supabase = createSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return null;

  const { data, error } = await supabase.from('tasks').insert({ ...input, user_id: userId }).select('id,title,category,due,priority,status,done').single();
  if (error || !data) return null;
  return toTask(data as TaskRow);
}

export async function updateTask(taskId: string, input: Partial<TaskInput>): Promise<Task | null> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from('tasks').update(input).eq('id', taskId).select('id,title,category,due,priority,status,done').single();
  if (error || !data) return null;
  return toTask(data as TaskRow);
}

export async function deleteTask(taskId: string): Promise<boolean> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return false;

  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  return !error;
}
