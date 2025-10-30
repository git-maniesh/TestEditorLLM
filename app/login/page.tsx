
'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e:any) {
    e.preventDefault();
    const res = await signIn('credentials', { redirect:false, email, password });
    if (!res?.error) router.push('/');
    else alert('Invalid credentials');
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={submit} className="bg-slate-900 p-6 rounded space-y-3">
        <h3>Login</h3>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="p-2 rounded bg-slate-800" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="p-2 rounded bg-slate-800" />
        <button className="btn" type="submit">Sign in</button>
      </form>
    </div>
  );
}
