import type {NextConfig} from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
    // 启用 React 严格模式
    reactStrictMode: true,
};

export default withNextIntl(nextConfig);
