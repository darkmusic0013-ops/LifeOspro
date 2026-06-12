import { createSupabaseBrowserClient } from './client';

export async function getCurrentUserId(): Promise<string | null> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return null;

  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}
