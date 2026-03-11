import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kratos CMS",
  description: "A modern CMS built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
