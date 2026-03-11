import {useLocale} from 'next-intl';

export * from './config';
export * from './helpers/useI18n';

// 导出语言切换组件
export {LocaleSwitcher} from '@/components/layout/LocaleSwitcher';


// 获取当前语言代码（如 zh-CN、en-US）
export function useCurrentLocaleLanguageCode(): string {
    const locale = useLocale();
    if (locale.startsWith('zh')) return 'zh-CN';
    if (locale.startsWith('en')) return 'en-US';
    return locale;
}

// 获取当前语言代码（如 zh-CN、en-US）
export function currentLocaleLanguageCode(): string {
    if (typeof window !== 'undefined') {
        const locale = (window as unknown as Record<string, unknown>)['__NEXT_LOCALE__'] || navigator.language || 'zh-CN';
        if (typeof locale === 'string') {
            if (locale.startsWith('zh')) return 'zh-CN';
            if (locale.startsWith('en')) return 'en-US';
            return locale;
        }
    }
    return 'zh-CN';
}
