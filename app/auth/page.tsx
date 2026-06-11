'use client';

import { useState } from 'react';
import { hasSupabaseConfig, supabase } from '../../lib/supabase';

export default function AuthPage(){
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(){
    setMessage('');
    if(!hasSupabaseConfig || !supabase){
      setMessage('Supabase todavía no está configurado. Agrega las variables en Vercel para activar login real.');
      return;
    }
    if(!email || !password){
      setMessage('Escribe email y contraseña.');
      return;
    }
    setLoading(true);
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    setLoading(false);
    if(result.error){ setMessage(result.error.message); return; }
    setMessage(mode === 'login' ? 'Sesión iniciada correctamente.' : 'Cuenta creada. Revisa tu correo si Supabase pide confirmación.');
  }

  return <div className='app'>
    <div className='orb orb1'></div><div className='orb orb2'></div>
    <div className='top'>
      <div className='brand'><div className='logo'>OS</div><div><h2>LifeOS Pro</h2><div className='muted'>Acceso y registro</div></div></div>
      <a className='soft' href='/'>Volver</a>
    </div>
    <section className='hero'>
      <div className='card heroCard'>
        <span className='pill'>{hasSupabaseConfig ? 'Supabase listo' : 'Modo local'}</span>
        <h1>Accede a tu LifeOS.</h1>
        <p className='muted'>Esta pantalla prepara el login real para que después cada usuario tenga sus propias tareas, metas, finanzas, ideas y comidas.</p>
        <div className='chips'><span>🔐 Login</span><span>👤 Registro</span><span>☁️ Supabase</span></div>
      </div>
      <div className='card'>
        <div className='filters'><button className={mode==='login'?'active':''} onClick={()=>setMode('login')}>Iniciar sesión</button><button className={mode==='register'?'active':''} onClick={()=>setMode('register')}>Crear cuenta</button></div>
        <input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder='Contraseña' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
        <button className='btn' onClick={submit} disabled={loading}>{loading ? 'Procesando...' : mode==='login' ? 'Entrar' : 'Crear cuenta'}</button>
        {message && <p className='muted'>{message}</p>}
      </div>
    </section>
  </div>
}
