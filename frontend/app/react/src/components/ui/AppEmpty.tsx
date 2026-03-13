'use client';

import React from 'react';
import {Empty} from 'antd';
import type {EmptyProps} from 'antd';

import styles from './AppEmpty.module.css';

interface AppEmptyProps extends EmptyProps {
    /**
     * 空状态类型
     * - default: 默认空状态
     * - error: 错误状态 (如无效的 ID)
     * - noData: 无数据状态
     */
    variant?: 'default' | 'error' | 'noData';
    /**
     * 是否显示在页面容器中 (添加额外的 margin)
     */
    inContainer?: boolean;
    /**
     * 自定义图标
     */
    image?: React.ReactNode;
}

/**
 * App 级别的 Empty 组件
 * 
 * 特性:
 * - 统一的暗色模式适配
 * - 预设的样式变体
 * - 一致的视觉风格
 * - 支持自定义图标和样式
 * 
 * @example
 * // 基本使用
 * <AppEmpty description="暂无数据" />
 * 
 * // 错误状态
 * <AppEmpty variant="error" description="无效的 ID" />
 * 
 * // 自定义图标
 * <AppEmpty 
 *   image={<span className="i-carbon:folder-blank" style={{fontSize: '64px'}}/>}
 *   description="暂无分类"
 * />
 * 
 * // 在容器中
 * <AppEmpty inContainer description="暂无评论" />
 */
export const AppEmpty: React.FC<AppEmptyProps> = ({
    variant = 'default',
    inContainer = false,
    image,
    description,
    className,
    style,
    ...restProps
}) => {
    // 根据 variant 设置默认图标
    const defaultImage = image || (
        variant === 'error' 
            ? <span className="i-carbon:warning-alt" style={{fontSize: '64px'}}/>
            : variant === 'noData'
                ? <span className="i-carbon:database" style={{fontSize: '64px'}}/>
                : <span className="i-carbon:document-blank" style={{fontSize: '64px'}}/>
    );

    return (
        <div 
            className={`${styles.emptyWrapper} ${inContainer ? styles.inContainer : ''} ${className || ''}`}
            style={style}
        >
            <Empty
                {...restProps}
                description={description}
                image={defaultImage}
                className={styles.appEmpty}
            />
        </div>
    );
};

export default AppEmpty;
