import React from 'react';
import {createFromIconfontCN} from '@ant-design/icons';

interface XIconProps {
 name: string;
 size?: number | string;
 color?: string;
 className?: string;
 style?: React.CSSProperties;
}

// 在组件外部创建 IconFont，避免在 render 中创建
const IconFont = createFromIconfontCN({
 scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js', // 替换为实际的 iconfont 地址
});

/**
 * 通用图标组件
 * 支持 carbon 图标库
 */
export const XIcon: React.FC<XIconProps> = ({name, size = 24, color, className, style}) => {
 // 从名称中提取图标，例如 "carbon:home" -> "home"
 const iconName = name.includes(':') ? name.split(':')[1] : name;

 return (
  <span
    className={className}
   style={{
     fontSize: typeof size === 'string' ? size : `${size}px`,
  color,
   display: 'inline-flex',
   alignItems: 'center',
      justifyContent: 'center',
     ...style,
    }}
  >
    <IconFont type={`icon-${iconName}`} />
  </span>
 );
};

/**
 * 备用方案：使用 SVG 直接渲染
 */
export const XIconSvg: React.FC<XIconProps> = ({name, size = 24, color, className, style}) => {
 const iconName = name.includes(':') ? name.split(':')[1] : name;

 return (
  <svg
    className={className}
   width={typeof size === 'string' ? size : size}
    height={typeof size === 'string' ? size : size}
    viewBox="0 0 24 24"
    fill={color || 'currentColor'}
   style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style}}
  >
    {/* 这里可以根据 iconName 渲染不同的 SVG path */}
    {/* 示例：占位符 */}
    <circle cx="12" cy="12" r="10" />
  </svg>
 );
};

// 默认导出
export default XIcon;
