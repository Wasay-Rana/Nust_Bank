import type { Question, SubjectKey } from './types';
import staticQuestions from '../data/questions.json';

const base: Question[] = (staticQuestions as Question[]).map((q) => ({ ...q, source: 'static' as const }));

let _customCache: Question[] | null = null;

export async function fetchCustomQuestions(): Promise<Question[]> {
  if (_customCache) return _customCache;
  try {
    const res = await fetch('/api/questions', { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    _customCache = (data.questions as Question[]).map((q) => ({ ...q, source: 'kv' as const }));
    return _customCache;
  } catch {
    return [];
  }
}

export function getBaseQuestions(): Question[] {
  return base;
}

export function getAllQuestions(custom: Question[] = []): Question[] {
  const seen = new Set(base.map((q) => q.id));
  const extra = custom.filter((q) => !seen.has(q.id));
  return [...base, ...extra];
}

export function topicsOf(questions: Question[], subject: SubjectKey): string[] {
  const seen: Record<string, true> = {};
  return questions
    .filter((q) => q.subject === subject)
    .map((q) => q.topic)
    .filter((t) => { if (seen[t]) return false; seen[t] = true; return true; })
    .sort();
}

export function pickQuestion(
  all: Question[],
  subject: SubjectKey | 'all',
  topic?: string,
  recentIds: string[] = [],
  seenCounts: Record<string, number> = {},
): Question | null {
  let pool = all;
  if (subject !== 'all') pool = pool.filter((q) => q.subject === subject);
  if (topic) pool = pool.filter((q) => q.topic === topic);
  if (!pool.length) return null;

  const fresh = pool.filter((q) => !recentIds.includes(q.id));
  const src = fresh.length ? fresh : pool;

  src.sort(
    (a, b) =>
      (seenCounts[a.id] || 0) - (seenCounts[b.id] || 0) + (Math.random() - 0.5) * 0.9,
  );
  return src[0];
}

export function buildMockSet(all: Question[], k: number): Question[] {
  const { SUBJECTS } = require('./types');
  const qs: Question[] = [];
  for (const [s, cfg] of Object.entries(SUBJECTS)) {
    const need = Math.round((cfg as { count: number }).count * k);
    const pool = shuffle(all.filter((q) => q.subject === s));
    qs.push(...pool.slice(0, need));
  }
  return shuffle(qs);
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
