export type SubjectKey = 'math' | 'phy' | 'eng' | 'chem' | 'intel';

export interface Question {
  id: string;
  subject: SubjectKey;
  topic: string;
  question: string;
  options: string[];
  answer: number; // 0-indexed
  explanation?: string;
  source?: 'static' | 'kv' | 'custom';
}

export interface VaultCard {
  subject: string;
  group: string;
  title: string;
  body: string;
}

export interface LogEntry {
  ts: number;
  id: string;
  subject: SubjectKey;
  topic: string;
  ok: boolean;
  ms: number;
}

export interface ErrorEntry {
  q: Question;
  n: number;
  last: number;
}

export interface MockQuestion extends Question {
  chosen: number;
  timeMs: number;
  flagged: boolean;
}

export interface MockState {
  kind: 'full' | 'half' | 'quick';
  instant: boolean;
  questions: MockQuestion[];
  idx: number;
  endAt: number;
  startedAt: number;
  done: boolean;
}

export interface SubjectConfig {
  name: string;
  count: number;     // questions in full paper
  weight: number;    // % weight
  color: string;
  darkColor: string;
  tw: string;        // Tailwind class
}

// Current (post-reform) NET Engineering & Computing pattern: 200 MCQs, 180 min,
// no negative marking. Chemistry was dropped from this stream (it's only tested
// in the separate Applied Sciences track) and CS was never a tested subject —
// so only these three count toward the real paper and projected score.
export const SUBJECTS: Record<'math' | 'phy' | 'eng', SubjectConfig> = {
  math: { name: 'Mathematics', count: 100, weight: 50, color: '#6d28d9', darkColor: '#a78bfa', tw: 'violet' },
  phy:  { name: 'Physics',     count: 60,  weight: 30, color: '#7e22ce', darkColor: '#c084fc', tw: 'purple' },
  eng:  { name: 'English',     count: 40,  weight: 20, color: '#a21caf', darkColor: '#e879f9', tw: 'fuchsia' },
};

// Not part of the current Engineering & Computing paper — kept as optional
// extra practice since the question bank already has them.
export const BONUS_SUBJECTS: Record<'chem' | 'intel', SubjectConfig> = {
  chem:  { name: 'Chemistry (bonus)',     count: 0, weight: 0, color: '#be185d', darkColor: '#f0abfc', tw: 'pink' },
  intel: { name: 'Intelligence (bonus)',  count: 0, weight: 0, color: '#be123c', darkColor: '#fda4af', tw: 'rose' },
};

export const ALL_SUBJECT_INFO: Record<SubjectKey, SubjectConfig> = { ...SUBJECTS, ...BONUS_SUBJECTS };

export const MOCK_SIZES = {
  full:  { label: 'Full paper · 200 Q · 180 min', k: 1,   mins: 180 },
  half:  { label: 'Half paper · 100 Q · 90 min',  k: 0.5, mins: 90  },
  quick: { label: 'Quick check · 40 Q · 36 min',  k: 0.2, mins: 36  },
};
