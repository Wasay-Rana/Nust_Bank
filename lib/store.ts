'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Question, LogEntry, ErrorEntry, MockState, SubjectKey } from './types';
import { SUBJECTS, MOCK_SIZES } from './types';

interface AppState {
  log: LogEntry[];
  errors: Record<string, ErrorEntry>;
  bookmarks: Record<string, boolean>;
  mock: MockState | null;
  customQuestions: Question[];
  settings: { theme: 'light' | 'dark' | 'auto'; targetScore: number };

  recordAnswer: (q: Question, chosen: number, ms: number) => void;
  toggleBookmark: (id: string) => void;
  clearErrors: () => void;

  startMock: (kind: 'full' | 'half' | 'quick', instant: boolean, allQuestions: Question[]) => void;
  answerMock: (chosen: number, ms: number) => void;
  flagMock: () => void;
  navMock: (idx: number) => void;
  finishMock: () => void;
  clearMock: () => void;

  addCustomQuestions: (qs: Question[]) => void;
  setTheme: (t: 'light' | 'dark' | 'auto') => void;
  setTargetScore: (n: number) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      log: [],
      errors: {},
      bookmarks: {},
      mock: null,
      customQuestions: [],
      settings: { theme: 'auto', targetScore: 180 },

      recordAnswer(q, chosen, ms) {
        const ok = chosen === q.answer;
        const entry: LogEntry = {
          ts: Date.now(),
          id: q.id,
          subject: q.subject,
          topic: q.topic,
          ok,
          ms: Math.min(ms, 600_000),
        };
        set((s) => {
          const log = [...s.log, entry].slice(-6000);
          const errors = { ...s.errors };
          if (!ok) {
            const prev = errors[q.id];
            errors[q.id] = { q, n: (prev?.n ?? 0) + 1, last: Date.now() };
          } else {
            delete errors[q.id];
          }
          return { log, errors };
        });
      },

      toggleBookmark(id) {
        set((s) => {
          const bookmarks = { ...s.bookmarks };
          if (bookmarks[id]) delete bookmarks[id];
          else bookmarks[id] = true;
          return { bookmarks };
        });
      },

      clearErrors() {
        set({ errors: {} });
      },

      startMock(kind, instant, allQuestions) {
        const k = MOCK_SIZES[kind].k;
        const mins = MOCK_SIZES[kind].mins;
        const qs: Question[] = [];
        for (const [s, cfg] of Object.entries(SUBJECTS)) {
          const need = Math.round(cfg.count * k);
          const pool = shuffle(allQuestions.filter((q) => q.subject === s));
          qs.push(...pool.slice(0, need));
        }
        const questions = shuffle(qs).map((q) => ({
          ...q,
          chosen: -1,
          timeMs: 0,
          flagged: false,
        }));
        set({
          mock: {
            kind,
            instant,
            questions,
            idx: 0,
            endAt: Date.now() + mins * 60_000,
            startedAt: Date.now(),
            done: false,
          },
        });
      },

      answerMock(chosen, ms) {
        set((s) => {
          if (!s.mock) return s;
          const questions = s.mock.questions.map((q, i) =>
            i === s.mock!.idx ? { ...q, chosen, timeMs: q.timeMs + ms } : q,
          );
          return { mock: { ...s.mock, questions } };
        });
      },

      flagMock() {
        set((s) => {
          if (!s.mock) return s;
          const questions = s.mock.questions.map((q, i) =>
            i === s.mock!.idx ? { ...q, flagged: !q.flagged } : q,
          );
          return { mock: { ...s.mock, questions } };
        });
      },

      navMock(idx) {
        set((s) => (!s.mock ? s : { mock: { ...s.mock, idx } }));
      },

      finishMock() {
        set((s) => {
          if (!s.mock) return s;
          // Record all answers
          const errors = { ...s.errors };
          const log = [...s.log];
          for (const q of s.mock.questions) {
            if (q.chosen === -1) continue;
            const ok = q.chosen === q.answer;
            log.push({ ts: Date.now(), id: q.id, subject: q.subject, topic: q.topic, ok, ms: q.timeMs });
            if (!ok) {
              const prev = errors[q.id];
              errors[q.id] = { q, n: (prev?.n ?? 0) + 1, last: Date.now() };
            } else {
              delete errors[q.id];
            }
          }
          return { mock: { ...s.mock, done: true }, log: log.slice(-6000), errors };
        });
      },

      clearMock() {
        set({ mock: null });
      },

      addCustomQuestions(qs) {
        set((s) => {
          const existing = new Set(s.customQuestions.map((q) => q.id));
          const fresh = qs.filter((q) => !existing.has(q.id));
          return { customQuestions: [...s.customQuestions, ...fresh] };
        });
      },

      setTheme(theme) {
        set((s) => ({ settings: { ...s.settings, theme } }));
      },

      setTargetScore(targetScore) {
        set((s) => ({ settings: { ...s.settings, targetScore } }));
      },
    }),
    {
      name: 'nust-prep-v1',
      partialize: (s) => ({
        log: s.log,
        errors: s.errors,
        bookmarks: s.bookmarks,
        mock: s.mock,
        customQuestions: s.customQuestions,
        settings: s.settings,
      }),
    },
  ),
);

// Derived selectors
export function subjStats(log: LogEntry[], subject: SubjectKey, last = 150) {
  const entries = log.filter((l) => l.subject === subject).slice(-last);
  const ok = entries.filter((l) => l.ok).length;
  const totalMs = entries.reduce((a, l) => a + l.ms, 0);
  return {
    n: entries.length,
    acc: entries.length ? ok / entries.length : null,
    avgSec: entries.length ? totalMs / entries.length / 1000 : null,
  };
}

export function projectedScore(log: LogEntry[]): number {
  let total = 0;
  for (const [s, cfg] of Object.entries(SUBJECTS)) {
    const st = subjStats(log, s as SubjectKey);
    if (st.n >= 10 && st.acc !== null) total += st.acc * cfg.count;
  }
  return Math.round(total);
}

export function weakTopics(log: LogEntry[]) {
  const map: Record<string, { subject: SubjectKey; topic: string; n: number; ok: number }> = {};
  for (const l of log) {
    const k = `${l.subject}|${l.topic}`;
    if (!map[k]) map[k] = { subject: l.subject, topic: l.topic, n: 0, ok: 0 };
    map[k].n++;
    if (l.ok) map[k].ok++;
  }
  return Object.values(map)
    .filter((x) => x.n >= 4)
    .map((x) => ({ ...x, acc: x.ok / x.n }))
    .sort((a, b) => a.acc - b.acc)
    .slice(0, 8);
}
