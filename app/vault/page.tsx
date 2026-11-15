'use client';
import { useState } from 'react';
import vaultData from '@/data/vault.json';
import type { VaultCard } from '@/lib/types';
import { SUBJECTS } from '@/lib/types';

const vault = vaultData as VaultCard[];
const subjects = ['all', ...Object.keys(SUBJECTS)];

export default function VaultPage() {
  const [subject, setSubject] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = vault.filter(
    (v) =>
      (subject === 'all' || v.subject === subject) &&
      (!search || `${v.title} ${v.body} ${v.group}`.toLowerCase().includes(search.toLowerCase())),
  );

  const seen: Record<string, true> = {};
  const groups = filtered.map((v) => v.group).filter((g) => { if (seen[g]) return false; seen[g] = true; return true; });

  const colorFor: Record<string, string> = {
    math: 'text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/60',
    phy:  'text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/60',
    eng:  'text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/60',
    chem: 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/60',
    intel:'text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/60',
  };

  return (
    <div>
      <h1 className="text-2xl font-black mb-5">Formula & Shortcut Vault</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search formulas…"
          className="flex-1 min-w-[180px] px-3 py-2 rounded-xl border text-sm"
          style={{ background: 'var(--card)', borderColor: 'var(--line)', color: 'var(--ink)' }}
        />
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => setSubject(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              subject === s ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 dark:border-white/10'
            }`}
            style={subject !== s ? { color: 'var(--mute)' } : undefined}
          >
            {s === 'all' ? 'All' : SUBJECTS[s as keyof typeof SUBJECTS]?.name || s}
          </button>
        ))}
      </div>

      {/* Cards by group */}
      {groups.map((group) => (
        <div key={group} className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--mute)' }}>{group}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.filter((v) => v.group === group).map((v, i) => (
              <div key={i} className={`rounded-xl border p-4 ${colorFor[v.subject] || ''}`}
                style={{ background: 'var(--card)' }}>
                <div className="font-bold text-sm mb-2">{v.title}</div>
                <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono" style={{ color: 'var(--mute)' }}>{v.body}</pre>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-16 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
          <div className="text-4xl mb-3">🔍</div>
          <div className="font-semibold">No results</div>
        </div>
      )}
    </div>
  );
}
