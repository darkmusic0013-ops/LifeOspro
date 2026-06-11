'use client';

import { useEffect, useState } from 'react';

const initialTasks = [
  { id: '1', title: 'Crear canal de YouTube', category: 'YouTube', due: 'Hoy', priority: 'Alta', done: false },
  { id: '2', title: 'Ver videos guardados', category: 'Aprendizaje', due: 'Esta semana', priority: 'Media', done: false },
  { id: '3', title: 'Comprar camisa para el trabajo', category: 'Personal', due: 'Mañana', priority: 'Baja', done: false }
];

const emptyTask = { title: '', category: 'Personal', due: 'Hoy', priority: 'Media' };
const filters = ['Todas','Pendientes','Completadas','Hoy','Mañana','Semana','Mes','Alta'];
const goals = [
  { name: 'Monetizar canal', current: 100, target: 1000, unit: 'suscriptores' },
  { name: 'Crear web trading', current: 18, target: 100, unit: '%' },
  { name: 'Ahorrar para PC', current: 25000, target: 100000, unit: 'RD$' }
];
const projects = [['Diario del Esqueleto','YouTube','18%'],['LifeOS Pro','SaaS','32%'],['Web Trading','Negocio','7%']];
const money = [['Salario','RD$50,000'],['Gastos','RD$8,000'],['Disponible','RD$42,000']];
const storageKey = 'lifeos_tasks_v1';
const pct = (current:number, target:number) => Math.min(100, Math.round((current / target) * 100));
const priorityValue = (priority:string) => priority === 'Alta' ? 0 : priority === 'Media' ? 1 : 2;

type TaskItem = {
  id: string;
  title: string;
  category: string;
  due: string;
  priority: string;
  done: boolean;
};

