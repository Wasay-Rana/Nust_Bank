'use client';
import { useMemo, useState } from 'react';
import vaultData from '@/data/vault.json';
import type { VaultCard } from '@/lib/types';
import { ALL_SUBJECT_INFO } from '@/lib/types';

const vault = vaultData as VaultCard[];
const subjects = ['all', ...Object.keys(ALL_SUBJECT_INFO)];

const accentFor: Record<string, string> = {
  math:  '#2563eb',
  phy:   '#0d9488',
  eng:   '#d97706',
  chem:  '#e11d48',
  intel: '#7c3aed',
};

const chipFor: Record<string, string> = {
  math:  'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  phy:   'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300',
  eng:   'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  chem:  'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  intel: 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
};

// Split a formula block into individual lines, then individual clauses within a line.
function splitBody(body: string): string[] {
  return body
    .split('\n')
    .flatMap((line) => line.split(' · '))
    .map((s) => s.trim())
    .filter(Boolean);
}

function FormulaLine({ text }: { text: string }) {
  // Lines that read like plain sentences (end in a word, start with a capital, contain no '=' or operator chains)
  // are rendered as prose; lines with math content get the monospace formula treatment.
  const looksLikeFormula = /[=<>≤≥]/.test(text) || /[+\-*/^²³⁻¹⁰ⁿᵣθαβπ]/.test(text);

  if (!looksLikeFormula) {
    return (
      <p className="text-sm leading-relaxed" style={{ color: 'var(--mute)' }}>
        {text}
      </p>
    );
  }

  return (
    <div
      className="rounded-lg px-3 py-2 text-[13px] leading-[1.6] font-mono tracking-tight"
      style={{ background: 'var(--bg)', color: 'var(--ink)' }}
    >
      {text}
    </div>
  );
}

export default function VaultPage() {
  const [subject, setSubject] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      vault.filter(
        (v) =>
          (subject === 'all' || v.subject === subject) &&
          (!search || `${v.title} ${v.body} ${v.group}`.toLowerCase().includes(search.toLowerCase())),
      ),
    [subject, search],
  );

  const seen: Record<string, true> = {};
  const groups = filtered.map((v) => v.group).filter((g) => {
    if (seen[g]) return false;
    seen[g] = true;
    return true;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black mb-1" style={{ color: 'var(--ink)' }}>Formula Vault</h1>
        <p className="text-sm" style={{ color: 'var(--mute)' }}>
          {vault.length} quick-reference cards · search or filter by subject
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-6 sticky top-0 z-10 py-2 -mx-1 px-1" style={{ background: 'var(--bg)' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search formulas, topics…"
          className="flex-1 min-w-[200px] px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2"
          style={{ background: 'var(--card)', borderColor: 'var(--line)', color: 'var(--ink)' }}
        />
        <div className="flex flex-wrap gap-1.5">
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className="px-3 py-2 rounded-lg text-sm font-medium border transition-colors"
              style={
                subject === s
                  ? { color: 'var(--pri-ink)', background: 'var(--pri)', borderColor: 'var(--pri)' }
                  : { color: 'var(--mute)', borderColor: 'var(--line)', background: 'var(--card)' }
              }
            >
              {s === 'all' ? 'All' : ALL_SUBJECT_INFO[s as keyof typeof ALL_SUBJECT_INFO]?.name || s}
            </button>
          ))}
        </div>
      </div>

      {/* Cards by group */}
      {groups.map((group) => {
        const cards = filtered.filter((v) => v.group === group);
        return (
          <div key={group} className="mb-8">
            <div className="flex items-baseline gap-2 mb-3">
              <h2 className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{group}</h2>
              <span className="text-xs" style={{ color: 'var(--mute)' }}>{cards.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {cards.map((v, i) => (
                <div
                  key={i}
                  className="rounded-xl border overflow-hidden transition-shadow hover:shadow-md"
                  style={{ background: 'var(--card)', borderColor: 'var(--line)' }}
                >
                  <div className="h-[3px]" style={{ background: accentFor[v.subject] || 'var(--pri)' }} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="font-bold text-sm leading-snug" style={{ color: 'var(--ink)' }}>{v.title}</div>
                      <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${chipFor[v.subject] || ''}`}>
                        {ALL_SUBJECT_INFO[v.subject as keyof typeof ALL_SUBJECT_INFO]?.name.split(' ')[0] || v.subject}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {splitBody(v.body).map((line, j) => (
                        <FormulaLine key={j} text={line} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="text-center py-20 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
          <div className="font-semibold" style={{ color: 'var(--ink)' }}>No results</div>
          <div className="text-sm mt-1" style={{ color: 'var(--mute)' }}>Try a different search term or subject</div>
        </div>
      )}
    </div>
  );
}
