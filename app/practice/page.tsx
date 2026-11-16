'use client';
import { useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useStore } from '@/lib/store';
import { getBaseQuestions, pickQuestion, topicsOf } from '@/lib/bank';
import { SUBJECTS, BONUS_SUBJECTS, ALL_SUBJECT_INFO } from '@/lib/types';
import type { SubjectKey, Question } from '@/lib/types';
import { QuestionCard } from '@/components/QuestionCard';
import { SubjectBadge } from '@/components/SubjectBadge';

const baseQuestions = getBaseQuestions();

function PracticeInner() {
  const sp = useSearchParams();
  const initSubject = (sp.get('subject') as SubjectKey | 'all') || 'all';
  const initTopic = sp.get('topic') || '';

  const [subject, setSubject] = useState<SubjectKey | 'all'>(initSubject);
  const [topic, setTopic] = useState(initTopic);
  const [src, setSrc] = useState<'mix' | 'bank' | 'err'>('mix');

  const { customQuestions, errors, recordAnswer } = useStore();
  const all = [...baseQuestions, ...customQuestions];

  const recentIds = useRef<string[]>([]);
  const seenCounts = useRef<Record<string, number>>({});

  const pickNext = useCallback((): Question | null => {
    if (src === 'err') {
      const errQs = Object.values(errors).map((e) => e.q);
      if (!errQs.length) return null;
      return errQs[Math.floor(Math.random() * errQs.length)];
    }

    let subj = subject;
    if (subj === 'all') {
      const r = Math.random() * 100;
      subj = r < 50 ? 'math' : r < 80 ? 'phy' : 'eng'; // matches real paper weighting 50/30/20
    }
    return pickQuestion(all, subj, topic || undefined, recentIds.current, seenCounts.current);
  }, [subject, topic, src, all, errors]);

  const [current, setCurrent] = useState<Question | null>(() => pickNext());
  const [streak, setStreak] = useState(0);
  const [sessionStats, setSessionStats] = useState({ n: 0, ok: 0 });

  const advance = useCallback(() => {
    const q = pickNext();
    setCurrent(q);
  }, [pickNext]);

  const handleAnswer = useCallback((q: Question, chosen: number, ms: number) => {
    recordAnswer(q, chosen, ms);
    seenCounts.current[q.id] = (seenCounts.current[q.id] || 0) + 1;
    recentIds.current.push(q.id);
    if (recentIds.current.length > 20) recentIds.current.shift();
    const ok = chosen === q.answer;
    setStreak((s) => (ok ? s + 1 : 0));
    setSessionStats((s) => ({ n: s.n + 1, ok: s.ok + (ok ? 1 : 0) }));
  }, [recordAnswer]);

  const topics = subject !== 'all' ? topicsOf(all, subject) : [];

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black mb-5">Practice</h1>

      {/* Controls */}
      <div className="rounded-2xl border p-4 mb-5 space-y-3" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
        {/* Subject chips — real paper subjects */}
        <div className="flex flex-wrap gap-2">
          {(['all', ...Object.keys(SUBJECTS)] as Array<'all' | SubjectKey>).map((s) => (
            <button
              key={s}
              onClick={() => { setSubject(s); setTopic(''); setCurrent(pickQuestion(all, s, undefined, [], {})); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                subject === s
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-gray-200 dark:border-white/10 hover:border-indigo-400'
              }`}
              style={subject !== s ? { color: 'var(--mute)' } : undefined}
            >
              {s === 'all' ? 'All subjects' : ALL_SUBJECT_INFO[s as SubjectKey].name}
            </button>
          ))}
        </div>

        {/* Bonus subjects — not on the real paper, kept for extra practice */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--mute)' }}>
            Bonus (not on your paper)
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(BONUS_SUBJECTS) as SubjectKey[]).map((s) => (
              <button
                key={s}
                onClick={() => { setSubject(s); setTopic(''); setCurrent(pickQuestion(all, s, undefined, [], {})); }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  subject === s
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'border-gray-200 dark:border-white/10 hover:border-rose-400'
                }`}
                style={subject !== s ? { color: 'var(--mute)' } : undefined}
              >
                {ALL_SUBJECT_INFO[s].name}
              </button>
            ))}
          </div>
        </div>

        {/* Topic select */}
        {topics.length > 0 && (
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full text-sm rounded-xl border px-3 py-2"
            style={{ background: 'var(--card)', borderColor: 'var(--line)', color: 'var(--ink)' }}
          >
            <option value="">All topics</option>
            {topics.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        )}

        {/* Source */}
        <div className="flex gap-2">
          {(['mix', 'bank', 'err'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSrc(s)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                src === s ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 dark:border-white/10'
              }`}
              style={src !== s ? { color: 'var(--mute)' } : undefined}
            >
              {s === 'mix' ? 'Mixed' : s === 'bank' ? 'Bank only' : `Mistakes (${Object.keys(errors).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Session stats */}
      {sessionStats.n > 0 && (
        <div className="flex items-center gap-4 mb-4 text-sm" style={{ color: 'var(--mute)' }}>
          <span>Correct: {sessionStats.ok}/{sessionStats.n}</span>
          <span>Streak: {streak}</span>
          <span>{Math.round((sessionStats.ok / sessionStats.n) * 100)}%</span>
        </div>
      )}

      {/* Question */}
      {current ? (
        <div>
          <QuestionCard
            key={current.id}
            question={current}
            onAnswer={(chosen, ms) => handleAnswer(current, chosen, ms)}
            instant
          />
          <button
            onClick={advance}
            className="mt-4 w-full py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Next question
          </button>
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
          <div className="font-semibold">No questions match this filter</div>
          <div className="text-sm mt-1" style={{ color: 'var(--mute)' }}>Try a broader subject or topic</div>
        </div>
      )}
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense>
      <PracticeInner />
    </Suspense>
  );
}
