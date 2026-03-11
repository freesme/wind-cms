'use client';

import React from 'react';
import {Button, Divider} from 'antd';
import {Icon} from '@iconify/react';
import {useTranslations} from 'next-intl';

import styles from './Footer.module.css';

export default function Footer() {
    const t = useTranslations('footer');

    const footerLinks = [
        {key: 'about', label: t('about'), href: '/about'},
        {key: 'privacy', label: t('privacy'), href: '/privacy'},
        {key: 'terms', label: t('terms'), href: '/terms'},
        {key: 'contact', label: t('contact'), href: '/contact'},
    ];

    const socialLinks = [
        {key: 'github', icon: 'carbon:logo-github', href: 'https://github.com'},
        {key: 'twitter', icon: 'carbon:logo-twitter', href: 'https://twitter.com'},
        {key: 'wechat', icon: 'carbon:logo-wechat', href: '#'},
    ];

    return (
        <footer className={styles.footerOuter}>
            <div className={styles.footerContainer}>
                <div className={styles.footerLinks}>
                    {footerLinks.map(link => (
                        <div key={link.key} className={styles.footerLink}>
                            <Button type="link" href={link.href} target="_blank" rel="noopener noreferrer">
                                {link.label}
                            </Button>
                        </div>
                    ))}
                </div>

                <div className={styles.footerMeta}>
                    <div className={styles.copyright}>
                        © {new Date().getFullYear()} CMS. All rights reserved.
                    </div>
                    <Divider type="vertical" className={styles.metaDivider}/>
                    <div className={styles.socialList}>
                        {socialLinks.map(social => (
                            <Button
                                key={social.key}
                                type="text"
                                className={styles.socialBtn}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                icon={<Icon icon={social.icon}/>}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
