import { StyleSheet, Text, View, Image, Linking, TouchableOpacity } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';

type Props = {};

const settings = (props: Props) => {
  const { t } = useTranslation();
  const { top: safeTop } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: safeTop }]}>
      <Header />
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.title}>{t('settingsTitle')}</Text>
        <LanguageSelector />
      </View>
    </View>
  );
};

export default settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerImg: {
    borderRadius: 30,
    paddingVertical: 50,
    width: 100,
    height: 100,
  },
  title: {
    paddingVertical: 50,
    textAlign: 'center',
    fontSize: 30,
    color: Colors.tabIconSelected,
    fontWeight: '600',
  },
  textarea: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  aboutText: {
    color: Colors.softText,
    paddingHorizontal: 20,
    paddingVertical: 20,
    textAlign: 'center',
    textShadowColor: Colors.black,
    borderColor: Colors.softText,
    borderStyle: 'solid',
    borderRadius: 20,
    backgroundColor: Colors.white,
    marginHorizontal: 15,
    marginVertical: 15,
  },
});