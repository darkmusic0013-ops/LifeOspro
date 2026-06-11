import { supabase, hasSupabaseConfig } from './supabase';

export type LifeOSModule = 'tasks' | 'goals' | 'finance' | 'ideas' | 'meals' | 'profile';

export type SyncResult<T = unknown> = {
  ok: boolean;
  mode: 'supabase' | 'local';
  data?: T;
  error?: string;
};

export async function getCurrentUser(){
  if(!hasSupabaseConfig || !supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function saveModuleData(module: LifeOSModule, data: unknown): Promise<SyncResult>{
  if(!hasSupabaseConfig || !supabase){
    return { ok: false, mode: 'local', error: 'Supabase no configurado' };
  }

  const user = await getCurrentUser();
  if(!user){
    return { ok: false, mode: 'local', error: 'Usuario no autenticado' };
  }

  const { error } = await supabase
    .from('lifeos_items')
    .upsert({
      user_id: user.id,
      module,
      data,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,module' });

  if(error) return { ok: false, mode: 'supabase', error: error.message };
  return { ok: true, mode: 'supabase' };
}

export async function loadModuleData<T>(module: LifeOSModule): Promise<SyncResult<T>>{
  if(!hasSupabaseConfig || !supabase){
    return { ok: false, mode: 'local', error: 'Supabase no configurado' };
  }

  const user = await getCurrentUser();
  if(!user){
    return { ok: false, mode: 'local', error: 'Usuario no autenticado' };
  }

  const { data, error } = await supabase
    .from('lifeos_items')
    .select('data')
    .eq('user_id', user.id)
    .eq('module', module)
    .maybeSingle();

  if(error) return { ok: false, mode: 'supabase', error: error.message };
  return { ok: true, mode: 'supabase', data: data?.data as T };
}

export async function signOut(){
  if(!hasSupabaseConfig || !supabase) return { ok:false, error:'Supabase no configurado' };
  const { error } = await supabase.auth.signOut();
  return { ok: !error, error: error?.message };
}
