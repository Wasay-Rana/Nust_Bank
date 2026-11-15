'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Question } from '@/lib/types';
import { SubjectBadge } from './SubjectBadge';

interface Props {
  question: Question;
  onAnswer: (chosen: number, ms: number) => void;
  instant?: boolean;        // show feedback immediately
  showResult?: boolean;     // already answered (review mode)
  chosen?: number;          // pre-selected answer (review mode)
  hideExplanation?: boolean;
}

const optionLabels = ['A', 'B', 'C', 'D'];

export function QuestionCard({ question: q, onAnswer, instant = true, showResult = false, chosen = -1, hideExplanation = false }: Props) {
  const [selected, setSelected] = useState<number>(chosen);
  const [revealed, setRevealed] = useState(showResult);
  const [startMs] = useState(() => Date.now());

  useEffect(() => {
    setSelected(chosen);
    setRevealed(showResult);
  }, [q.id, chosen, showResult]);

  const pick = useCallback((i: number) => {
    if (revealed) return;
    setSelected(i);
    if (instant) {
      setRevealed(true);
      onAnswer(i, Date.now() - startMs);
    }
  }, [revealed, instant, onAnswer, startMs]);

  const submit = () => {
    if (selected === -1 || revealed) return;
    setRevealed(true);
    onAnswer(selected, Date.now() - startMs);
  };

  const optionClass = (i: number) => {
    const base = 'flex items-start gap-3 p-3.5 rounded-xl border text-sm cursor-pointer select-none transition-all';
    if (!revealed) {
      return `${base} ${selected === i
        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30'
        : 'border-transparent hover:border-gray-300 dark:hover:border-white/20'
      }`;
    }
    if (i === q.answer) return `${base} border-green-500 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200`;
    if (i === selected && i !== q.answer) return `${base} border-red-400 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300`;
    return `${base} border-transparent opacity-50`;
  };

  return (
    <div className="rounded-2xl border p-5 fade-in" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <SubjectBadge subject={q.subject} />
        <span className="text-xs" style={{ color: 'var(--mute)' }}>{q.topic}</span>
        {q.source === 'generated' && (
          <span
            className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
            title="Written from syllabus topics, not extracted from a real past paper"
          >
            Generated
          </span>
        )}
      </div>

      <p className="text-base font-medium leading-snug mb-4" style={{ color: 'var(--ink)' }}>
        {q.question}
      </p>

      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <button key={i} className={optionClass(i)} onClick={() => pick(i)} style={{ width: '100%', textAlign: 'left', background: 'none' }}>
            <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border ${
              revealed && i === q.answer
                ? 'bg-green-500 text-white border-green-500'
                : revealed && i === selected
                  ? 'bg-red-400 text-white border-red-400'
                  : 'border-current opacity-60'
            }`}>
              {optionLabels[i]}
            </span>
            <span className="flex-1 pt-0.5">{opt}</span>
          </button>
        ))}
      </div>

      {!instant && !revealed && (
        <button
          onClick={submit}
          disabled={selected === -1}
          className="mt-4 w-full py-2.5 rounded-xl font-semibold text-sm bg-purple-600 text-white disabled:opacity-40 hover:bg-purple-700 transition-colors"
        >
          Confirm answer
        </button>
      )}

      {revealed && !hideExplanation && q.explanation && (
        <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: 'var(--bg)', color: 'var(--mute)' }}>
          <span className="font-semibold text-xs uppercase tracking-wide mr-2">Explanation</span>
          {q.explanation}
        </div>
      )}
    </div>
  );
}
