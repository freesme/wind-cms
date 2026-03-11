import type {Metadata} from "next";
import {env} from "@/config";

export const metadata: Metadata = {
    title: env.appTitle,
    description: env.appDescription,
};

import ThemeClientProvider from '@/components/layout/ThemeClientProvider';
import ReduxProvider from '@/store/ReduxProvider';

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="zh-CN" suppressHydrationWarning>
        <body>
        <ReduxProvider>
          <ThemeClientProvider>{children}</ThemeClientProvider>
        </ReduxProvider>
        </body>
        </html>
    );
}
