// 文件已废弃，已切换到 next-intl

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

// 示例语言资源，可根据实际需求扩展
const resources = {
    zh: {
        translation: {
            welcome: '欢迎',
            home: '首页',
            login: '登录',
            logout: '退出',
            // ...更多中文翻译
        },
    },
    en: {
        translation: {
            welcome: 'Welcome',
            home: 'Home',
            login: 'Login',
            logout: 'Logout',
            // ...更多英文翻译
        },
    },
};

// 初始化 i18next
void i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'zh', // 默认语言
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React 已自动防止 XSS
        },
    });

// 切换语言方法
export function changeLanguage(lang: string) {
    i18n.changeLanguage(lang);
}

export default i18n;

