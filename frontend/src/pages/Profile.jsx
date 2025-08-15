import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { api } = useAuth();
  const [me, setMe] = useState(null);
  const [bio, setBio] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [skills, setSkills] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { (async () => {
    const { data } = await api.get('/users/me');
    setMe(data);
    setBio(data.bio || '');
    setLinkedin(data.linkedin || '');
    setSkills((data.skills || []).join(', '));
  })() }, []);

  async function save() {
    setMsg('');
    const payload = { bio, linkedin, skills: skills.split(',').map(s=>s.trim()).filter(Boolean) };
    const { data } = await api.put('/users/me', payload);
    setMe(data); setMsg('Saved');
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-3">
      <h2 className="text-xl font-semibold">My Profile</h2>
      <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Bio" className="w-full p-2 rounded border bg-white dark:bg-gray-800 h-24" />
      <input value={linkedin} onChange={e=>setLinkedin(e.target.value)} placeholder="LinkedIn URL" className="w-full p-2 rounded border bg-white dark:bg-gray-800" />
      <input value={skills} onChange={e=>setSkills(e.target.value)} placeholder="Skills (comma separated)" className="w-full p-2 rounded border bg-white dark:bg-gray-800" />
      {msg && <div className="text-green-600 text-sm">{msg}</div>}
      <button onClick={save} className="px-4 py-2 rounded bg-indigo-600 text-white">Save</button>
    </div>
  );
}
