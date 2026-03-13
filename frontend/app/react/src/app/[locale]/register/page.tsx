'use client';

import {useState, useMemo} from 'react';
import {useTranslations} from 'next-intl';
import XIcon from '@/plugins/xicon';

import '../../globals.css'; // 导入全局 CSS，确保 CSS 变量可用
import styles from './register.module.css';

import AccountRegisterPage from './components/AccountRegisterPage';
import EmailRegisterPage from './components/EmailRegisterPage';
import PhoneRegisterPage from './components/PhoneRegisterPage';
import OtherRegisterPage from './components/OtherRegisterPage';

// 获取初始主题状态（仅在客户端调用）
function getInitialTheme(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }
    return document.documentElement.classList.contains('dark');
}

export default function RegisterPage() {
    const t = useTranslations('authentication');
    const [activeTab, setActiveTab] = useState<'account' | 'email' | 'phone' | 'other'>('account');
    const [isDark, setIsDark] = useState<boolean>(getInitialTheme);

    // 语言选项
    const languageOptions = useMemo(() => [
        {key: 'zh-CN', label: '中文'},
        {key: 'en-US', label: 'English'}
    ], []);

    // 切换语言
    const handleSelectLanguage = (key: string) => {
        console.log('Switch language to:', key);
        // TODO: 实现语言切换逻辑
    };

    // 切换主题
    const handleToggleTheme = () => {
        const newIsDark = !document.documentElement.classList.contains('dark');
        setIsDark(newIsDark);
        if (newIsDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // 登录
    const handleLoginClick = () => {
        window.location.href = '/login';
    };

    // 返回首页
    const handleBackHome = () => {
        window.location.href = '/';
    };

    // 服务条款
    const handleTermsClick = () => {
        window.location.href = '/terms';
    };

    // 隐私政策
    const handlePrivacyClick = () => {
        window.location.href = '/privacy';
    };

    return (
        <div className={styles.registerPage}>
            {/* 顶部控制按钮 */}
            <div className={styles.registerControls}>
                <select
                    className={styles.languageSelect}
                    value="zh-CN"
                    onChange={(e) => handleSelectLanguage(e.target.value)}
                >
                    {languageOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <button
                    className={`${styles.controlBtn} ${styles.themeToggle}`}
                    onClick={handleToggleTheme}
                    aria-label="Toggle theme"
                >
                    <XIcon name={isDark ? 'carbon:sun' : 'carbon:moon'} size={18}/>
                </button>
            </div>

            {/* 左侧品牌区 */}
            <div className={styles.registerLeft}>
                <div className={styles.brand}>
                    <img src="/logo.png" alt={t('login.logo_alt')} className={styles.brandLogo}/>
                    <h1 className={styles.brandTitle}>{t('login.brand_title')}</h1>
                    <p className={styles.brandSubtitle}>{t('login.brand_subtitle')}</p>
                </div>

                <div className={styles.benefitsList}>
                    <div className={styles.benefitItem}>
                        <span>✓</span>
                        <span>{t('login.feature_projects')}</span>
                    </div>
                    <div className={styles.benefitItem}>
                        <span>✓</span>
                        <span>{t('login.feature_isolation')}</span>
                    </div>
                    <div className={styles.benefitItem}>
                        <span>✓</span>
                        <span>{t('login.feature_permissions')}</span>
                    </div>
                    <div className={styles.benefitItem}>
                        <span>✓</span>
                        <span>{t('login.feature_analytics')}</span>
                    </div>
                </div>
            </div>

            {/* 右侧注册卡片 */}
            <div className={styles.registerRight}>
                <div className={styles.registerCard}>
                    <div className={styles.cardHeader}>
                        <h2>{t('register.title')}</h2>
                        <p>{t('register.register_with')}</p>
                    </div>

                    {/* Tab 切换 */}
                    <div className={styles.registerTabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'account' ? styles.active : ''}`}
                            onClick={() => setActiveTab('account')}
                        >
                            {t('login.tab_account')}
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'email' ? styles.active : ''}`}
                            onClick={() => setActiveTab('email')}
                        >
                            {t('login.tab_email')}
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'phone' ? styles.active : ''}`}
                            onClick={() => setActiveTab('phone')}
                        >
                            {t('login.tab_phone')}
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'other' ? styles.active : ''}`}
                            onClick={() => setActiveTab('other')}
                        >
                            {t('login.tab_other')}
                        </button>
                    </div>

                    {/* 注册表单内容 */}
                    <div className={styles.registerContent}>
                        {activeTab === 'account' && <AccountRegisterPage/>}
                        {activeTab === 'email' && <EmailRegisterPage/>}
                        {activeTab === 'phone' && <PhoneRegisterPage/>}
                        {activeTab === 'other' && <OtherRegisterPage/>}
                    </div>

                    {/* 登录链接 */}
                    <div className={styles.loginSection}>
                        <p>
                            {t('register.already_have_account')}
                            <button className={styles.textBtn} onClick={handleLoginClick}>
                                {t('register.login_now')}
                            </button>
                        </p>
                    </div>

                    {/* 返回首页 */}
                    <div className={styles.backHome}>
                        <button className={styles.textBtn} onClick={handleBackHome}>
                            ← {t('login.back_home')}
                        </button>
                    </div>

                    {/* 服务条款 */}
                    <div className={styles.terms}>
                        <small>
                            {t('login.terms_prefix')}
                            <button className={styles.textBtn} onClick={handleTermsClick}>
                                {t('login.terms_of_service')}
                            </button>
                            {t('login.terms_and')}
                            <button className={styles.textBtn} onClick={handlePrivacyClick}>
                                {t('login.privacy_policy')}
                            </button>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}
