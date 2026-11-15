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

export const SUBJECTS: Record<SubjectKey, SubjectConfig> = {
  math:  { name: 'Mathematics',    count: 80,  weight: 40, color: '#4f46e5', darkColor: '#8b92ff', tw: 'indigo' },
  phy:   { name: 'Physics',        count: 60,  weight: 30, color: '#0e8a9b', darkColor: '#3fcbdc', tw: 'cyan' },
  eng:   { name: 'English',        count: 20,  weight: 10, color: '#c2410c', darkColor: '#ff9a62', tw: 'orange' },
  chem:  { name: 'Chemistry / CS', count: 30,  weight: 15, color: '#16a34a', darkColor: '#4ade80', tw: 'green' },
  intel: { name: 'Intelligence',   count: 10,  weight: 5,  color: '#9333ea', darkColor: '#c084fc', tw: 'purple' },
};

export const MOCK_SIZES = {
  full:  { label: 'Full paper · 200 Q · 180 min', k: 1,   mins: 180 },
  half:  { label: 'Half paper · 100 Q · 90 min',  k: 0.5, mins: 90  },
  quick: { label: 'Quick check · 40 Q · 36 min',  k: 0.2, mins: 36  },
};
