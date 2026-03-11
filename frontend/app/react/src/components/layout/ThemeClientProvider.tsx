'use client';
import {useEffect} from 'react';
import {useThemeMode} from '@/store/core/theme/hooks';

export default function ThemeClientProvider({children}: {children: React.ReactNode}) {
  const mode = useThemeMode();
  useEffect(() => {
    // 跟随系统
    const applyTheme = (theme: string) => {
      const html = document.documentElement;
      html.classList.remove('dark', 'light');
      if (theme === 'system') {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const sysTheme = mq.matches ? 'dark' : 'light';
        html.classList.add(sysTheme);
        mq.onchange = (e) => {
          html.classList.remove('dark', 'light');
          html.classList.add(e.matches ? 'dark' : 'light');
        };
      } else {
        html.classList.add(theme);
      }
    };
    applyTheme(mode);
  }, [mode]);
  return children;
}
