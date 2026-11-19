'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

function IconDashboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="6" height="7" rx="1" />
      <rect x="10" y="2" width="6" height="4" rx="1" />
      <rect x="10" y="8" width="6" height="8" rx="1" />
      <rect x="2" y="11" width="6" height="5" rx="1" />
    </svg>
  );
}
function IconPractice() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 3h9l3 3v9H3z" />
      <path d="M6 7h6M6 10h6M6 13h4" />
    </svg>
  );
}
function IconMock() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="9" cy="9" r="7" />
      <path d="M9 5v4l3 2" />
    </svg>
  );
}
function IconVault() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="14" height="14" rx="1" />
      <circle cx="9" cy="9" r="3" />
      <path d="M9 2v2M9 14v2" />
    </svg>
  );
}
function IconLibrary() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 3h5a2 2 0 0 1 2 2v10a2 2 0 0 0-2-2H3z" />
      <path d="M15 3h-5a2 2 0 0 0-2 2v10a2 2 0 0 1 2-2h5z" />
    </svg>
  );
}
function IconReview() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9a6 6 0 0 1 10.2-4.3M15 9a6 6 0 0 1-10.2 4.3" />
      <path d="M13 2v3h-3M5 16v-3h3" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="9" cy="9" r="2.5" />
      <path d="M9 2.5v2M9 13.5v2M15.5 9h-2M4.5 9h-2M13.7 4.3l-1.4 1.4M5.7 12.3l-1.4 1.4M13.7 13.7l-1.4-1.4M5.7 5.7 4.3 4.3" />
    </svg>
  );
}

const links = [
  { href: '/',          Icon: IconDashboard, label: 'Dashboard' },
  { href: '/practice',  Icon: IconPractice,  label: 'Practice'  },
  { href: '/mock',      Icon: IconMock,      label: 'Mock Exam' },
  { href: '/vault',     Icon: IconVault,     label: 'Vault'     },
  { href: '/library',   Icon: IconLibrary,   label: 'Library'   },
  { href: '/review',    Icon: IconReview,    label: 'Review'    },
  { href: '/settings',  Icon: IconSettings,  label: 'Settings'  },
];

export function Nav() {
  const path = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex fixed top-0 left-0 h-full w-[210px] flex-col border-r z-20 px-3 py-5"
        style={{ background: 'var(--card)', borderColor: 'var(--line)' }}
      >
        <div className="flex items-center gap-2.5 px-2 pb-6">
          <Image src="/icon-192.png" alt="" width={28} height={28} className="rounded-lg" />
          <span className="font-bold text-[15px] leading-tight" style={{ color: 'var(--ink)' }}>Nust Prep Bank</span>
        </div>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-colors"
            style={{
              color: path === l.href ? 'var(--pri)' : 'var(--mute)',
              background: path === l.href ? 'color-mix(in srgb, var(--pri) 12%, transparent)' : undefined,
            }}
          >
            <l.Icon />
            {l.label}
          </Link>
        ))}
      </aside>

      {/* Mobile bottom bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-20 flex border-t"
        style={{ background: 'var(--card)', borderColor: 'var(--line)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {links.slice(0, 6).map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex-1 flex flex-col items-center py-2.5 gap-1 text-[10px] font-medium transition-colors"
            style={{ color: path === l.href ? 'var(--pri)' : 'var(--mute)' }}
          >
            <l.Icon />
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
