import {useEffect} from "react";
import {View} from '@tarojs/components';

import HeroSection from './components/HeroSection';
import FeaturedPostsSection from './components/FeaturedPostsSection';
import CategoryListSection from './components/CategoryListSection';
import PopularTagsSection from './components/PopularTagsSection';
import LatestPostsSection from './components/LatestPostsSection';
import FeaturesSection from './components/FeaturesSection';

import './index.scss';
import './page.scss';

export default function Home() {

  // 获取路由参数
  useEffect(() => {
    console.log('[Home Page] Component mounted');
    // 可以在这里获取 URL 参数中的 locale
  }, []);

  return (
    <View className='home-page'>
      {/* Hero Section - 首屏展示 */}
      <HeroSection/>
      
      {/* Featured Posts - 精选文章 */}
      <View className='section-container'>
        <FeaturedPostsSection/>
      </View>
      
      {/* Categories - 分类浏览 */}
      <View className='section-container'>
        <CategoryListSection/>
      </View>
      
      {/* Latest Posts - 最新文章 */}
      <View className='section-container'>
        <LatestPostsSection/>
      </View>
      
      {/* Popular Tags - 热门标签 */}
      <View className='section-container'>
        <PopularTagsSection/>
      </View>
      
      {/* Features - 特性介绍 */}
      <View className='section-container'>
        <FeaturesSection/>
      </View>
    </View>
  );
}
