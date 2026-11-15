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
  { href: '/review',    Icon: IconReview,    label: 'Review'    },
  { href: '/settings',  Icon: IconSettings,  label: 'Settings'  },
];

export function Nav() {
  const path = usePathname();

  return (
    <>
      {/* Desktop sidebar — floating glass panel */}
      <aside
        className="hidden md:flex fixed top-4 left-4 bottom-4 w-[198px] flex-col rounded-2xl border z-20 px-2.5 py-5"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--line)',
          backdropFilter: 'blur(22px) saturate(160%)',
          WebkitBackdropFilter: 'blur(22px) saturate(160%)',
          boxShadow: 'inset 0 1px 0 var(--glass-highlight), 0 12px 36px -16px var(--glass-shadow)',
        }}
      >
        <div className="flex items-center gap-2.5 px-2.5 pb-6">
          <Image src="/icon-192.png" alt="" width={30} height={30} className="rounded-[9px]" />
          <span className="font-bold text-[15px] leading-tight" style={{ color: 'var(--ink)' }}>Nust Prep Bank</span>
        </div>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-all ${
              path === l.href
                ? 'text-purple-900 dark:text-purple-100'
                : 'hover:bg-black/[0.03] dark:hover:bg-white/5'
            }`}
            style={{
              color: path !== l.href ? 'var(--mute)' : undefined,
              background: path === l.href
                ? 'linear-gradient(135deg, rgba(124,58,237,0.16), rgba(192,38,211,0.12))'
                : undefined,
              boxShadow: path === l.href ? 'inset 0 1px 0 rgba(255,255,255,0.4)' : undefined,
            }}
          >
            <l.Icon />
            {l.label}
          </Link>
        ))}
      </aside>

      {/* Mobile bottom bar — floating glass pill */}
      <nav
        className="md:hidden fixed bottom-3 left-3 right-3 z-20 flex rounded-2xl border"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--line)',
          backdropFilter: 'blur(22px) saturate(160%)',
          WebkitBackdropFilter: 'blur(22px) saturate(160%)',
          boxShadow: 'inset 0 1px 0 var(--glass-highlight), 0 12px 36px -16px var(--glass-shadow)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {links.slice(0, 5).map((l) => (
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
