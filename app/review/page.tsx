'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { QuestionCard } from '@/components/QuestionCard';
import { SubjectBadge } from '@/components/SubjectBadge';
import type { SubjectKey } from '@/lib/types';

export default function ReviewPage() {
  const { errors, clearErrors, recordAnswer } = useStore();
  const list = Object.values(errors).sort((a, b) => b.n - a.n);
  const [mode, setMode] = useState<'list' | 'drill'>('list');
  const [idx, setIdx] = useState(0);

  if (!list.length) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-black mb-5">Review</h1>
        <div className="rounded-2xl border p-10 text-center" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
          <div className="font-bold text-lg">No mistakes!</div>
          <div className="text-sm mt-1" style={{ color: 'var(--mute)' }}>Keep answering practice questions to build your mistake list.</div>
        </div>
      </div>
    );
  }

  if (mode === 'drill') {
    const q = list[idx]?.q;
    if (!q) return null;
    return (
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setMode('list')} className="text-sm font-semibold" style={{ color: 'var(--pri)' }}>← Back to list</button>
          <span className="text-sm" style={{ color: 'var(--mute)' }}>{idx + 1} / {list.length}</span>
        </div>
        <QuestionCard
          key={q.id}
          question={q}
          onAnswer={(chosen, ms) => {
            recordAnswer(q, chosen, ms);
            setTimeout(() => setIdx((i) => Math.min(i + 1, list.length - 1)), 1200);
          }}
          instant
        />
        <div className="flex gap-2 mt-4">
          <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0}
            className="px-4 py-2 rounded-xl border text-sm disabled:opacity-30" style={{ color: 'var(--ink)', borderColor: 'var(--line)' }}>← Prev</button>
          <button onClick={() => setIdx((i) => Math.min(list.length - 1, i + 1))} disabled={idx === list.length - 1}
            className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold">Next →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-black">Mistakes · {list.length}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setIdx(0); setMode('drill'); }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors"
          >
            Drill all →
          </button>
          <button
            onClick={() => { if (confirm('Clear all mistakes?')) clearErrors(); }}
            className="px-4 py-2 rounded-xl border text-sm font-semibold text-red-500 border-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {list.map(({ q, n }, i) => (
          <div key={q.id} className="rounded-2xl border p-4" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <SubjectBadge subject={q.subject as SubjectKey} />
                  <span className="text-xs" style={{ color: 'var(--mute)' }}>{q.topic}</span>
                  {n > 1 && <span className="text-xs font-bold text-red-500">missed {n}×</span>}
                </div>
                <p className="text-sm font-medium line-clamp-2">{q.question}</p>
              </div>
              <button
                onClick={() => { setIdx(i); setMode('drill'); }}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
              >
                Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
