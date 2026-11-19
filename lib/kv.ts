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

export async function saveCustomQuestions(questions: Question[]): Promise<void> {
  const client = await getKV();
  if (!client) {
    console.warn('[KV] Not configured — questions stored in-memory only');
    return;
  }
  await client.set(KV_KEY, questions);
}

export async function clearCustomQuestions(): Promise<void> {
  const client = await getKV();
  if (client) await client.del(KV_KEY);
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

export async function saveStats(data: unknown): Promise<void> {
  const client = await getKV();
  if (!client) {
    console.warn('[KV] Not configured — stats not persisted');
    return;
  }
  await client.set(STATS_KEY, { ...((data as object) ?? {}), syncedAt: Date.now() });
}
