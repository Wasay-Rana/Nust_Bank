import type { Question } from './types';

const KV_KEY = 'nust:questions:custom';
const STATS_KEY = 'nust:stats:hassan';

// Vercel KV wrapper — falls back gracefully if KV isn't configured
let kv: typeof import('@vercel/kv').kv | null = null;

async function getKV() {
  if (kv) return kv;
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null;
  try {
    const mod = await import('@vercel/kv');
    kv = mod.kv;
    return kv;
  } catch {
    return null;
  }
}

export async function getCustomQuestions(): Promise<Question[]> {
  const client = await getKV();
  if (!client) return [];
  try {
    return (await client.get<Question[]>(KV_KEY)) ?? [];
  } catch {
    return [];
  }
}

// Returns whether the write actually persisted — callers must not report
// success to the user when this is false (KV not configured/unreachable).
export async function saveCustomQuestions(questions: Question[]): Promise<boolean> {
  const client = await getKV();
  if (!client) {
    console.warn('[KV] Not configured — questions NOT persisted');
    return false;
  }
  await client.set(KV_KEY, questions);
  return true;
}

export async function clearCustomQuestions(): Promise<boolean> {
  const client = await getKV();
  if (!client) return false;
  await client.del(KV_KEY);
  return true;
}

export async function getStats(): Promise<unknown | null> {
  const client = await getKV();
  if (!client) return null;
  try {
    return await client.get(STATS_KEY);
  } catch {
    return null;
  }
}

export async function saveStats(data: unknown): Promise<boolean> {
  const client = await getKV();
  if (!client) {
    console.warn('[KV] Not configured — stats NOT persisted');
    return false;
  }
  await client.set(STATS_KEY, { ...((data as object) ?? {}), syncedAt: Date.now() });
  return true;
}

export async function isKVConfigured(): Promise<boolean> {
  return (await getKV()) !== null;
}
