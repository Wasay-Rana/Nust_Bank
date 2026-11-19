const PAPERS = [
  { file: 'net-engineering-pastpaper-2.pdf', title: 'NUST Engineering Past Paper 2', size: '680 KB' },
  { file: 'net-engineering-pastpaper-4.pdf', title: 'NUST Engineering Past Paper 4', size: '1.0 MB' },
  { file: 'net-engineering-pastpaper-5.pdf', title: 'NUST Engineering Past Paper 5', size: '662 KB' },
  { file: 'net-200-mcqs-series.pdf', title: 'NET 200 MCQs Series', size: '254 KB' },
  { file: 'net-math-100-mcqs.pdf', title: 'NET Mathematics — 100 MCQs', size: '68 KB' },
  { file: 'net-math-mcqs-part1.pdf', title: 'NET Mathematics MCQs — Part 1', size: '2.5 MB' },
  { file: 'net-math-mcqs-part2.pdf', title: 'NET Mathematics MCQs — Part 2', size: '1.5 MB' },
];

const DRIVE_URL = 'https://drive.google.com/drive/folders/1rVTGvIoV-Vc_anp49a61pzJFoOe0pZSM';

const BIG_BOOKS = [
  'OETP 3rd Edition Engineering NET',
  'KIPS Mathematics Entry Test Series',
  'Redspot Physics — 1000 MCQs',
  'Fung Math Prepare (Part 1 & 2)',
  'Physics Fung Prepare / Physics Long Fung',
  'STEP Physics for Entry Test',
  'Mathematics Tricks (2nd Edition)',
];

export default function LibraryPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black mb-1" style={{ color: 'var(--ink)' }}>Library</h1>
        <p className="text-sm" style={{ color: 'var(--mute)' }}>
          Past papers and prep books — view or download directly.
        </p>
      </div>

      <section className="rounded-2xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
        <h2 className="font-bold mb-1">Past papers (hosted here)</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--mute)' }}>
          These are the real source PDFs the question bank was built from.
        </p>
        <div className="space-y-2">
          {PAPERS.map((p) => (
            <a
              key={p.file}
              href={`/library/${p.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 p-3 rounded-xl border transition-colors hover:border-indigo-300"
              style={{ borderColor: 'var(--line)' }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold bg-red-50 text-red-600">
                  PDF
                </span>
                <span className="text-sm font-medium truncate" style={{ color: 'var(--ink)' }}>{p.title}</span>
              </div>
              <span className="shrink-0 text-xs" style={{ color: 'var(--mute)' }}>{p.size}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
        <h2 className="font-bold mb-1">Full prep books (Google Drive)</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--mute)' }}>
          These are too large to host on the site directly — open the shared Drive folder to read or download them.
        </p>
        <ul className="space-y-1.5 mb-4">
          {BIG_BOOKS.map((b) => (
            <li key={b} className="text-sm flex items-start gap-2" style={{ color: 'var(--ink)' }}>
              <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: 'var(--mute)' }} />
              {b}
            </li>
          ))}
        </ul>
        <a
          href={DRIVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          Open Drive folder
        </a>
      </section>
    </div>
  );
}
