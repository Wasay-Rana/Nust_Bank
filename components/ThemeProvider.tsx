'use client';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStore((s) => s.settings.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    const apply = () => {
      const isDark = theme === 'dark' || (theme === 'auto' && mql.matches);
      root.classList.toggle('dark', isDark);
    };

    apply();

    if (theme === 'auto') {
      mql.addEventListener('change', apply);
      return () => mql.removeEventListener('change', apply);
    }
  }, [theme]);

  return <>{children}</>;
}
