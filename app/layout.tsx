import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Nav } from '@/components/Nav';
import { ThemeProvider } from '@/components/ThemeProvider';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="auto" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Nav />
            <main className="flex-1 md:ml-[210px] p-4 md:p-8 pb-24 md:pb-8 max-w-[1180px]">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
