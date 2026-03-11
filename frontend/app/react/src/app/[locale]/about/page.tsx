'use client';

import {useTranslations} from 'next-intl';

export default function AboutPage() {
    const t = useTranslations('page.about');
    
    return (
        <div>
            <h1>{t('title') || '关于我们'}</h1>
        </div>
    );
}
