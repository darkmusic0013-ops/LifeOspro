'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LockKeyhole, Mail } from 'lucide-react';
import { createSupabaseBrowserClient } from '../../lib/supabase/client';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

export default function AuthPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setMessage('');

    if (!supabase) {
      setMessage('Supabase no esta configurado en Vercel. Agrega NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.');
      return;
    }

    if (!email) {
      setMessage('Escribe tu email.');
      return;
    }

    if (mode !== 'reset' && !password) {
      setMessage('Escribe tu contrasena.');
      return;
    }

    setLoading(true);

    if (mode === 'reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth` });
      setLoading(false);
      setMessage(error ? error.message : 'Te enviamos un correo para recuperar tu contrasena.');
      return;
    }

    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    if (mode === 'register') {
      setMessage('Cuenta creada. Revisa tu correo si Supabase pide confirmacion.');
      return;
    }

    router.push('/dashboard');
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#FBFBFA] px-4 py-10 text-[#37352F]">
      <div className="grid w-full max-w-5xl grid-cols-[1.1fr_0.9fr] gap-6 max-lg:grid-cols-1">
        <Card className="flex flex-col justify-between">
          <div>
            <span className="inline-flex rounded-full bg-[#EEEDFE] px-3 py-1 text-xs font-semibold text-[#534AB7]">LifeOS Pro Auth</span>
            <h1 className="mt-5 text-4xl font-bold tracking-[-0.03em] text-[#37352F]">Accede a tu sistema operativo personal.</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#9B9A97]">Login, registro y recuperacion de contrasena conectados a Supabase Auth. Esta es la base para que cada usuario tenga sus propias misiones, metas, finanzas e ideas.</p>
          </div>
          <a href="/" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#534AB7]"><ArrowLeft className="h-4 w-4" />Volver al inicio</a>
        </Card>

        <Card>
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#F1F1EF] p-1">
            <button onClick={() => setMode('login')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === 'login' ? 'bg-white text-[#37352F]' : 'text-[#9B9A97]'}`}>Login</button>
            <button onClick={() => setMode('register')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === 'register' ? 'bg-white text-[#37352F]' : 'text-[#9B9A97]'}`}>Registro</button>
            <button onClick={() => setMode('reset')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === 'reset' ? 'bg-white text-[#37352F]' : 'text-[#9B9A97]'}`}>Reset</button>
          </div>

          <div className="mt-6 grid gap-3">
            <label className="grid gap-2 text-sm font-semibold text-[#37352F]">
              Email
              <div className="flex items-center gap-2 rounded-lg border border-black/5 bg-white px-3">
                <Mail className="h-4 w-4 text-[#9B9A97]" />
                <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tu@email.com" className="h-11 flex-1 bg-transparent text-sm outline-none" />
              </div>
            </label>

            {mode !== 'reset' && (
              <label className="grid gap-2 text-sm font-semibold text-[#37352F]">
                Contrasena
                <div className="flex items-center gap-2 rounded-lg border border-black/5 bg-white px-3">
                  <LockKeyhole className="h-4 w-4 text-[#9B9A97]" />
                  <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimo 6 caracteres" type="password" className="h-11 flex-1 bg-transparent text-sm outline-none" />
                </div>
              </label>
            )}

            <Button variant="primary" onClick={submit} className="mt-2 w-full" disabled={loading}>{loading ? 'Procesando...' : mode === 'login' ? 'Entrar' : mode === 'register' ? 'Crear cuenta' : 'Enviar recuperacion'}</Button>
            {message && <p className="rounded-lg bg-[#F7F6F4] p-3 text-sm text-[#5F5E5B]">{message}</p>}
          </div>
        </Card>
      </div>
    </main>
  );
}
