'use client';

import { useEffect, useState } from 'react';
import { hasSupabaseConfig } from '../lib/supabase';

const initialTasks = [
  { id: '1', title: 'Crear canal de YouTube', category: 'YouTube', due: 'Hoy', priority: 'Alta', done: false },
  { id: '2', title: 'Ver videos guardados de IA', category: 'Aprendizaje', due: 'Esta semana', priority: 'Media', done: false },
  { id: '3', title: 'Comprar camisa para el trabajo', category: 'Personal', due: 'Mañana', priority: 'Baja', done: false }
];
const initialGoals = [
  { id: 'g1', name: 'Monetizar canal', current: 100, target: 1000, unit: 'suscriptores', category: 'YouTube' },
  { id: 'g2', name: 'Crear web trading', current: 18, target: 100, unit: '%', category: 'Negocio' },
  { id: 'g3', name: 'Ahorrar para PC', current: 25000, target: 100000, unit: 'RD$', category: 'Ahorro' }
];
const initialFinance = { salary: 50000, savingGoal: 8000, expenses: [
  { id: 'e1', name: 'Transporte', amount: 4000, category: 'Mensual', type: 'Gasto' },
  { id: 'e2', name: 'Comida', amount: 5500, category: 'Mensual', type: 'Gasto' },
  { id: 'e3', name: 'Laptop futura', amount: 100000, category: 'Futuro', type: 'Plan futuro' }
]};
const initialIdeas = [
  { id:'i1', title:'Video: ¿Qué pasaría si un esqueleto gigante despertara?', note:'Idea para Shorts con hook fuerte y final abierto.', category:'YouTube' },
  { id:'i2', title:'Automatizar alertas de IA', note:'Crear flujo futuro para recibir novedades importantes.', category:'IA' },
  { id:'i3', title:'Página web para trading', note:'Dashboard con herramientas, cursos y plantillas.', category:'Negocio' }
];
const initialMeals = [
  { id:'m1', day:'Hoy', breakfast:'Huevos + avena', lunch:'Pollo + arroz + ensalada', dinner:'Yogurt + fruta', note:'Plan simple para mantener energía.' },
  { id:'m2', day:'Mañana', breakfast:'Pan integral + huevos', lunch:'Carne molida + vegetales', dinner:'Batida ligera', note:'Preparar comida desde temprano.' }
];
const initialProfile = { name: 'Ramon', focus: 'Crear contenido con IA y organizar mis proyectos', reminderTime: '08:00', preferredView: 'Dashboard', theme: 'Oscuro', notes: 'Mantener LifeOS simple, manual e inteligente.' };

const emptyTask = { title: '', category: 'Personal', due: 'Hoy', priority: 'Media' };
const emptyGoal = { name: '', current: 0, target: 100, unit: '', category: 'Personal' };
const emptyExpense = { name: '', amount: 0, category: 'Mensual', type: 'Gasto' };
const emptyIdea = { title:'', note:'', category:'YouTube' };
const emptyMeal = { day:'Hoy', breakfast:'', lunch:'', dinner:'', note:'' };
const filters = ['Todas','Pendientes','Completadas','Hoy','Mañana','Semana','Mes','Alta'];
const navItems = [
  ['Dashboard','⌘'], ['Misiones','✓'], ['Metas','◉'], ['Imperios','▦'], ['Planner','□'], ['Ideas','✦'], ['Finanzas','◍'], ['Comidas','◒'], ['Life AI','⌁']
];
const empires = [
  ['💀','Diario del Esqueleto','Canal de YouTube, shorts virales y marca oscura','18%'],
  ['🤖','IA y Automatizaciones','Herramientas, flujos, agentes y sistemas','25%'],
  ['💼','Seguros','Trabajo, pólizas, endosos y productividad profesional','70%'],
  ['💰','Inversiones','Capital, oportunidades, trading y crecimiento','8%'],
  ['🧠','LifeOS Pro','Sistema operativo personal y futuro SaaS','45%']
];
const aiActions = [
  ['▣','Organiza mi día'], ['▶','Plan para YouTube'], ['✦','Genera ideas virales'], ['✉','Redacta correo profesional'], ['✓','Convierte meta en tareas']
];
const taskStorageKey = 'lifeos_tasks_v1';
const goalStorageKey = 'lifeos_goals_v1';
const financeStorageKey = 'lifeos_finance_v1';
const ideaStorageKey = 'lifeos_ideas_v1';
const mealStorageKey = 'lifeos_meals_v1';
const profileStorageKey = 'lifeos_profile_v1';
const fmt = (n:number) => 'RD$' + Number(n || 0).toLocaleString();
const pct = (current:number, target:number) => target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
const priorityValue = (priority:string) => priority === 'Alta' ? 0 : priority === 'Media' ? 1 : 2;

