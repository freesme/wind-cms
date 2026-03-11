import React from 'react';
import {Button} from 'antd';
import {useTranslations} from 'next-intl';
import styles from './home.module.css';

export default function CategoryListSection() {
    const t = useTranslations('page.home');
    return (
        <section className="categories-section">
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t('categories')}</h2>
                <Button type="link" onClick={() => window.location.href = '/category'}>{t('view_all')} →</Button>
            </div>
            {/* TODO: 分类列表内容 */}
        </section>
    );
}
