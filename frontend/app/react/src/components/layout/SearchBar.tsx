import React, {useState} from 'react';
import {Input} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import {useTranslations} from 'next-intl';

import styles from './SearchBar.module.css';

export default function SearchBar() {
    const t = useTranslations('navbar.top');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        console.log('Searching for:', searchQuery);
        // TODO: 实现搜索逻辑
    };

    return (
        <Input
            className={styles.searchBar}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={handleSearch}
            placeholder={t('search_placeholder')}
            prefix={<SearchOutlined/>}
            style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'rgba(255, 255, 255, 0.85)',
                height: '36px',
                borderRadius: '8px',
            }}
            styles={{
                input: {
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '14px',
                },
            }}
        />
    );
}
