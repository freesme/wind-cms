import React from 'react';
import {useTranslations} from 'next-intl';
import styles from '../../app/home.module.css';

interface Feature {
    icon?: string;
    title: string;
    description: string;
}

export default function FeaturesSection() {
    const t = useTranslations('page.home');

    // 特性列表（从 Vue3 版本参考）
    const features: Feature[] = [
        {
            icon: 'carbon:document',
            title: t('flexible_content_management'),
            description: t('content_management_desc'),
        },
        {
            icon: 'carbon:cloud',
            title: t('multi_tenant_architecture'),
            description: t('multi_tenant_desc'),
        },
        {
            icon: 'carbon:security',
            title: t('enterprise_security'),
            description: t('security_desc'),
        },
        {
            icon: 'carbon:analytics',
            title: t('advanced_analytics'),
            description: t('analytics_desc'),
        },
        {
            icon: 'carbon:api',
            title: t('api_integration'),
            description: t('api_integration_desc'),
        },
        {
            icon: 'carbon:collaborate',
            title: t('real_time_collaboration'),
            description: t('real_time_collaboration_desc'),
        },
    ];

    return (
        <section className={styles.featuresSection}>
            <h2 className={styles.sectionTitle}>{t('platform_features')}</h2>
            <div className={styles.featuresGrid}>
                {features.map((feature, index) => (
                    <div key={index} className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            {/* TODO: 使用图标库 */}
                            <span>{feature.icon}</span>
                        </div>
                        <h3 className={styles.featureTitle}>{feature.title}</h3>
                        <p className={styles.featureDescription}>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
