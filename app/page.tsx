'use client';
import Link from 'next/link';
import { useStore, subjStats, projectedScore, weakTopics } from '@/lib/store';
import { SUBJECTS } from '@/lib/types';
import type { SubjectKey } from '@/lib/types';
import { SubjectBadge } from '@/components/SubjectBadge';
import { getBaseQuestions } from '@/lib/bank';

const allQ = getBaseQuestions();
const bankCounts: Record<string, number> = {};
allQ.forEach((q) => { bankCounts[q.subject] = (bankCounts[q.subject] || 0) + 1; });

const subjectColors: Record<SubjectKey, string> = {
  math: '#7c3aed', phy: '#9333ea', eng: '#c026d3', chem: '#db2777', intel: '#e11d48',
};

export default function Dashboard() {
  const { log, errors, customQuestions } = useStore();
  const projected = projectedScore(log);
  const weak = weakTopics(log);
  const errorCount = Object.keys(errors).length;
  const target = useStore((s) => s.settings.targetScore);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 text-white"
        style={{
          background: 'linear-gradient(135deg, #581c87, #7c3aed 55%, #a21caf)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 20px 50px -20px rgba(124,58,237,0.5)',
        }}
      >
        <div
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)' }}
        />
        <div className="text-sm font-medium opacity-80 mb-1">Projected score</div>
        <div className="text-6xl font-black leading-none mb-1 tracking-tight">{projected || '—'}</div>
        <div className="text-sm opacity-70">/ 200 · target {target}+</div>
        {projected > 0 && (
          <div className="mt-3 h-2 rounded-full bg-white/25 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${Math.min(100, (projected / 200) * 100)}%` }}
            />
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/practice" className="bg-white text-purple-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-50 transition-colors">
            Practice now
          </Link>
          <Link href="/mock" className="border border-white/40 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors">
            Start mock exam
          </Link>
        </div>
      </div>

      {/* Subject stats */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--mute)' }}>
          Subject Performance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(Object.entries(SUBJECTS) as [SubjectKey, (typeof SUBJECTS)[keyof typeof SUBJECTS]][]).map(([s, cfg]) => {
            const st = subjStats(log, s);
            const acc = st.acc;
            return (
              <div key={s} className="rounded-2xl border p-4" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
                <div className="flex items-center justify-between mb-2">
                  <SubjectBadge subject={s} />
                  <span className="text-xs" style={{ color: 'var(--mute)' }}>{bankCounts[s] || 0} Qs</span>
                </div>
                <div className="text-3xl font-black mb-1" style={{ color: subjectColors[s] }}>
                  {acc !== null ? `${Math.round(acc * 100)}%` : '—'}
                </div>
                <div className="h-1.5 rounded-full mb-2" style={{ background: 'var(--line)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(acc ?? 0) * 100}%`, background: subjectColors[s] }}
                  />
                </div>
                <div className="text-xs" style={{ color: 'var(--mute)' }}>
                  {st.n} answered · {cfg.weight}% of paper
                  {st.avgSec !== null && ` · ${st.avgSec.toFixed(0)}s avg`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Questions answered', value: log.length },
          { label: 'Mistakes to review', value: errorCount },
          { label: 'Custom questions', value: customQuestions.length },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border p-4 text-center" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
            <div className="text-3xl font-black">{value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--mute)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Weak topics */}
      {weak.length > 0 && (
        <div className="rounded-2xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
          <h2 className="font-bold mb-4">Weak topics — drill these</h2>
          <div className="space-y-3">
            {weak.map((t) => (
              <div key={`${t.subject}-${t.topic}`} className="flex items-center gap-3">
                <SubjectBadge subject={t.subject} />
                <span className="flex-1 text-sm truncate">{t.topic}</span>
                <div className="w-24 h-1.5 rounded-full" style={{ background: 'var(--line)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${t.acc * 100}%`,
                      background: t.acc < 0.6 ? '#dc2626' : t.acc < 0.85 ? '#d97706' : '#16a34a',
                    }}
                  />
                </div>
                <span className="text-xs font-mono w-9 text-right" style={{ color: 'var(--mute)' }}>
                  {Math.round(t.acc * 100)}%
                </span>
                <Link
                  href={`/practice?subject=${t.subject}&topic=${encodeURIComponent(t.topic)}`}
                  className="text-xs font-semibold hover:underline whitespace-nowrap"
                  style={{ color: 'var(--pri)' }}
                >
                  Drill &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {errorCount > 0 && (
        <Link href="/review" className="block rounded-2xl border p-4 hover:border-red-400 transition-colors" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold">Review mistakes</div>
              <div className="text-sm mt-0.5" style={{ color: 'var(--mute)' }}>{errorCount} questions need re-checking</div>
            </div>
            <span className="text-2xl font-black text-red-500">{errorCount}</span>
          </div>
        </Link>
      )}

      <div className="rounded-2xl border p-4 text-sm" style={{ background: 'var(--card)', borderColor: 'var(--line)', color: 'var(--mute)' }}>
        Chemistry and Intelligence questions are kept in the bank as optional bonus practice — they&apos;re not part of the current NET Engineering &amp; Computing paper (Math 50% · Physics 30% · English 20%), so they don&apos;t count toward your projected score.{' '}
        <Link href="/practice?subject=chem" className="font-semibold hover:underline" style={{ color: 'var(--pri)' }}>Practice anyway &rarr;</Link>
      </div>
    </div>
  );
}
