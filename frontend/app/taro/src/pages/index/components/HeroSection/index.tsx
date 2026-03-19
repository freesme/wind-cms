import {useTranslation} from 'react-i18next';
import {View, Text} from '@tarojs/components';

import {useI18nRouter} from '@/i18n/helpers/useI18nRouter';

import './index.scss';

export default function HeroSection() {
  const {t} = useTranslation('page.home');
  const {t: brandT} = useTranslation('authentication.login');
  const router = useI18nRouter();

  console.log('[HeroSection] Rendering...', { t, brandT });

  return (
    <View className='hero'>
      {/* 简化背景 - 移除复杂动画 */}
      <View className='hero-bg-wrapper'>
        <View className='hero-gradient-bg'/>
        {/* H5 端保留简单的网格背景 */}
        <View className='hero-grid-bg'/>
      </View>

      <View className='hero-content'>
        <Text className='hero-title'>{brandT('brand_title')}</Text>
        <Text className='hero-subtitle'>{brandT('brand_subtitle')}</Text>
        <Text className='hero-description'>{t('hero_description')}</Text>
        <View className='hero-actions'>
          <View
            className='btn btn-primary'
            onClick={() => router.push('/post')}
          >
            <Text>{t('browse_posts')}</Text>
          </View>
          <View
            className='btn btn-secondary'
            onClick={() => router.push('/about')}
          >
            <Text>{t('learn_more')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
