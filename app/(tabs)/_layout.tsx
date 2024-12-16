import React from 'react'
import { Tabs } from 'expo-router'
import { TabBar } from '@/components/TabBar'
import { StatusBar } from 'react-native'
import { Colors } from "@/constants/Colors";
import { useTranslation } from 'react-i18next';
import '@/i18n';

const TabLayout = () => {
  const { t } = useTranslation();
  return (
    <>
      <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: t('home'),
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            title: t('favorites'),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t('settings'),
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: t('about'),
          }}
        />
      </Tabs>
      <StatusBar barStyle={'dark-content'} />
    </>
  );
};

export default TabLayout