'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Empire, FinanceState, Goal, Idea, LifeOSTab, Meal, Profile, Task } from '../types/lifeos';

const initialTasks: Task[] = [
  { id: '1', title: 'Crear canal de YouTube', category: 'YouTube', due: 'Hoy', priority: 'Alta', status: 'Pendiente', done: false },
  { id: '2', title: 'Ver videos guardados de IA', category: 'Aprendizaje', due: 'Esta semana', priority: 'Media', status: 'Pendiente', done: false },
  { id: '3', title: 'Comprar camisa para el trabajo', category: 'Personal', due: 'Mañana', priority: 'Baja', status: 'Pendiente', done: false }
];

const initialGoals: Goal[] = [
  { id: 'g1', name: 'Monetizar canal', current: 100, target: 1000, unit: 'suscriptores', category: 'YouTube' },
  { id: 'g2', name: 'Crear web trading', current: 18, target: 100, unit: '%', category: 'Negocio' },
  { id: 'g3', name: 'Ahorrar para PC', current: 25000, target: 100000, unit: 'RD$', category: 'Ahorro' }
];

const initialFinance: FinanceState = {
  salary: 50000,
  savingGoal: 8000,
  expenses: [
    { id: 'e1', name: 'Transporte', amount: 4000, category: 'Mensual', type: 'Gasto' },
    { id: 'e2', name: 'Comida', amount: 5500, category: 'Mensual', type: 'Gasto' },
    { id: 'e3', name: 'Laptop futura', amount: 100000, category: 'Futuro', type: 'Plan futuro' }
  ]
};

const initialIdeas: Idea[] = [
  { id: 'i1', title: 'Video de esqueleto gigante', note: 'Idea para Shorts con hook fuerte y final abierto.', category: 'YouTube' },
  { id: 'i2', title: 'Automatizar alertas de IA', note: 'Crear flujo futuro para recibir novedades importantes.', category: 'IA' },
  { id: 'i3', title: 'Pagina web para trading', note: 'Dashboard con herramientas, cursos y plantillas.', category: 'Negocio' }
];

const initialMeals: Meal[] = [
  { id: 'm1', day: 'Hoy', breakfast: 'Huevos + avena', lunch: 'Pollo + arroz + ensalada', dinner: 'Yogurt + fruta', note: 'Plan simple para mantener energia.' },
  { id: 'm2', day: 'Manana', breakfast: 'Pan integral + huevos', lunch: 'Carne molida + vegetales', dinner: 'Batida ligera', note: 'Preparar comida desde temprano.' }
];

const initialProfile: Profile = {
  name: 'Ramon Velez',
  focus: 'Crear contenido con IA y organizar mis proyectos',
  reminderTime: '08:00',
  preferredView: 'Dashboard',
  theme: 'Claro',
  notes: 'Mantener LifeOS simple, manual e inteligente.'
};

export const empires: Empire[] = [
  { icon: 'OS', name: 'Diario del Esqueleto', description: 'Canal de YouTube, shorts virales y marca oscura', progress: 18 },
  { icon: 'AI', name: 'IA y Automatizaciones', description: 'Herramientas, flujos, agentes y sistemas', progress: 25 },
  { icon: 'SG', name: 'Seguros', description: 'Trabajo, polizas, endosos y productividad profesional', progress: 70 },
  { icon: 'IN', name: 'Inversiones', description: 'Capital, oportunidades, trading y crecimiento', progress: 8 }
];

interface LifeOSStore {
  activeTab: LifeOSTab;
  tasks: Task[];
  goals: Goal[];
  finance: FinanceState;
  ideas: Idea[];
  meals: Meal[];
  profile: Profile;
  setActiveTab: (tab: LifeOSTab) => void;
  setTasks: (tasks: Task[]) => void;
  setGoals: (goals: Goal[]) => void;
  setExpenses: (expenses: FinanceState['expenses']) => void;
  setIdeas: (ideas: Idea[]) => void;
  toggleTask: (taskId: string) => void;
  addQuickTask: (title: string) => void;
}

export const useLifeOSStore = create<LifeOSStore>()(
  persist(
    (set) => ({
      activeTab: 'Dashboard',
      tasks: initialTasks,
      goals: initialGoals,
      finance: initialFinance,
      ideas: initialIdeas,
      meals: initialMeals,
      profile: initialProfile,
      setActiveTab: (tab) => set({ activeTab: tab }),
      setTasks: (tasks) => set({ tasks }),
      setGoals: (goals) => set({ goals }),
      setExpenses: (expenses) => set((state) => ({ finance: { ...state.finance, expenses } })),
      setIdeas: (ideas) => set({ ideas }),
      toggleTask: (taskId) => set((state) => ({
        tasks: state.tasks.map((task) => task.id === taskId ? { ...task, done: !task.done, status: task.done ? 'Pendiente' : 'Completada' } : task)
      })),
      addQuickTask: (title) => set((state) => ({
        tasks: [{ id: String(Date.now()), title, category: 'Personal', due: 'Hoy', priority: 'Media', status: 'Pendiente', done: false }, ...state.tasks]
      }))
    }),
    { name: 'lifeos-pro-store-v1' }
  )
);
