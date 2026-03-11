import {getMessages} from 'next-intl/server';

import ClientLayout from './ClientLayout';
import React from "react";

export default async function RootLayout({children}: { children: React.ReactNode }) {
    const messages = await getMessages();
    const locale = 'zh-CN'; // 可根据实际动态获取
    return (
        <html lang={locale}>
        <body>
        <ClientLayout messages={messages} locale={locale}>
            {children}
        </ClientLayout>
        </body>
        </html>
    );
}
