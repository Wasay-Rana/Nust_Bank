# NET 180+ HQ

NUST Entry Test prep app — 277 past-paper MCQs, mock exams, formula vault, and an open API to push unlimited questions from any device.

## Deploy to Vercel (5 minutes)

```bash
# 1. Install
cd nust-prep
npm install

# 2. Set environment variables
cp .env.example .env.local
# Edit .env.local — set API_KEY to any secret string

# 3. Deploy
npx vercel --prod
```

Then in your Vercel dashboard:
- **Storage → Create KV database** → link to your project
- Vercel auto-injects `KV_REST_API_URL` and `KV_REST_API_TOKEN`
- Redeploy → questions you push via API now persist forever

---

## API — push questions from anywhere

### Authentication

All write endpoints require:
```
Authorization: Bearer <your-API_KEY>
```

---

### `POST /api/questions` — add questions

```bash
curl -X POST https://your-app.vercel.app/api/questions \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "questions": [
      {
        "subject": "math",
        "topic": "Calculus",
        "question": "What is lim(x→0) sin(x)/x?",
        "options": ["0", "1", "∞", "undefined"],
        "answer": 1,
        "explanation": "Standard limit: sin(x)/x → 1 as x → 0."
      },
      {
        "subject": "phy",
        "topic": "Optics",
        "question": "The speed of light in vacuum is",
        "options": ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁵ m/s"],
        "answer": 1
      }
    ]
  }'
```

**Response:**
```json
{
  "added": 2,
  "duplicates": 0,
  "invalid": 0,
  "total": 50,
  "message": "Added 2 question(s). Bank now has 50 custom questions."
}
```

**Question schema:**

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `subject` | string | ✅ | `math`, `phy`, `eng`, `chem`, `intel` |
| `topic` | string | ✅ | Any string (e.g. "Calculus", "Optics") |
| `question` | string | ✅ | The question text |
| `options` | string[4] | ✅ | Exactly 4 answer choices |
| `answer` | number | ✅ | 0, 1, 2, or 3 (index of correct option) |
| `explanation` | string | ❌ | Optional worked solution |
| `id` | string | ❌ | Auto-generated if omitted |

---

### `GET /api/questions` — list custom questions

```bash
curl https://your-app.vercel.app/api/questions
```

---

### `DELETE /api/questions` — wipe custom bank

```bash
curl -X DELETE https://your-app.vercel.app/api/questions \
  -H "Authorization: Bearer YOUR_KEY"
```

---

## Push from a local script

Save this as `push.js` and run `node push.js`:

```js
const API = 'https://your-app.vercel.app';
const KEY = 'YOUR_KEY';

const questions = [
  {
    subject: 'math',
    topic: 'Integration',
    question: '∫ x² dx =',
    options: ['x³/3 + C', 'x²/2 + C', '2x + C', 'x³ + C'],
    answer: 0,
    explanation: 'Power rule: increase exponent by 1, divide by new exponent.'
  },
  // ... add as many as you want
];

fetch(`${API}/api/questions`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
  body: JSON.stringify({ questions }),
}).then(r => r.json()).then(console.log);
```

---

## Subject codes

| Code | Subject | Questions in full paper | Weight |
|------|---------|------------------------|--------|
| `math` | Mathematics | 80 | 40% |
| `phy` | Physics | 60 | 30% |
| `chem` | Chemistry / CS | 30 | 15% |
| `eng` | English | 20 | 10% |
| `intel` | Intelligence | 10 | 5% |

**Total: 200 questions · 180 minutes · No negative marking**

---

## Dev

```bash
npm run dev   # http://localhost:3000
npm run build # production build
```
