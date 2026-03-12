/**
 * 主题初始化脚本
 * 在 HTML 加载时立即执行，防止主题闪烁
 */
export default function initThemeScript() {
    // 检查是否有存储的主题偏好（使用与 store 一致的 key：app-theme-mode）
    const storedMode = (() => {
        try {
            return localStorage.getItem('app-theme-mode');
        } catch (error) {
            console.warn('无法访问 localStorage:', error);
            return null;
        }
    })();
    
    if (storedMode) {
        // 如果有存储的偏好，直接使用
        document.documentElement.classList.add(storedMode);
    } else {
        // 如果没有存储的偏好，根据系统主题设置
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = isDark ? 'dark' : 'light';
        document.documentElement.classList.add(theme);
    }
}
