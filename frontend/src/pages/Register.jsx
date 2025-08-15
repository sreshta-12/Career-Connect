import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      await register(name, email, password);
      nav('/');
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    }
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-xl font-semibold mb-4">Create account</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full p-2 rounded border bg-white dark:bg-gray-800" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 rounded border bg-white dark:bg-gray-800" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full p-2 rounded border bg-white dark:bg-gray-800" />
        {err && <div className="text-red-500 text-sm">{err}</div>}
        <button className="px-4 py-2 rounded bg-indigo-600 text-white">Sign up</button>
      </form>
    </div>
  );
}
