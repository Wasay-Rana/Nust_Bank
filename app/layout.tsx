import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Nav } from '@/components/Nav';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Nust Prep Bank',
  description: 'NUST Entry Test preparation bank',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'NPB' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6d28d9',
};

const THEME_INIT_SCRIPT = `(function(){try{
  var raw = localStorage.getItem('nust-prep-v1');
  var theme = raw ? (JSON.parse(raw).state || {}).settings?.theme : undefined;
  theme = theme || 'auto';
  var dark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.toggle('dark', dark);
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="auto" suppressHydrationWarning className={inter.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body style={{ fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif' }}>
        <div className="bg-mesh"><span /><span /><span /></div>
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Nav />
            <main className="flex-1 md:ml-[230px] p-4 md:p-8 pb-28 md:pb-8 max-w-[1180px]">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
