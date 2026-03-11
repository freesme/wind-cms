import React from 'react';
import {Button} from 'antd';
import {useTranslations} from 'next-intl';
import styles from './home.module.css';

export default function PopularTagsSection() {
    const t = useTranslations('page.home');
    return (
        <section className={styles.popularSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t('popular_tags')}</h2>
                <Button type="link" onClick={() => window.location.href = '/tag'}>{t('view_all')} →</Button>
            </div>
            {/* TODO: 标签列表内容 */}
        </section>
    );
}
