import React from 'react';
import {Button} from 'antd';
import {useTranslations} from 'next-intl';
import styles from './home.module.css';

export default function LatestPostsSection() {
    const t = useTranslations('page.home');
    return (
        <section className={styles.latestSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t('latest_posts')}</h2>
                <Button type="link" onClick={() => window.location.href = '/post'}>{t('view_all')} →</Button>
            </div>
            {/* TODO: 最新文章列表内容 */}
        </section>
    );
}
