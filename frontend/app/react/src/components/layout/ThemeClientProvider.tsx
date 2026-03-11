'use client';

import {useEffect} from 'react';
import {useThemeMode} from '@/store/core/theme/hooks';

export default function ThemeClientProvider({children}: { children: React.ReactNode }) {
    const mode = useThemeMode();
    useEffect(() => {
        // 跟随系统
        const applyTheme = (theme: string) => {
            document.body.classList.remove('dark', 'light');
            if (theme === 'system') {
                const mq = window.matchMedia('(prefers-color-scheme: dark)');
                const sysTheme = mq.matches ? 'dark' : 'light';
                document.body.classList.add(sysTheme);
                mq.onchange = (e) => {
                    document.body.classList.remove('dark', 'light');
                    document.body.classList.add(e.matches ? 'dark' : 'light');
                };
            } else {
                document.body.classList.add(theme);
            }
        };
        applyTheme(mode);
    }, [mode]);
    return children;
}
