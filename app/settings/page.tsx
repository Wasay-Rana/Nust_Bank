'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import type { Question } from '@/lib/types';

export default function SettingsPage() {
  const { settings, setTargetScore, addCustomQuestions, clearErrors, customQuestions } = useStore();
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState('');
  const [pushStatus, setPushStatus] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText);
      const qs: Question[] = Array.isArray(parsed) ? parsed : parsed.questions;
      if (!qs?.length) { setImportStatus('No questions found'); return; }
      addCustomQuestions(qs);
      setImportStatus(`Added ${qs.length} question(s). Total custom: ${customQuestions.length + qs.length}`);
      setImportText('');
    } catch {
      setImportStatus('Invalid JSON');
    }
  };

  const handlePushToApi = async () => {
    if (!apiUrl || !apiKey) { setPushStatus('Fill in URL and key'); return; }
    if (!customQuestions.length) { setPushStatus('No custom questions to push'); return; }
    setPushStatus('Pushing…');
    try {
      const res = await fetch(`${apiUrl}/api/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ questions: customQuestions }),
      });
      const data = await res.json();
      if (!res.ok) setPushStatus(`Error: ${data.error}`);
      else setPushStatus(data.message);
    } catch {
      setPushStatus('Network error');
    }
  };

  const exportCustom = () => {
    const blob = new Blob([JSON.stringify(customQuestions, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `nust-custom-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="max-w-xl space-y-5">
      <h1 className="text-2xl font-black">Settings</h1>

      {/* Target */}
      <section className="rounded-2xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
        <h2 className="font-bold mb-3">Target score: <span className="text-indigo-600">{settings.targetScore}</span></h2>
        <input type="range" min={100} max={200} value={settings.targetScore}
          onChange={(e) => setTargetScore(Number(e.target.value))}
          className="w-full accent-indigo-600" />
        <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--mute)' }}>
          <span>100</span><span>150</span><span>180</span><span>200</span>
        </div>
      </section>

      {/* Import questions */}
      <section className="rounded-2xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
        <h2 className="font-bold mb-1">Import questions (JSON)</h2>
        <p className="text-xs mb-3" style={{ color: 'var(--mute)' }}>
          Paste a JSON array of questions. Each needs: subject, topic, question, options (4), answer (0–3).
        </p>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          rows={6}
          placeholder={'[\n  {\n    "subject": "math",\n    "topic": "Calculus",\n    "question": "d/dx (sin x) = ?",\n    "options": ["cos x", "-cos x", "tan x", "-sin x"],\n    "answer": 0,\n    "explanation": "Standard derivative."\n  }\n]'}
          className="w-full text-xs rounded-xl border p-3 font-mono"
          style={{ background: 'var(--bg)', borderColor: 'var(--line)', color: 'var(--ink)', resize: 'vertical' }}
        />
        <div className="flex gap-2 mt-2">
          <button onClick={handleImport} className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold">
            Import
          </button>
          {customQuestions.length > 0 && (
            <button onClick={exportCustom} className="px-4 py-2 rounded-xl border text-sm font-semibold" style={{ color: 'var(--ink)', borderColor: 'var(--line)' }}>
              Export ({customQuestions.length})
            </button>
          )}
        </div>
        {importStatus && <p className="text-xs mt-2" style={{ color: 'var(--mute)' }}>{importStatus}</p>}
      </section>

      {/* API push */}
      <section className="rounded-2xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
        <h2 className="font-bold mb-1">Push to deployed API</h2>
        <p className="text-xs mb-3" style={{ color: 'var(--mute)' }}>
          Push your locally imported questions to the Vercel KV bank so they're available on all devices.
        </p>
        <input value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} placeholder="https://your-app.vercel.app"
          className="w-full text-sm rounded-xl border px-3 py-2 mb-2"
          style={{ background: 'var(--bg)', borderColor: 'var(--line)', color: 'var(--ink)' }} />
        <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} type="password" placeholder="API key"
          className="w-full text-sm rounded-xl border px-3 py-2 mb-2"
          style={{ background: 'var(--bg)', borderColor: 'var(--line)', color: 'var(--ink)' }} />
        <button onClick={handlePushToApi}
          className="w-full py-2 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors">
          Push {customQuestions.length} custom question(s) →
        </button>
        {pushStatus && <p className="text-xs mt-2" style={{ color: 'var(--mute)' }}>{pushStatus}</p>}
      </section>

      {/* Danger zone */}
      <section className="rounded-2xl border border-red-200 dark:border-red-900/50 p-5">
        <h2 className="font-bold text-red-600 mb-3">Danger zone</h2>
        <button onClick={() => { if (confirm('Clear all mistake history?')) clearErrors(); }}
          className="w-full py-2 rounded-xl border border-red-300 text-red-500 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
          Clear mistake history
        </button>
      </section>
    </div>
  );
}
