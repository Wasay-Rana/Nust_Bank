import { NextRequest, NextResponse } from 'next/server';
import type { Question, SubjectKey } from '@/lib/types';
import { getCustomQuestions, saveCustomQuestions, clearCustomQuestions } from '@/lib/kv';

const VALID_SUBJECTS: SubjectKey[] = ['math', 'phy', 'eng', 'chem', 'intel'];

function authenticate(req: NextRequest): boolean {
  const key = process.env.API_KEY;
  if (!key) return false;
  const auth = req.headers.get('authorization') ?? '';
  return auth === `Bearer ${key}`;
}

function validate(raw: unknown): Question | null {
  if (!raw || typeof raw !== 'object') return null;
  const q = raw as Record<string, unknown>;
  if (
    !VALID_SUBJECTS.includes(q.subject as SubjectKey) ||
    typeof q.topic !== 'string' || !q.topic.trim() ||
    typeof q.question !== 'string' || !q.question.trim() ||
    !Array.isArray(q.options) || q.options.length !== 4 ||
    !q.options.every((o) => typeof o === 'string') ||
    typeof q.answer !== 'number' || q.answer < 0 || q.answer > 3
  ) return null;

  return {
    id: typeof q.id === 'string' ? q.id : `kv-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    subject: q.subject as SubjectKey,
    topic: q.topic.trim(),
    question: q.question.trim(),
    options: (q.options as string[]).map((o) => o.trim()),
    answer: q.answer,
    explanation: typeof q.explanation === 'string' ? q.explanation.trim() : '',
    source: 'kv',
  };
}

// GET /api/questions — returns all KV-stored questions
export async function GET() {
  const questions = await getCustomQuestions();
  return NextResponse.json({ questions, total: questions.length });
}

// POST /api/questions — push new questions (requires API key)
export async function POST(req: NextRequest) {
  if (!authenticate(req)) {
    return NextResponse.json(
      { error: 'Unauthorized — set Authorization: Bearer <API_KEY>' },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Accept { questions: [...] } or just [...]
  const raw: unknown[] = Array.isArray(body)
    ? body
    : Array.isArray((body as Record<string, unknown>).questions)
      ? ((body as Record<string, unknown>).questions as unknown[])
      : [];

  if (!raw.length) {
    return NextResponse.json({ error: 'No questions in request body' }, { status: 400 });
  }

  const valid: Question[] = [];
  const invalid: { index: number; reason: string }[] = [];

  raw.forEach((item, i) => {
    const q = validate(item);
    if (q) valid.push(q);
    else invalid.push({ index: i, reason: 'Failed validation — check subject, options (4), answer (0-3)' });
  });

  if (!valid.length) {
    return NextResponse.json({ error: 'All questions failed validation', invalid }, { status: 400 });
  }

  const existing = await getCustomQuestions();
  const existingIds = new Set(existing.map((q) => q.id));
  const fresh = valid.filter((q) => !existingIds.has(q.id));
  const duplicates = valid.length - fresh.length;

  const updated = [...existing, ...fresh];
  await saveCustomQuestions(updated);

  return NextResponse.json({
    added: fresh.length,
    duplicates,
    invalid: invalid.length,
    total: updated.length,
    message: `Added ${fresh.length} question(s). Bank now has ${updated.length} custom questions.`,
  });
}

// DELETE /api/questions — wipe custom bank (requires API key)
export async function DELETE(req: NextRequest) {
  if (!authenticate(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await clearCustomQuestions();
  return NextResponse.json({ deleted: true });
}
