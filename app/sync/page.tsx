'use client';

import { useEffect, useState } from 'react';
import { hasSupabaseConfig } from '../../lib/supabase';
import { getCurrentUser, loadModuleData, saveModuleData, signOut, type LifeOSModule } from '../../lib/lifeos-sync';

const modules: { module: LifeOSModule; key: string; label: string }[] = [
  { module: 'tasks', key: 'lifeos_tasks_v1', label: 'Tareas' },
  { module: 'goals', key: 'lifeos_goals_v1', label: 'Metas' },
  { module: 'finance', key: 'lifeos_finance_v1', label: 'Finanzas' },
  { module: 'ideas', key: 'lifeos_ideas_v1', label: 'Ideas' },
  { module: 'meals', key: 'lifeos_meals_v1', label: 'Comidas' },
  { module: 'profile', key: 'lifeos_profile_v1', label: 'Perfil' }
];

function readLocal(key: string){
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function SyncPage(){
  const [status, setStatus] = useState('Listo para sincronizar.');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentUser().then(user => setUserEmail(user?.email || ''));
  }, []);

  async function pushToCloud(){
    setLoading(true);
    setStatus('Subiendo datos locales a Supabase...');
    const user = await getCurrentUser();
    if(!hasSupabaseConfig || !user){
      setLoading(false);
      setStatus('Primero configura Supabase e inicia sesión en Cuenta.');
      return;
    }

    const results = [];
    for(const item of modules){
      const localData = readLocal(item.key);
      if(localData !== null){
        const result = await saveModuleData(item.module, localData);
        results.push(`${item.label}: ${result.ok ? 'guardado' : result.error}`);
      } else {
        results.push(`${item.label}: sin datos locales`);
      }
    }
    setLoading(false);
    setStatus(results.join(' · '));
  }

  async function pullFromCloud(){
    setLoading(true);
    setStatus('Cargando datos desde Supabase...');
    const user = await getCurrentUser();
    if(!hasSupabaseConfig || !user){
      setLoading(false);
      setStatus('Primero configura Supabase e inicia sesión en Cuenta.');
      return;
    }

    const results = [];
    for(const item of modules){
      const result = await loadModuleData(item.module);
      if(result.ok && result.data !== undefined){
        window.localStorage.setItem(item.key, JSON.stringify(result.data));
        results.push(`${item.label}: cargado`);
      } else {
        results.push(`${item.label}: ${result.error || 'sin datos'}`);
      }
    }
    setLoading(false);
    setStatus(results.join(' · ') + ' · Refresca la página principal para ver los cambios.');
  }

  async function logout(){
    const result = await signOut();
    setUserEmail('');
    setStatus(result.ok ? 'Sesión cerrada.' : (result.error || 'No se pudo cerrar sesión.'));
  }

  return <div className='app'>
    <div className='orb orb1'></div><div className='orb orb2'></div>
    <div className='top'>
      <div className='brand'><div className='logo'>OS</div><div><h2>LifeOS Pro</h2><div className='muted'>Sincronización de datos</div></div></div>
      <a className='soft' href='/'>Volver</a>
    </div>
    <section className='hero'>
      <div className='card heroCard'>
        <span className='pill'>{hasSupabaseConfig ? 'Supabase conectado' : 'Modo local'}</span>
        <h1>Sincroniza tu LifeOS.</h1>
        <p className='muted'>Esta pantalla prepara el paso de datos guardados en el navegador hacia Supabase por usuario.</p>
        <div className='chips'><span>☁️ Nube</span><span>💾 Local</span><span>🔐 Usuario</span></div>
      </div>
      <div className='card'>
        <h3>Estado</h3>
        <p className='muted'>{userEmail ? `Sesión activa: ${userEmail}` : 'Sin sesión activa.'}</p>
        <div className='profileCard'>
          <button className='btn' onClick={pushToCloud} disabled={loading}>Subir datos locales a nube</button>
          <button className='ghost' onClick={pullFromCloud} disabled={loading}>Cargar datos desde nube</button>
          <button className='soft' onClick={logout} disabled={loading}>Cerrar sesión</button>
          <p className='muted'>{loading ? 'Procesando...' : status}</p>
        </div>
      </div>
    </section>
    <section className='modules'>
      <div className='card wide'><h3>Módulos preparados</h3>{modules.map(item => <div className='row' key={item.module}><span>{item.label}</span><b>{item.module}</b></div>)}</div>
      <div className='card'><h3>Importante</h3><p className='muted'>Hasta configurar las variables de Supabase en Vercel, LifeOS seguirá funcionando en modo local sin perder lo ya creado.</p><a className='ghost' href='/auth'>Ir a Cuenta</a></div>
    </section>
  </div>
}
