'use client';

import React from 'react';
import {Layout} from 'antd';
import {useTranslations} from 'next-intl';

import styles from './Header.module.css';

import TopSearchBar from './TopSearchBar';
import TopNavbar from './TopNavbar';

const {Header: AntHeader} = Layout;

export default function Header() {
    const appT = useTranslations('app');

    return (
        <AntHeader className={styles.headerOuter}>
            <div className={styles.headerInner}>
                {/* 第一行：Logo + 搜索框 + 操作按钮 */}
                <TopSearchBar
                    brandTitle={appT('title')}
                />
                {/* 第二行：导航菜单 */}
                <TopNavbar/>
            </div>
        </AntHeader>
    );
}
