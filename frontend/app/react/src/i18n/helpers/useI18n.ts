'use client';

import {useTranslations, useLocale} from 'next-intl';

import {useLanguageStore} from '@/store/core/language/hooks';
import {useI18nRouter} from './useI18nRouter';

/**
 * useI18n hook - 增强的多语言支持
 * @param namespace 翻译模块名（如 'common', 'article', 'category'）
 */
export function useI18n(namespace: string = 'common') {
    const t = useTranslations(namespace);
    const locale = useLocale();
    const router = useI18nRouter();
    const languageStore = useLanguageStore();

    // 同步 locale 到 Redux store
    if (languageStore.language.locale !== locale) {
        languageStore.setLocale(locale);
    }

    // 切换语言（使用 next-intl 的路由器）
    const changeLocale = (targetLocale: string) => {
        // next-intl 会自动处理 locale 前缀和路由
        router.push(`/${targetLocale}`);
    };

    return {t, locale, changeLocale};
}
