'use client';

import {useTranslations, useLocale} from 'next-intl';
import {usePathname} from 'next/navigation';
import {useDispatch} from 'react-redux';

import {useLanguageStore} from '@/store/core/language/hooks';
import {useI18nRouter} from "@/i18n/helpers/useI18nRouter";
import {startLoading, finishLoading} from '@/store/core/loading/slice';


/**
 * useI18n hook - 增强的多语言支持
 * @param namespace 翻译模块名（如 'common', 'article', 'category'）
 */
export function useI18n(namespace: string = 'common') {
    const t = useTranslations(namespace);
    const locale = useLocale();
    const pathname = usePathname();
    const router = useI18nRouter();
    const languageStore = useLanguageStore();
    const dispatch = useDispatch();

    // 同步 locale 到 Redux store
    if (languageStore.language.locale !== locale) {
        languageStore.setLocale(locale);
    }

    // 切换语言（使用 next-intl 的路由器）
    const changeLocale = (targetLocale: string) => {
        // 从当前路径中提取不包含 locale 的路径部分
        // 例如：从 /zh-CN/post/123 提取 /post/123
        const segments = pathname.split('/').slice(2).join('/');
        const pathWithoutLocale = segments ? `/${segments}` : '/';

        // 直接构造目标语言的完整路径并跳转
        // 使用 replace 避免历史记录堆积
        const newPath = `/${targetLocale}${pathWithoutLocale}`;

        console.log('[useI18n] Start locale change, showing loading...');
        dispatch(startLoading());

        // 立即跳转，不需要延迟
        // 注意：不使用缓存破坏参数，让 Next.js 正常处理缓存
        // 因为语言包已经通过 NextIntlClientProvider 提供，页面会正确渲染
        router.replaceWithoutLocale(newPath);
    };

    return {t, locale, changeLocale};
}
