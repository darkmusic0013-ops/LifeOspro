import type { Expense } from '../../types/lifeos';
import { getCurrentUserId } from './auth';
import { createSupabaseBrowserClient } from './client';

type ExpenseInput = Omit<Expense, 'id'>;

export async function listExpenses(): Promise<Expense[]> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from('expenses').select('id,name,amount,category,type').order('created_at', { ascending: false });
  if (error || !data) return [];

  return data.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    amount: Number(row.amount),
    category: String(row.category),
    type: row.type === 'Plan futuro' ? 'Plan futuro' : 'Gasto'
  }));
}

export async function createExpense(input: ExpenseInput): Promise<Expense | null> {
  const supabase = createSupabaseBrowserClient();
  const userId = await getCurrentUserId();
  if (!supabase || !userId) return null;

  const { data, error } = await supabase.from('expenses').insert({ ...input, user_id: userId }).select('id,name,amount,category,type').single();
  if (error || !data) return null;

  return {
    id: String(data.id),
    name: String(data.name),
    amount: Number(data.amount),
    category: String(data.category),
    type: data.type === 'Plan futuro' ? 'Plan futuro' : 'Gasto'
  };
}
