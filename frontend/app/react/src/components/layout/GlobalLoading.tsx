'use client';

import React, {useEffect} from 'react';
import {Spin} from 'antd';
import {useLoading} from '@/store/core/loading/hooks';
import {finishLoading} from '@/store/core/loading/slice';
import {useDispatch} from 'react-redux';
import {usePathname} from 'next/navigation';
import styles from './GlobalLoading.module.css';

export default function GlobalLoading() {
    const {isLoading} = useLoading();
    const dispatch = useDispatch();
    const pathname = usePathname();

    // 方案 1：超时保护 - 如果 loading 超过 5 秒，自动隐藏
    useEffect(() => {
        if (isLoading) {
            const timer = setTimeout(() => {
                console.warn('[GlobalLoading] Loading timeout (>5s), forcing finish');
                dispatch(finishLoading());
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [isLoading, dispatch]);

    // 方案 2：监听路由变化（Next.js 页面渲染完成）
    useEffect(() => {
        if (isLoading) {
            // 路由变化后，给一点时间让页面内容渲染出来
            const timer = setTimeout(() => {
                console.log('[GlobalLoading] Route changed, page rendered, hiding loading');
                dispatch(finishLoading());
            }, 300); // 300ms 延迟，对应 [Fast Refresh] done 的时机
            
            return () => clearTimeout(timer);
        }
    }, [pathname, isLoading, dispatch]);

    if (!isLoading) return null;

    return (
        <div className={styles.loadingOverlay}>
            <div className={styles.loadingContent}>
                <Spin size="large" />
                <p className={styles.loadingText}>加载中...</p>
            </div>
        </div>
    );
}
