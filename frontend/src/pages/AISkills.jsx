import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AISkills() {
  const { api } = useAuth();
  const [text, setText] = useState('I worked with React, Node, MongoDB and AWS to build scalable apps.');
  const [extracted, setExtracted] = useState([]);
  const [userSkills, setUserSkills] = useState('react, node, mongo, aws');
  const [jobSkills, setJobSkills] = useState('react, node, tailwind');

  async function extract() {
    const { data } = await api.post('/ai/extract', { text });
    setExtracted(data.skills);
  }
  async function match() {
    const { data } = await api.post('/ai/match', {
      userSkills: userSkills.split(',').map(s=>s.trim()),
      jobSkills: jobSkills.split(',').map(s=>s.trim())
    });
    alert(`Match score: ${(data.score*100).toFixed(0)}%`);
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-4">
      <h2 className="text-xl font-semibold">AI Tools</h2>
      <div className="space-y-2">
        <div className="text-sm font-medium">Skill Extraction</div>
        <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full p-2 rounded border bg-white dark:bg-gray-800 h-28" />
        <button onClick={extract} className="px-3 py-1 rounded bg-indigo-600 text-white">Extract</button>
        <div className="text-sm mt-2">Found: {extracted.join(', ') || '—'}</div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Job ↔ Profile Match</div>
        <input value={userSkills} onChange={e=>setUserSkills(e.target.value)} className="w-full p-2 rounded border bg-white dark:bg-gray-800" />
        <input value={jobSkills} onChange={e=>setJobSkills(e.target.value)} className="w-full p-2 rounded border bg-white dark:bg-gray-800" />
        <button onClick={match} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-800">Compute Match</button>
      </div>
    </div>
  );
}
