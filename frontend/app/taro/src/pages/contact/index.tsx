import {useTranslation} from 'react-i18next';
import {View, Text} from '@tarojs/components';


import styles from './contact.scss';

export default function ContactPage() {
  const {t} = useTranslation('page.legal.contact');

  return (
    <View className={styles.infoPage}>
      {/* Hero Section */}
      <View className={styles.hero}>
        <View className={styles.heroContent}>
          <Text className={styles.heroTitle}>{t('title')}</Text>
          <Text className={styles.heroSubtitle}>{t('description')}</Text>
        </View>
      </View>

      {/* Content Section */}
      <View className={styles.infoCard}>
        <View className={styles.list}>
          <Text>{t('item_1')}</Text>
          <Text>{t('item_2')}</Text>
          <Text>{t('item_3')}</Text>
        </View>
      </View>
    </View>
  );
}