export default function Home(){
  const [tasks, setTasks] = useState<any[]>(initialTasks);
  const [goals, setGoals] = useState<any[]>(initialGoals);
  const [finance, setFinance] = useState<any>(initialFinance);
  const [ideas, setIdeas] = useState<any[]>(initialIdeas);
  const [meals, setMeals] = useState<any[]>(initialMeals);
  const [profile, setProfile] = useState<any>(initialProfile);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [hydrated, setHydrated] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showIdeaForm, setShowIdeaForm] = useState(false);
  const [showMealForm, setShowMealForm] = useState(false);
  const [taskDraft, setTaskDraft] = useState<any>(emptyTask);
  const [goalDraft, setGoalDraft] = useState<any>(emptyGoal);
  const [expenseDraft, setExpenseDraft] = useState<any>(emptyExpense);
  const [ideaDraft, setIdeaDraft] = useState<any>(emptyIdea);
  const [mealDraft, setMealDraft] = useState<any>(emptyMeal);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [taskFilter, setTaskFilter] = useState('Todas');

  useEffect(() => { try {
    const st = window.localStorage.getItem(taskStorageKey); const sg = window.localStorage.getItem(goalStorageKey); const sf = window.localStorage.getItem(financeStorageKey); const si = window.localStorage.getItem(ideaStorageKey); const sm = window.localStorage.getItem(mealStorageKey); const sp = window.localStorage.getItem(profileStorageKey);
    if(st) setTasks(JSON.parse(st)); if(sg) setGoals(JSON.parse(sg)); if(sf) setFinance(JSON.parse(sf)); if(si) setIdeas(JSON.parse(si)); if(sm) setMeals(JSON.parse(sm)); if(sp) setProfile(JSON.parse(sp));
  } catch {} finally { setHydrated(true); } }, []);
  useEffect(() => { if(hydrated) try { window.localStorage.setItem(taskStorageKey, JSON.stringify(tasks)); } catch {} }, [tasks, hydrated]);
  useEffect(() => { if(hydrated) try { window.localStorage.setItem(goalStorageKey, JSON.stringify(goals)); } catch {} }, [goals, hydrated]);
  useEffect(() => { if(hydrated) try { window.localStorage.setItem(financeStorageKey, JSON.stringify(finance)); } catch {} }, [finance, hydrated]);
  useEffect(() => { if(hydrated) try { window.localStorage.setItem(ideaStorageKey, JSON.stringify(ideas)); } catch {} }, [ideas, hydrated]);
  useEffect(() => { if(hydrated) try { window.localStorage.setItem(mealStorageKey, JSON.stringify(meals)); } catch {} }, [meals, hydrated]);
  useEffect(() => { if(hydrated) try { window.localStorage.setItem(profileStorageKey, JSON.stringify(profile)); } catch {} }, [profile, hydrated]);

  const monthlyExpenses = finance.expenses.filter((e:any)=>e.type==='Gasto');
  const futureExpenses = finance.expenses.filter((e:any)=>e.type!=='Gasto');
  const totalExpenses = monthlyExpenses.reduce((a:number,e:any)=>a+Number(e.amount||0),0);
  const balance = Number(finance.salary||0) - totalExpenses;
  const savingProgress = pct(Math.max(balance,0), Number(finance.salary || 1));
  const pendingTasks = tasks.filter(t => !t.done);
  const completedTasks = tasks.filter(t => t.done);
  const todayTasks = tasks.filter(t => !t.done && t.due === 'Hoy');
  const topTasks = [...pendingTasks].sort((a,b) => priorityValue(a.priority) - priorityValue(b.priority));
  const weeklyProgress = pct(completedTasks.length, tasks.length || 1);
  const filteredTasks = tasks.filter(t => taskFilter === 'Pendientes' ? !t.done : taskFilter === 'Completadas' ? t.done : taskFilter === 'Hoy' ? t.due==='Hoy' : taskFilter === 'Mañana' ? t.due==='Mañana' : taskFilter === 'Semana' ? t.due==='Esta semana' : taskFilter === 'Mes' ? t.due==='Este mes' : taskFilter === 'Alta' ? t.priority==='Alta' : true);

  function openNewTask(){ setTaskDraft(emptyTask); setEditingTaskId(null); setShowTaskForm(true); }
  function openEditTask(task:any){ setTaskDraft({ title: task.title, category: task.category, due: task.due, priority: task.priority }); setEditingTaskId(task.id); setShowTaskForm(true); }
  function closeTaskForm(){ setTaskDraft(emptyTask); setEditingTaskId(null); setShowTaskForm(false); }
  function saveTask(){ if(!taskDraft.title.trim()) return; editingTaskId ? setTasks(tasks.map(t => t.id === editingTaskId ? { ...t, ...taskDraft } : t)) : setTasks([{ ...taskDraft, id: String(Date.now()), done: false }, ...tasks]); closeTaskForm(); setActiveTab('Misiones'); }
  function toggleTask(id:string){ setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)); }
  function deleteTask(id:string){ setTasks(tasks.filter(t => t.id !== id)); }
  function openNewGoal(){ setGoalDraft(emptyGoal); setEditingGoalId(null); setShowGoalForm(true); }
  function openEditGoal(goal:any){ setGoalDraft({ name: goal.name, current: goal.current, target: goal.target, unit: goal.unit, category: goal.category }); setEditingGoalId(goal.id); setShowGoalForm(true); }
  function closeGoalForm(){ setGoalDraft(emptyGoal); setEditingGoalId(null); setShowGoalForm(false); }
  function saveGoal(){ if(!goalDraft.name.trim()) return; const cleanGoal = { ...goalDraft, current: Number(goalDraft.current)||0, target: Number(goalDraft.target)||0 }; editingGoalId ? setGoals(goals.map(g => g.id === editingGoalId ? { ...g, ...cleanGoal } : g)) : setGoals([{ ...cleanGoal, id: String(Date.now()) }, ...goals]); closeGoalForm(); setActiveTab('Metas'); }
  function deleteGoal(id:string){ setGoals(goals.filter(g => g.id !== id)); }
  function openNewExpense(){ setExpenseDraft(emptyExpense); setEditingExpenseId(null); setShowExpenseForm(true); }
  function openEditExpense(expense:any){ setExpenseDraft({ name: expense.name, amount: expense.amount, category: expense.category, type: expense.type }); setEditingExpenseId(expense.id); setShowExpenseForm(true); }
  function closeExpenseForm(){ setExpenseDraft(emptyExpense); setEditingExpenseId(null); setShowExpenseForm(false); }
  function saveExpense(){ if(!expenseDraft.name.trim()) return; const clean = { ...expenseDraft, amount: Number(expenseDraft.amount)||0 }; const expenses = editingExpenseId ? finance.expenses.map((e:any)=>e.id===editingExpenseId?{...e,...clean}:e) : [{...clean,id:String(Date.now())},...finance.expenses]; setFinance({...finance, expenses}); closeExpenseForm(); setActiveTab('Finanzas'); }
  function deleteExpense(id:string){ setFinance({...finance, expenses: finance.expenses.filter((e:any)=>e.id!==id)}); }
  function openNewIdea(){ setIdeaDraft(emptyIdea); setEditingIdeaId(null); setShowIdeaForm(true); }
  function openEditIdea(idea:any){ setIdeaDraft({ title: idea.title, note: idea.note, category: idea.category }); setEditingIdeaId(idea.id); setShowIdeaForm(true); }
  function closeIdeaForm(){ setIdeaDraft(emptyIdea); setEditingIdeaId(null); setShowIdeaForm(false); }
  function saveIdea(){ if(!ideaDraft.title.trim()) return; editingIdeaId ? setIdeas(ideas.map(i=>i.id===editingIdeaId?{...i,...ideaDraft}:i)) : setIdeas([{...ideaDraft,id:String(Date.now())},...ideas]); closeIdeaForm(); setActiveTab('Ideas'); }
  function deleteIdea(id:string){ setIdeas(ideas.filter(i=>i.id!==id)); }
  function openNewMeal(){ setMealDraft(emptyMeal); setEditingMealId(null); setShowMealForm(true); }
  function openEditMeal(meal:any){ setMealDraft({ day: meal.day, breakfast: meal.breakfast, lunch: meal.lunch, dinner: meal.dinner, note: meal.note }); setEditingMealId(meal.id); setShowMealForm(true); }
  function closeMealForm(){ setMealDraft(emptyMeal); setEditingMealId(null); setShowMealForm(false); }
  function saveMeal(){ if(!mealDraft.day.trim()) return; editingMealId ? setMeals(meals.map(m=>m.id===editingMealId?{...m,...mealDraft}:m)) : setMeals([{...mealDraft,id:String(Date.now())},...meals]); closeMealForm(); setActiveTab('Comidas'); }
  function deleteMeal(id:string){ setMeals(meals.filter(m=>m.id!==id)); }

  const statCards = [
    ['✓','MISIONES',todayTasks.length,'activas hoy','blue'],
    ['▥','PROGRESO',`${weeklyProgress}%`,'completado','purple'],
    ['🔥','RACHA',Math.max(1, completedTasks.length + 1),'días seguidos','orange'],
    ['◉','METAS',goals.length,'activas','green']
  ];
  const LifeAIBlock = <div className='lifeAi card'><span className='pill'>↙ Life AI</span><h3>¿Qué organizamos?</h3><div className='aiGrid'>{aiActions.slice(0,3).map(a=><button className='ghost aiAction' key={a[1]}><span>{a[0]}</span>{a[1]} ↗</button>)}</div></div>;

  const dashboard = <div className='controlCenter compactDashboard'>
    <section className='statGrid'>{statCards.map(s=><div className={'statCard '+s[4]} key={s[1]}><small><span>{s[0]}</span>{s[1]}</small><b>{s[2]}</b><em>{s[3]}</em></div>)}</section>
    <section className='dashboardGrid'>
      <div className='missionDay card'><div className='sectionHeader'><div><span className='pill'>⌁ Misión del día</span><h3>{topTasks[0]?.title || 'Define tu misión principal'}</h3><p className='muted'>{topTasks[0] ? `${topTasks[0].category} · ${topTasks[0].due}` : 'Crea una misión para comenzar.'}</p></div><span className={'priority '+(topTasks[0]?.priority==='Alta'?'alta':topTasks[0]?.priority==='Media'?'media':'baja')}>{topTasks[0]?.priority || 'Nueva'}</span></div><div className='tinyProgress'><span>Progreso</span><b>12%</b><i><em style={{width:'12%'}} /></i></div></div>
      <div className='nextCard card'><h3>⌕ Qué hacer ahora</h3><div className='checkList'>{topTasks.slice(0,3).map(t=><button key={t.id} onClick={()=>toggleTask(t.id)}><span></span>{t.title}</button>)}<button onClick={openNewTask}><span>＋</span>Agregar próxima tarea...</button></div></div>
      <div className='financeMini card'><h3>◉ Finanzas mensuales</h3><div className='moneyLine salary'><span>↑ Salario</span><b>{fmt(finance.salary)}</b></div><div className='moneyLine expense'><span>↓ Gastos</span><b>{fmt(totalExpenses)}</b></div><div className='moneyLine available'><span>▣ Disponible</span><b>{fmt(balance)}</b></div></div>
      <div className='savingCard card'><strong>{savingProgress}%</strong><span>ahorro del ingreso</span><i><em style={{width:savingProgress+'%'}} /></i></div>
      {LifeAIBlock}
    </section>
    <section className='lowerGrid'>
      <div className='card goalsBlock'><h3>Metas medibles</h3>{goals.map(g=><div className='goal' key={g.id}><div><b>{g.name}</b><span>{pct(g.current,g.target)}%</span></div><small>{Number(g.current).toLocaleString()} / {Number(g.target).toLocaleString()} {g.unit}</small><div className='bar'><i style={{width:pct(g.current,g.target)+'%'}} /></div></div>)}</div>
      <div className='card'><h3>Mis Imperios</h3>{empires.slice(0,4).map(p=><div className='empireRow' key={p[1]}><div><span className='empireIcon'>{p[0]}</span><b>{p[1]}</b></div><span>{p[3]}</span></div>)}</div>
    </section>
  </div>;

  const taskPanel = <section className='taskBoard'><div className='card wide'><div className='sectionHeader'><div><h3>Misiones</h3><p className='muted'>Urgente, hoy, semana, futuro y completadas.</p></div><button className='btn' onClick={openNewTask}>+ Nueva misión</button></div><div className='filters'>{filters.map(f=><button key={f} onClick={()=>setTaskFilter(f)} className={taskFilter===f?'active':''}>{f}</button>)}</div><div className='taskList'>{filteredTasks.map(t=><div className={'taskCard '+(t.done?'done':'')} key={t.id}><button className='check' onClick={()=>toggleTask(t.id)}>{t.done?'✓':''}</button><div><b>{t.title}</b><small>{t.category} · {t.due}</small></div><span className={'priority '+(t.priority==='Alta'?'alta':t.priority==='Media'?'media':'baja')}>{t.priority}</span><button className='edit' onClick={()=>openEditTask(t)}>Editar</button><button className='delete' onClick={()=>deleteTask(t.id)}>Eliminar</button></div>)}</div></div></section>;
  const goalPanel = <section className='taskBoard'><div className='card wide'><div className='sectionHeader'><div><h3>Metas</h3><p className='muted'>Objetivos medibles con progreso automático.</p></div><button className='btn' onClick={openNewGoal}>+ Nueva meta</button></div><div className='taskStats'><div><b>{goals.length}</b><span>Metas</span></div><div><b>{goals.filter(g=>pct(g.current,g.target)>=100).length}</b><span>Completadas</span></div><div><b>{Math.round(goals.reduce((a,g)=>a+pct(g.current,g.target),0)/(goals.length||1))}%</b><span>Promedio</span></div></div><div className='taskList'>{goals.map(g=><div className='goalCard' key={g.id}><div><b>{g.name}</b><small>{g.category} · {Number(g.current).toLocaleString()} / {Number(g.target).toLocaleString()} {g.unit}</small><div className='bar'><i style={{width:pct(g.current,g.target)+'%'}} /></div></div><span className='goalPct'>{pct(g.current,g.target)}%</span><button className='edit' onClick={()=>openEditGoal(g)}>Editar</button><button className='delete' onClick={()=>deleteGoal(g.id)}>Eliminar</button></div>)}</div></div></section>;
  const empirePanel = <section className='taskBoard'><div className='card wide'><h3>Mis Imperios</h3><p className='muted'>Tus grandes áreas de vida y crecimiento.</p><div className='empireGrid'>{empires.map(p=><div className='empireCard' key={p[1]}><span>{p[0]}</span><h3>{p[1]}</h3><p>{p[2]}</p><div className='bar'><i style={{width:p[3]}} /></div><small>{p[3]} de avance</small></div>)}</div></div></section>;
  const plannerPanel = <section className='modules'><div className='card'><h3>Planner de hoy</h3>{todayTasks.map(t=><div className='row' key={t.id}><span>{t.title}</span><b>{t.priority}</b></div>)}</div><div className='card'><h3>Esta semana</h3>{tasks.filter(t=>t.due==='Esta semana').map(t=><div className='row' key={t.id}><span>{t.title}</span><b>{t.category}</b></div>)}</div><div className='card'><h3>Comidas próximas</h3>{meals.slice(0,3).map(m=><div className='day' key={m.id}><b>{m.day}</b><span>{m.lunch || m.dinner}</span></div>)}</div></section>;
  const financePanel = <section className='taskBoard'><div className='card wide'><div className='sectionHeader'><div><h3>Finanzas</h3><p className='muted'>Salario, gastos, ahorro y compras futuras.</p></div><button className='btn' onClick={openNewExpense}>+ Agregar gasto</button></div><div className='taskStats'><div><b>{fmt(finance.salary)}</b><span>Salario</span></div><div><b>{fmt(totalExpenses)}</b><span>Gastos mes</span></div><div><b>{fmt(balance)}</b><span>Disponible</span></div></div><div className='financeBox'><div><h3>Plan de ahorro</h3><p className='muted'>Meta mensual: {fmt(finance.savingGoal)}</p><div className='bar'><i style={{width:savingProgress+'%'}} /></div><small>{savingProgress}% de la meta</small></div><div className='formGrid'><input type='number' value={finance.salary} onChange={e=>setFinance({...finance,salary:Number(e.target.value)})}/><input type='number' value={finance.savingGoal} onChange={e=>setFinance({...finance,savingGoal:Number(e.target.value)})}/></div></div><h3>Gastos mensuales</h3><div className='taskList'>{monthlyExpenses.map((e:any)=><div className='expenseCard' key={e.id}><div><b>{e.name}</b><small>{e.category}</small></div><b>{fmt(e.amount)}</b><button className='edit' onClick={()=>openEditExpense(e)}>Editar</button><button className='delete' onClick={()=>deleteExpense(e.id)}>Eliminar</button></div>)}</div><h3>Plan de gastos futuros</h3><div className='taskList'>{futureExpenses.map((e:any)=><div className='expenseCard' key={e.id}><div><b>{e.name}</b><small>{e.category}</small></div><b>{fmt(e.amount)}</b><button className='edit' onClick={()=>openEditExpense(e)}>Editar</button><button className='delete' onClick={()=>deleteExpense(e.id)}>Eliminar</button></div>)}</div></div></section>;
  const ideaPanel = <section className='taskBoard'><div className='card wide'><div className='sectionHeader'><div><h3>Ideas</h3><p className='muted'>Banco creativo para contenido, IA, negocio y trabajo.</p></div><button className='btn' onClick={openNewIdea}>+ Nueva idea</button></div><div className='taskList'>{ideas.map(i=><div className='ideaItem' key={i.id}><div className='ideaContent'><span className='tag'>{i.category}</span><b>{i.title}</b><p className='ideaText'>{i.note}</p></div><button className='edit' onClick={()=>openEditIdea(i)}>Editar</button><button className='delete' onClick={()=>deleteIdea(i.id)}>Eliminar</button></div>)}</div></div></section>;
  const mealPanel = <section className='taskBoard'><div className='card wide'><div className='sectionHeader'><div><h3>Comidas</h3><p className='muted'>Planifica desayuno, almuerzo y cena.</p></div><button className='btn' onClick={openNewMeal}>+ Nueva comida</button></div><div className='taskList'>{meals.map(m=><div className='mealCard' key={m.id}><div><span className='tag'>{m.day}</span><p>🍳 {m.breakfast || 'Sin desayuno'}</p><p>🍗 {m.lunch || 'Sin almuerzo'}</p><p>🌙 {m.dinner || 'Sin cena'}</p><small>{m.note}</small></div><button className='edit' onClick={()=>openEditMeal(m)}>Editar</button><button className='delete' onClick={()=>deleteMeal(m.id)}>Eliminar</button></div>)}</div></div></section>;
  const profilePanel = <section className='taskBoard'><div className='card wide'><div className='sectionHeader'><div><h3>Perfil</h3><p className='muted'>Configuración personal de LifeOS.</p></div><span className='pill'>{hasSupabaseConfig?'Supabase listo':'Modo local'}</span></div><div className='profileCard'><input value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} placeholder='Tu nombre'/><input value={profile.focus} onChange={e=>setProfile({...profile,focus:e.target.value})} placeholder='Enfoque principal'/><div className='formGrid'><input type='time' value={profile.reminderTime} onChange={e=>setProfile({...profile,reminderTime:e.target.value})}/><select value={profile.preferredView} onChange={e=>setProfile({...profile,preferredView:e.target.value})}>{navItems.map(t=><option key={t[0]}>{t[0]}</option>)}</select><select value={profile.theme} onChange={e=>setProfile({...profile,theme:e.target.value})}><option>Oscuro</option><option>Claro futuro</option></select></div><textarea className='textarea' value={profile.notes} onChange={e=>setProfile({...profile,notes:e.target.value})}/><button className='ghost' onClick={()=>setActiveTab(profile.preferredView)}>Abrir vista preferida</button></div></div></section>;
  const lifeAiPanel = <section className='taskBoard'>{LifeAIBlock}</section>;
  const content = activeTab === 'Misiones' ? taskPanel : activeTab === 'Metas' ? goalPanel : activeTab === 'Imperios' ? empirePanel : activeTab === 'Planner' ? plannerPanel : activeTab === 'Ideas' ? ideaPanel : activeTab === 'Finanzas' ? financePanel : activeTab === 'Comidas' ? mealPanel : activeTab === 'Life AI' ? lifeAiPanel : activeTab === 'Perfil' ? profilePanel : dashboard;

  return <div className='app'><div className='top appHeader'><div><h2>Buenos días,<br />{profile.name}</h2><p>Jueves 11 junio · {todayTasks.length} misión activa · ahorro del día activo</p></div><div className='headerSearch'>⌕ Buscar en LifeOS...</div><button className='soft plusOnly'>＋</button><button className='btn' onClick={openNewTask}>Nueva misión</button></div><div className='nav'><div className='navBrand'>LifeOS Pro</div><div className='navMenu'>{navItems.map(tab=><button key={tab[0]} onClick={()=>setActiveTab(tab[0])} className={activeTab===tab[0]?'active':''}><span>{tab[1]}</span>{tab[0]}</button>)}</div><button className={activeTab==='Perfil'?'navProfile active':'navProfile'} onClick={()=>setActiveTab('Perfil')}><span>◉</span>{profile.name} Velez</button></div>{content}{showTaskForm&&<div className='modalBack'><div className='modal'><h3>{editingTaskId?'Editar misión':'Nueva misión'}</h3><input placeholder='Ej: Crear canal de YouTube' value={taskDraft.title} onChange={e=>setTaskDraft({...taskDraft,title:e.target.value})}/><div className='formGrid'><select value={taskDraft.category} onChange={e=>setTaskDraft({...taskDraft,category:e.target.value})}><option>YouTube</option><option>Trabajo</option><option>Finanzas</option><option>Aprendizaje</option><option>Personal</option><option>Salud</option></select><select value={taskDraft.due} onChange={e=>setTaskDraft({...taskDraft,due:e.target.value})}><option>Hoy</option><option>Mañana</option><option>Esta semana</option><option>Este mes</option><option>Futuro</option></select><select value={taskDraft.priority} onChange={e=>setTaskDraft({...taskDraft,priority:e.target.value})}><option>Alta</option><option>Media</option><option>Baja</option></select></div><div className='modalActions'><button className='soft' onClick={closeTaskForm}>Cancelar</button><button className='btn' onClick={saveTask}>{editingTaskId?'Guardar cambios':'Guardar misión'}</button></div></div></div>}{showGoalForm&&<div className='modalBack'><div className='modal'><h3>{editingGoalId?'Editar meta':'Nueva meta'}</h3><input placeholder='Ej: Monetizar canal' value={goalDraft.name} onChange={e=>setGoalDraft({...goalDraft,name:e.target.value})}/><div className='formGrid'><input type='number' placeholder='Actual' value={goalDraft.current} onChange={e=>setGoalDraft({...goalDraft,current:Number(e.target.value)})}/><input type='number' placeholder='Objetivo' value={goalDraft.target} onChange={e=>setGoalDraft({...goalDraft,target:Number(e.target.value)})}/><input placeholder='Unidad' value={goalDraft.unit} onChange={e=>setGoalDraft({...goalDraft,unit:e.target.value})}/></div><select value={goalDraft.category} onChange={e=>setGoalDraft({...goalDraft,category:e.target.value})}><option>YouTube</option><option>Ahorro</option><option>Negocio</option><option>Salud</option><option>Personal</option></select><div className='modalActions'><button className='soft' onClick={closeGoalForm}>Cancelar</button><button className='btn' onClick={saveGoal}>{editingGoalId?'Guardar cambios':'Guardar meta'}</button></div></div></div>}{showExpenseForm&&<div className='modalBack'><div className='modal'><h3>{editingExpenseId?'Editar gasto':'Nuevo gasto / plan'}</h3><input placeholder='Ej: Alquiler, comida, laptop futura' value={expenseDraft.name} onChange={e=>setExpenseDraft({...expenseDraft,name:e.target.value})}/><div className='formGrid'><input type='number' placeholder='Monto' value={expenseDraft.amount} onChange={e=>setExpenseDraft({...expenseDraft,amount:Number(e.target.value)})}/><select value={expenseDraft.type} onChange={e=>setExpenseDraft({...expenseDraft,type:e.target.value})}><option>Gasto</option><option>Plan futuro</option></select><select value={expenseDraft.category} onChange={e=>setExpenseDraft({...expenseDraft,category:e.target.value})}><option>Mensual</option><option>Futuro</option><option>Trabajo</option><option>YouTube</option><option>Personal</option></select></div><div className='modalActions'><button className='soft' onClick={closeExpenseForm}>Cancelar</button><button className='btn' onClick={saveExpense}>{editingExpenseId?'Guardar cambios':'Guardar'}</button></div></div></div>}{showIdeaForm&&<div className='modalBack'><div className='modal'><h3>{editingIdeaId?'Editar idea':'Nueva idea'}</h3><input placeholder='Título de la idea' value={ideaDraft.title} onChange={e=>setIdeaDraft({...ideaDraft,title:e.target.value})}/><textarea className='textarea' placeholder='Describe la idea, pasos o detalles...' value={ideaDraft.note} onChange={e=>setIdeaDraft({...ideaDraft,note:e.target.value})}/><select value={ideaDraft.category} onChange={e=>setIdeaDraft({...ideaDraft,category:e.target.value})}><option>YouTube</option><option>IA</option><option>Negocio</option><option>Trabajo</option><option>Personal</option><option>Trading</option></select><div className='modalActions'><button className='soft' onClick={closeIdeaForm}>Cancelar</button><button className='btn' onClick={saveIdea}>{editingIdeaId?'Guardar cambios':'Guardar idea'}</button></div></div></div>}{showMealForm&&<div className='modalBack'><div className='modal'><h3>{editingMealId?'Editar comida':'Nueva comida'}</h3><select value={mealDraft.day} onChange={e=>setMealDraft({...mealDraft,day:e.target.value})}><option>Hoy</option><option>Mañana</option><option>Lunes</option><option>Martes</option><option>Miércoles</option><option>Jueves</option><option>Viernes</option><option>Sábado</option><option>Domingo</option></select><input placeholder='Desayuno' value={mealDraft.breakfast} onChange={e=>setMealDraft({...mealDraft,breakfast:e.target.value})}/><input placeholder='Almuerzo' value={mealDraft.lunch} onChange={e=>setMealDraft({...mealDraft,lunch:e.target.value})}/><input placeholder='Cena' value={mealDraft.dinner} onChange={e=>setMealDraft({...mealDraft,dinner:e.target.value})}/><textarea className='textarea' placeholder='Notas o compras necesarias...' value={mealDraft.note} onChange={e=>setMealDraft({...mealDraft,note:e.target.value})}/><div className='modalActions'><button className='soft' onClick={closeMealForm}>Cancelar</button><button className='btn' onClick={saveMeal}>{editingMealId?'Guardar cambios':'Guardar comida'}</button></div></div></div>}</div>;
}