export default function Home(){
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskDraft, setTaskDraft] = useState(emptyTask);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskFilter, setTaskFilter] = useState('Todas');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if(saved) setTasks(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem(storageKey, JSON.stringify(tasks)); } catch {}
  }, [tasks]);

  const pendingTasks = tasks.filter(t => !t.done);
  const completedTasks = tasks.filter(t => t.done);
  const todayTasks = tasks.filter(t => !t.done && t.due === 'Hoy');
  const topTasks = [...pendingTasks].sort((a,b) => priorityValue(a.priority) - priorityValue(b.priority)).slice(0,3);
  const filteredTasks = tasks.filter(t => {
    if(taskFilter === 'Pendientes') return !t.done;
    if(taskFilter === 'Completadas') return t.done;
    if(taskFilter === 'Hoy') return t.due === 'Hoy';
    if(taskFilter === 'Mañana') return t.due === 'Mañana';
    if(taskFilter === 'Semana') return t.due === 'Esta semana';
    if(taskFilter === 'Mes') return t.due === 'Este mes';
    if(taskFilter === 'Alta') return t.priority === 'Alta';
    return true;
  });

  function openNewTask(){
    setTaskDraft(emptyTask);
    setEditingTaskId(null);
    setShowTaskForm(true);
  }

  function openEditTask(task:TaskItem){
    setTaskDraft({ title: task.title, category: task.category, due: task.due, priority: task.priority });
    setEditingTaskId(task.id);
    setShowTaskForm(true);
  }

  function closeTaskForm(){
    setTaskDraft(emptyTask);
    setEditingTaskId(null);
    setShowTaskForm(false);
  }

  function saveTask(){
    if(!taskDraft.title.trim()) return;
    if(editingTaskId){
      setTasks(tasks.map(t => t.id === editingTaskId ? { ...t, ...taskDraft } : t));
    } else {
      setTasks([{ ...taskDraft, id: String(Date.now()), done: false }, ...tasks]);
    }
    closeTaskForm();
    setActiveTab('Tareas');
  }

  function toggleTask(id:string){ setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)); }
  function deleteTask(id:string){ setTasks(tasks.filter(t => t.id !== id)); }

  const dashboard = <>
    <section className='hero'>
      <div className='card heroCard'>
        <div className='spark'>✨</div>
        <span className='pill'>Enfoque de hoy</span>
        <h1>Ejecuta tu día con claridad.</h1>
        <p className='muted'>LifeOS convierte tus pendientes, metas, finanzas e ideas en una ruta visual para saber qué hacer ahora y qué viene después.</p>
        <div className='grid'>
          <div className='mini active'><b>{pendingTasks.length}</b><span>Pendientes</span></div>
          <div className='mini'><b>{todayTasks.length}</b><span>Para hoy</span></div>
          <div className='mini'><b>RD$8k</b><span>Ahorro</span></div>
          <div className='mini'><b>{goals.length}</b><span>Metas</span></div>
        </div>
      </div>
      <div className='card focus'>
        <div className='focusTop'><h3>Prioridad inmediata</h3><span className='pulse'>En vivo</span></div>
        {topTasks.map((t,i)=><div className='row taskRow' key={t.id}><div className='rank'>{i+1}</div><div><b>{t.title}</b><small>{t.category} · {t.due}</small></div><span className={'priority '+(t.priority==='Alta'?'alta':t.priority==='Media'?'media':'baja')}>{t.priority}</span></div>)}
      </div>
    </section>
    <section className='modules'>
      <div className='card now'><h3>Qué debo hacer ahora</h3><p className='muted'>Ordenado por impacto y fecha.</p><ol>{topTasks.map(t=><li key={t.id}>{t.title}</li>)}</ol></div>
      <div className='card moneyCard'><h3>Finanzas mensuales</h3>{money.map(m=><div className='row' key={m[0]}><span>{m[0]}</span><b>{m[1]}</b></div>)}</div>
      <div className='card ideaCard'><h3>Banco de ideas</h3><p className='muted'>YouTube, IA, negocios, trabajo y personal.</p><div className='chips'><span>🎥 Shorts</span><span>🤖 IA</span><span>💼 Trabajo</span></div><button className='ghost'>Guardar idea</button></div>
    </section>
    <section className='modules'>
      <div className='card wide'><h3>Metas medibles</h3><p className='muted'>El progreso se calcula con valor actual ÷ valor objetivo.</p>{goals.map(g=><div className='goal' key={g.name}><div><b>{g.name}</b><span>{pct(g.current,g.target)}%</span></div><small>{g.current.toLocaleString()} / {g.target.toLocaleString()} {g.unit}</small><div className='bar'><i style={{width:pct(g.current,g.target)+'%'}}></i></div></div>)}</div>
      <div className='card calendar'><h3>Calendario rápido</h3><div className='day'><b>Hoy</b><span>{todayTasks.length} tareas</span></div><div className='day'><b>Mañana</b><span>{tasks.filter(t=>t.due==='Mañana'&&!t.done).length} tareas</span></div><div className='day'><b>Semana</b><span>{tasks.filter(t=>t.due==='Esta semana'&&!t.done).length} tareas</span></div></div>
    </section>
    <section className='modules'>
      <div className='card wide'><h3>Proyectos activos</h3>{projects.map(p=><div className='goal' key={p[0]}><div><b>{p[0]}</b><span>{p[2]}</span></div><small>{p[1]}</small><div className='bar violet'><i style={{width:p[2]}}></i></div></div>)}</div>
      <div className='card food'><h3>Plan de alimentación</h3><p>🍳 Desayuno: Huevos + avena</p><p>🍗 Almuerzo: Pollo + arroz + ensalada</p><p>🍓 Cena: Yogurt + fruta</p></div>
    </section>
  </>;

  const taskPanel = <section className='taskBoard'><div className='card wide'><div className='sectionHeader'><div><h3>Tareas</h3><p className='muted'>Crea, edita, completa, filtra y elimina tus pendientes. Por ahora se guardan en este navegador.</p></div><button className='btn' onClick={openNewTask}>+ Nueva tarea</button></div><div className='taskStats'><div><b>{tasks.length}</b><span>Total</span></div><div><b>{pendingTasks.length}</b><span>Pendientes</span></div><div><b>{completedTasks.length}</b><span>Completadas</span></div></div><div className='filters'>{filters.map(f=><button key={f} onClick={()=>setTaskFilter(f)} className={taskFilter===f?'active':''}>{f}</button>)}</div><div className='taskList'>{filteredTasks.length===0&&<div className='emptyState'>No hay tareas para este filtro.</div>}{filteredTasks.map(t=><div className={'taskCard '+(t.done?'done':'')} key={t.id}><button className='check' onClick={()=>toggleTask(t.id)}>{t.done?'✓':''}</button><div><b>{t.title}</b><small>{t.category} · {t.due}</small></div><span className={'priority '+(t.priority==='Alta'?'alta':t.priority==='Media'?'media':'baja')}>{t.priority}</span><button className='edit' onClick={()=>openEditTask(t)}>Editar</button><button className='delete' onClick={()=>deleteTask(t.id)}>Eliminar</button></div>)}</div></div></section>;

  return(<div className='app'><div className='orb orb1'></div><div className='orb orb2'></div><div className='top'><div className='brand'><div className='logo'>OS</div><div><h2>LifeOS Pro</h2><div className='muted'>Centro personal de productividad, dinero y metas</div></div></div><div className='actions'><button className='soft'>Vista semanal</button><button className='btn' onClick={openNewTask}>+ Nueva tarea</button></div></div>{activeTab==='Tareas'?taskPanel:dashboard}<div className='nav'>{['Dashboard','Tareas','Metas','Finanzas','Ideas','Perfil'].map(tab=><button key={tab} onClick={()=>setActiveTab(tab)} className={activeTab===tab?'active':''}>{tab}</button>)}</div>{showTaskForm&&<div className='modalBack'><div className='modal'><h3>{editingTaskId?'Editar tarea':'Nueva tarea'}</h3><input placeholder='Ej: Crear canal de YouTube' value={taskDraft.title} onChange={e=>setTaskDraft({...taskDraft,title:e.target.value})}/><div className='formGrid'><select value={taskDraft.category} onChange={e=>setTaskDraft({...taskDraft,category:e.target.value})}><option>YouTube</option><option>Trabajo</option><option>Finanzas</option><option>Aprendizaje</option><option>Personal</option><option>Salud</option></select><select value={taskDraft.due} onChange={e=>setTaskDraft({...taskDraft,due:e.target.value})}><option>Hoy</option><option>Mañana</option><option>Esta semana</option><option>Este mes</option><option>Futuro</option></select><select value={taskDraft.priority} onChange={e=>setTaskDraft({...taskDraft,priority:e.target.value})}><option>Alta</option><option>Media</option><option>Baja</option></select></div><div className='modalActions'><button className='soft' onClick={closeTaskForm}>Cancelar</button><button className='btn' onClick={saveTask}>{editingTaskId?'Guardar cambios':'Guardar tarea'}</button></div></div></div>}</div>)}