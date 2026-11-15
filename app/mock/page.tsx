'use client';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/lib/store';
import { getBaseQuestions } from '@/lib/bank';
import { SUBJECTS, MOCK_SIZES } from '@/lib/types';
import type { SubjectKey } from '@/lib/types';
import { SubjectBadge } from '@/components/SubjectBadge';

const baseQ = getBaseQuestions();
const fmtTime = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const LABELS = ['A', 'B', 'C', 'D'];

export default function MockPage() {
  const { mock, customQuestions, startMock, answerMock, flagMock, navMock, finishMock, clearMock } = useStore();
  const [kind, setKind] = useState<'full' | 'half' | 'quick'>('half');
  const [instant, setInstant] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answerAt, setAnswerAt] = useState(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const all = [...baseQ, ...customQuestions];

  useEffect(() => {
    if (mock && !mock.done) {
      const tick = () => setTimeLeft(mock.endAt - Date.now());
      tick();
      timerRef.current = setInterval(() => {
        const left = mock.endAt - Date.now();
        setTimeLeft(left);
        if (left <= 0) finishMock();
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [mock?.endAt, mock?.done, finishMock]);

  if (!mock) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-black mb-5">Mock Exam</h1>
        <div className="rounded-2xl border p-6 space-y-4" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
          <p className="text-sm" style={{ color: 'var(--mute)' }}>
            Simulates the real NET paper: Math 40% · Physics 30% · Chemistry/CS 15% · English 10% · Intelligence 5%.
            One mark per MCQ. No negative marking.
          </p>
          <div>
            <label className="block text-sm font-semibold mb-2">Paper length</label>
            <div className="space-y-2">
              {(Object.entries(MOCK_SIZES) as [string, typeof MOCK_SIZES[keyof typeof MOCK_SIZES]][]).map(([k, v]) => (
                <label key={k} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                  style={{ borderColor: kind === k ? 'var(--pri)' : 'var(--line)', background: kind === k ? 'rgba(79,70,229,0.06)' : 'var(--card)' }}>
                  <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k as 'full' | 'half' | 'quick')} className="accent-indigo-600" />
                  <span className="text-sm font-medium">{v.label}</span>
                </label>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={instant} onChange={(e) => setInstant(e.target.checked)} className="accent-indigo-600 w-4 h-4" />
            Instant feedback (practice mode — answer locked immediately)
          </label>
          <button
            onClick={() => { startMock(kind, instant, all); setAnswerAt(Date.now()); }}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors"
          >
            Start exam →
          </button>
        </div>
      </div>
    );
  }

  if (mock.done) {
    const qs = mock.questions;
    const answered = qs.filter((q) => q.chosen !== -1);
    const correct = answered.filter((q) => q.chosen === q.answer);
    const score = correct.length;
    const bySubj: Record<string, { n: number; ok: number; skip: number }> = {};
    for (const q of qs) {
      if (!bySubj[q.subject]) bySubj[q.subject] = { n: 0, ok: 0, skip: 0 };
      bySubj[q.subject].n++;
      if (q.chosen === -1) bySubj[q.subject].skip++;
      else if (q.chosen === q.answer) bySubj[q.subject].ok++;
    }
    return (
      <div className="max-w-xl space-y-5">
        <h1 className="text-2xl font-black">Results</h1>
        <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
          <div className="text-5xl font-black">{score}</div>
          <div className="text-sm opacity-80">/ {qs.length} · scaled: {Math.round((score / qs.length) * 200)}/200</div>
          <div className="text-sm mt-1 opacity-70">{correct.length} correct · {qs.length - answered.length} skipped</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.keys(SUBJECTS) as SubjectKey[]).map((s) => {
            const b = bySubj[s] || { n: 0, ok: 0, skip: 0 };
            return (
              <div key={s} className="rounded-xl border p-4" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
                <SubjectBadge subject={s} />
                <div className="text-2xl font-black mt-2">{b.n ? `${Math.round((b.ok / b.n) * 100)}%` : '—'}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--mute)' }}>{b.ok}/{b.n} · {b.skip} skipped</div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3">
          <button onClick={clearMock} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors">
            New exam
          </button>
          <a href="/review" className="flex-1 py-3 rounded-xl border font-bold text-sm text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors" style={{ color: 'var(--ink)', borderColor: 'var(--line)' }}>
            Review mistakes
          </a>
        </div>
      </div>
    );
  }

  // Exam in progress
  const q = mock.questions[mock.idx];
  const answered = q.chosen !== -1;
  const revealed = instant && answered;
  const remaining = mock.questions.length - mock.questions.filter((x) => x.chosen !== -1).length;

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <div className="text-xs font-semibold mb-1" style={{ color: 'var(--mute)' }}>
            Q{mock.idx + 1}/{mock.questions.length} · {remaining} unanswered
          </div>
          <div className="h-1.5 rounded-full" style={{ background: 'var(--line)' }}>
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${((mock.idx + 1) / mock.questions.length) * 100}%` }}
            />
          </div>
        </div>
        <div className={`text-sm font-mono font-bold px-3 py-1 rounded-lg ${timeLeft < 300_000 ? 'text-red-500 bg-red-50 dark:bg-red-950/20' : ''}`}>
          {fmtTime(timeLeft)}
        </div>
      </div>

      {/* Question */}
      <div className="rounded-2xl border p-5 mb-4" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <SubjectBadge subject={q.subject} />
          <span className="text-xs" style={{ color: 'var(--mute)' }}>{q.topic}</span>
          {q.flagged && <span className="text-xs font-bold text-amber-500">⚑ Flagged</span>}
        </div>
        <p className="font-medium mb-4" style={{ color: 'var(--ink)' }}>{q.question}</p>
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            let cls = 'flex items-start gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-all w-full text-left';
            if (!revealed) {
              cls += q.chosen === i
                ? ' border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                : ' border-transparent hover:border-gray-300 dark:hover:border-white/20';
            } else {
              if (i === q.answer) cls += ' border-green-500 bg-green-50 dark:bg-green-950/30';
              else if (i === q.chosen) cls += ' border-red-400 bg-red-50 dark:bg-red-950/30';
              else cls += ' border-transparent opacity-40';
            }
            return (
              <button key={i} className={cls} style={{ background: 'none' }}
                onClick={() => {
                  if (answered && !instant) return;
                  if (!answered) {
                    answerMock(i, Date.now() - answerAt);
                    if (instant) setAnswerAt(Date.now());
                  }
                }}>
                <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-md border text-xs font-bold">{LABELS[i]}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
        {revealed && q.explanation && (
          <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: 'var(--bg)', color: 'var(--mute)' }}>
            {q.explanation}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-5">
        <button onClick={() => navMock(Math.max(0, mock.idx - 1))} disabled={mock.idx === 0}
          className="px-4 py-2 rounded-xl border text-sm font-semibold disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          style={{ color: 'var(--ink)', borderColor: 'var(--line)' }}>← Prev</button>
        <button onClick={flagMock}
          className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${q.flagged ? 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/20' : ''}`}
          style={!q.flagged ? { color: 'var(--mute)', borderColor: 'var(--line)' } : undefined}>
          ⚑ {q.flagged ? 'Flagged' : 'Flag'}
        </button>
        <button onClick={() => { navMock(Math.min(mock.questions.length - 1, mock.idx + 1)); setAnswerAt(Date.now()); }}
          className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors">
          {mock.idx === mock.questions.length - 1 ? 'Review →' : 'Next →'}
        </button>
        <button onClick={finishMock}
          className="px-4 py-2 rounded-xl border text-sm font-semibold text-red-500 border-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
          Finish
        </button>
      </div>

      {/* Palette */}
      <div className="rounded-xl border p-3" style={{ borderColor: 'var(--line)' }}>
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--mute)' }}>Question palette</div>
        <div className="flex flex-wrap gap-1">
          {mock.questions.map((mq, i) => (
            <button key={i} onClick={() => navMock(i)}
              className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                i === mock.idx ? 'bg-indigo-600 text-white' :
                mq.flagged ? 'bg-amber-400 text-white' :
                mq.chosen !== -1 ? 'bg-green-100 text-green-700 dark:bg-green-950/30' :
                'bg-gray-100 dark:bg-white/5 text-gray-500'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
