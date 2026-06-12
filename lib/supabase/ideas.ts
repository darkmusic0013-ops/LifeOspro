import type { Idea } from '../../types/lifeos';
import { getCurrentUserId } from './auth';
import { createSupabaseBrowserClient } from './client';

type IdeaInput = Omit<Idea, 'id'>;

export async function listIdeas(): Promise<Idea[]> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from('ideas').select('id,title,note,category').order('created_at', { ascending: false });
  if (error || !data) return [];

  return data.map((row) => ({
    id: String(row.id),
    title: String(row.title),
    note: String(row.note),
    category: String(row.category)
  }));
}

export async function createIdea(input: IdeaInput): Promise<Idea | null> {
  const supabase = createSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return null;

  const { data, error } = await supabase.from('ideas').insert({ ...input, user_id: userId }).select('id,title,note,category').single();
  if (error || !data) return null;

  return {
    id: String(data.id),
    title: String(data.title),
    note: String(data.note),
    category: String(data.category)
  };
}
