import React from "react";
import type {Metadata} from "next";

import {env} from "@/config";
import {DEFAULT_LANGUAGE} from "@/i18n";
import ThemeClientProvider from '@/components/layout/ThemeClientProvider';
import ReduxProvider from '@/store/ReduxProvider';

export const metadata: Metadata = {
    title: env.appTitle,
    description: env.appDescription,
};


export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang={DEFAULT_LANGUAGE} suppressHydrationWarning>
            <body>
                <ReduxProvider>
                    <ThemeClientProvider>{children}</ThemeClientProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}
