import { NextRequest, NextResponse } from 'next/server';
import { getStats, saveStats } from '@/lib/kv';

function authenticate(req: NextRequest): boolean {
  const key = process.env.API_KEY;
  if (!key) return false;
  return req.headers.get('authorization') === `Bearer ${key}`;
}

// POST /api/stats — client pushes its own practice log/errors/mock history.
// No auth required: this is Hassan's own device syncing its own progress,
// and the payload holds no sensitive data (just quiz answers/timings).
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Expected a JSON object' }, { status: 400 });
  }

  const persisted = await saveStats(body);
  if (!persisted) {
    return NextResponse.json(
      { ok: false, error: 'Storage is not configured on the server — nothing was saved. Set up Vercel KV and redeploy.' },
      { status: 503 },
    );
  }
  return NextResponse.json({ ok: true, message: 'Progress synced.' });
}

// GET /api/stats — read back the synced progress (requires API key, since
// this is what the parent session uses to analyze performance).
export async function GET(req: NextRequest) {
  if (!authenticate(req)) {
    return NextResponse.json({ error: 'Unauthorized — set Authorization: Bearer <API_KEY>' }, { status: 401 });
  }
  const stats = await getStats();
  return NextResponse.json({ stats });
}
