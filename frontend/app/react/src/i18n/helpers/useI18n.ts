import {useTranslations, useLocale} from 'next-intl';
import {useRouter} from 'next/navigation';

/**
 * useI18n hook
 * @param namespace 翻译模块名（如 'common', 'article', 'category'）
 */
export function useI18n(namespace: string = 'common') {
    const t = useTranslations(namespace);
    const locale = useLocale();
    const router = useRouter();

    // 切换语言（保留当前路径）
    const changeLocale = (targetLocale: string) => {
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            // 移除旧的 locale 前缀（支持 zhCN, enUS 等格式）
            const pathWithoutLocale = currentPath.replace(/^\/[a-zA-Z]+/, '');
            // 添加新的 locale 前缀
            router.replace(`/${targetLocale}${pathWithoutLocale}`);
        }
    };

    return {t, locale, changeLocale};
}
