'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/',          icon: '⚡', label: 'Dashboard' },
  { href: '/practice',  icon: '✏️', label: 'Practice'  },
  { href: '/mock',      icon: '📝', label: 'Mock Exam'  },
  { href: '/vault',     icon: '📐', label: 'Vault'      },
  { href: '/review',    icon: '🔁', label: 'Review'     },
  { href: '/settings',  icon: '⚙️', label: 'Settings'   },
];

export function Nav() {
  const path = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex fixed top-0 left-0 h-full w-[210px] flex-col border-r z-20 px-2 py-4"
        style={{ background: 'var(--card)', borderColor: 'var(--line)' }}
      >
        <div className="flex items-center gap-2 px-3 pb-5">
          <span className="text-white bg-indigo-600 rounded-xl px-2 py-1 text-sm font-bold">NET</span>
          <span className="font-bold text-base" style={{ color: 'var(--ink)' }}>180+ HQ</span>
        </div>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-colors ${
              path === l.href
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                : 'hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
            style={path !== l.href ? { color: 'var(--mute)' } : undefined}
          >
            <span className="text-lg leading-none">{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </aside>

      {/* Mobile bottom bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-20 flex border-t"
        style={{ background: 'var(--card)', borderColor: 'var(--line)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {links.slice(0, 5).map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex-1 flex flex-col items-center py-2 gap-0.5 text-[10px] font-medium transition-colors"
            style={{ color: path === l.href ? 'var(--pri)' : 'var(--mute)' }}
          >
            <span className="text-xl leading-tight">{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
