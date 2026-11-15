#!/usr/bin/env node
/**
 * push.js — Push questions to Nust Prep Bank from your local machine
 *
 * Usage:
 *   node push.js                     → push all questions in QUESTIONS array below
 *   node push.js --file my.json      → push questions from a JSON file
 *   node push.js --list              → list all custom questions in the bank
 *   node push.js --clear             → wipe custom bank
 *
 * Set NUST_API and NUST_KEY in .env.local or as env vars:
 *   NUST_API=https://your-app.vercel.app
 *   NUST_KEY=your-secret-key
 */

const API = process.env.NUST_API || 'http://localhost:3000';
const KEY = process.env.NUST_KEY || '';

// ─── ADD YOUR QUESTIONS HERE ───────────────────────────────────────────────
// subject: 'math' | 'phy' | 'eng' | 'chem' | 'intel'
// answer: 0–3 (index of correct option in options array)
const QUESTIONS = [
  // Example — delete and replace with real questions:
  {
    subject: 'math',
    topic: 'Calculus',
    question: 'The derivative of sin(x) is',
    options: ['cos(x)', '-cos(x)', 'tan(x)', '-sin(x)'],
    answer: 0,
    explanation: 'Standard derivative: d/dx(sin x) = cos x.',
  },
  {
    subject: 'phy',
    topic: 'Modern Physics',
    question: 'The energy of a photon with frequency f is',
    options: ['hf', 'h/f', 'f/h', 'hf²'],
    answer: 0,
    explanation: 'E = hf where h = 6.626×10⁻³⁴ J·s.',
  },
];
// ──────────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--list')) {
    const res = await fetch(`${API}/api/questions`);
    const data = await res.json();
    console.log(`\n📚 Custom bank: ${data.total} questions\n`);
    data.questions.forEach((q, i) => {
      console.log(`${i + 1}. [${q.subject.toUpperCase()}] ${q.topic} — ${q.question.slice(0, 60)}…`);
    });
    return;
  }

  if (args.includes('--clear')) {
    const res = await fetch(`${API}/api/questions`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${KEY}` },
    });
    const data = await res.json();
    console.log(data);
    return;
  }

  let questions = QUESTIONS;

  const fileIdx = args.indexOf('--file');
  if (fileIdx !== -1 && args[fileIdx + 1]) {
    const { readFileSync } = await import('fs');
    const raw = readFileSync(args[fileIdx + 1], 'utf8');
    const parsed = JSON.parse(raw);
    questions = Array.isArray(parsed) ? parsed : parsed.questions;
    console.log(`📂 Loaded ${questions.length} questions from ${args[fileIdx + 1]}`);
  }

  if (!KEY) {
    console.error('❌  Set NUST_KEY env var (your API key)');
    process.exit(1);
  }

  console.log(`\n🚀 Pushing ${questions.length} question(s) to ${API}…\n`);

  const res = await fetch(`${API}/api/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify({ questions }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('❌ Error:', data.error);
    if (data.invalid) console.error('Invalid entries:', data.invalid);
    process.exit(1);
  }

  console.log('✅', data.message);
  if (data.duplicates) console.log(`   ${data.duplicates} duplicate(s) skipped`);
  if (data.invalid) console.log(`   ${data.invalid} invalid entry/ies skipped`);
}

main().catch(console.error);
