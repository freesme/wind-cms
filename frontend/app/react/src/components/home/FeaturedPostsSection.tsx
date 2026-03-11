import React from 'react';
import {Button} from 'antd';
import {useTranslations} from 'next-intl';

import styles from './home.module.css';

export default function FeaturedPostsSection() {
    const t = useTranslations('page.home');
    return (
        <section className={styles.featuredSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t('featured_posts')}</h2>
                <Button type="link" onClick={() => window.location.href = '/post'}>{t('view_all')} →</Button>
            </div>
            {/* TODO: PostList component here */}
            <div className={styles.scrollIndicator}>
                <span className={styles.scrollIndicatorText}>{t('explore_more_categories')}</span>
                <Button shape="circle" onClick={() => {
                    const section = document.querySelector('.categories-section');
                    if (section) section.scrollIntoView({behavior: 'smooth', block: 'start'});
                }}>↓</Button>
            </div>
        </section>
    );
}
