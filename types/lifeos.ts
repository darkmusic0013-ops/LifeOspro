export type Priority = 'Alta' | 'Media' | 'Baja';
export type TaskStatus = 'Pendiente' | 'En progreso' | 'Completada';
export type ExpenseType = 'Gasto' | 'Plan futuro';

export interface Task {
  id: string;
  title: string;
  category: string;
  due: string;
  priority: Priority;
  status: TaskStatus;
  done: boolean;
}

export interface Goal {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  category: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  type: ExpenseType;
}

export interface Idea {
  id: string;
  title: string;
  note: string;
  category: string;
}

export interface Meal {
  id: string;
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  note: string;
}

export interface Profile {
  name: string;
  focus: string;
  reminderTime: string;
  preferredView: string;
  theme: string;
  notes: string;
}

export interface FinanceState {
  salary: number;
  savingGoal: number;
  expenses: Expense[];
}

export interface Empire {
  icon: string;
  name: string;
  description: string;
  progress: number;
}

export type LifeOSTab = 'Dashboard' | 'Misiones' | 'Metas' | 'Imperios' | 'Planner' | 'Ideas' | 'Finanzas' | 'Comidas' | 'Life AI' | 'Perfil';
