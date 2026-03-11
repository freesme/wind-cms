/**
 * useI18nRouter 使用示例
 */

'use client';

import {useI18nRouter} from '@/i18n/helpers/useI18nRouter';
import {useI18n} from '@/i18n/helpers/useI18n';

/**
 * 示例 1: 基础导航
 */
export function NavigationExample() {
    const router = useI18nRouter();
    
    return (
        <div>
            {/* 自动添加语言前缀的导航 */}
            <button onClick={() => router.push('/category/1')}>
                查看分类
            </button>
            
            <button onClick={() => router.push('/post/123')}>
                查看文章
            </button>
            
            <button onClick={() => router.push('/settings/profile')}>
                个人设置
            </button>
            
            {/* 获取本地化路径 */}
            <a href={router.localizedPath('/about')}>
                关于我们
            </a>
            
            {/* 返回上一页 */}
            <button onClick={() => router.back()}>
                返回
            </button>
        </div>
    );
}

/**
 * 示例 2: 在分类列表中使用
 */
export function CategoryListExample() {
    const router = useI18nRouter();
    
    const categories = [
        {id: 1, name: '技术'},
        {id: 2, name: '生活'},
        {id: 3, name: '随笔'},
    ];
    
    return (
        <ul>
            {categories.map(category => (
                <li key={category.id}>
                    <button 
                        onClick={() => router.push(`/category/${category.id}`)}
                    >
                        {category.name}
                    </button>
                </li>
            ))}
        </ul>
    );
}

/**
 * 示例 3: 结合 useI18n 使用
 */
export function ArticleCardExample() {
    const t = useI18n('page.home');
    const router = useI18nRouter();
    
    const article = {
        id: 123,
        title: 'React Hooks 最佳实践',
        categoryId: 1,
    };
    
    return (
        <div>
            <h3>{article.title}</h3>
            
            <button onClick={() => router.push(`/post/${article.id}`)}>
                {t('read_more')}
            </button>
            
            <button onClick={() => router.push(`/category/${article.categoryId}`)}>
                {t('view_category')}
            </button>
        </div>
    );
}

/**
 * 示例 4: 带参数的导航
 */
export function NavigationWithParamsExample() {
    const router = useI18nRouter();
    
    const handleViewPost = (postId: number) => {
        // 路径参数会自动保留
        router.push(`/post/${postId}?tab=comments`);
    };
    
    const handleSearch = (query: string) => {
        // 查询参数也会自动保留
        router.push(`/search?q=${encodeURIComponent(query)}`);
    };
    
    return (
        <div>
            <button onClick={() => handleViewPost(123)}>
                查看文章
            </button>
            <button onClick={() => handleSearch('React')}>
                搜索
            </button>
        </div>
    );
}

/**
 * 示例 5: 替换历史记录（不保留当前历史）
 */
export function ReplaceExample() {
    const router = useI18nRouter();
    
    const handleLoginSuccess = () => {
        // 登录后替换到首页，用户无法通过后退回到登录页
        router.replace('/');
    };
    
    return (
        <button onClick={handleLoginSuccess}>
            登录成功，跳转
        </button>
    );
}

/**
 * 对比：旧的实现方式（需要手动处理）
 */
export function OldWayExample() {
    // ❌ 旧方式：需要从 next/navigation 导入
    // import {useRouter} from 'next/navigation';
    // const router = useRouter();
    
    // ❌ 需要手动拼接语言前缀
    // const locale = 'zh-CN';
    // router.push(`/${locale}/category/1`);
    
    // ✅ 新方式：自动处理语言前缀
    const router = useI18nRouter();
    router.push('/category/1'); // 自动添加当前语言前缀
    
    return <div>查看控制台</div>;
}
