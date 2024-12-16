// components/LanguageSelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, changeLanguage } from '../i18n';
import { Colors } from '@/constants/Colors';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const selectLanguage = async (lang: string) => {
    await changeLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('language')}</Text>
      <View style={styles.languageButtons}>
        {Object.entries(LANGUAGES).map(([code, language]) => (
          <TouchableOpacity
            key={code}
            style={[
              styles.languageButton,
              i18n.language === code && styles.selectedLanguage,
            ]}
            onPress={() => selectLanguage(code)}
          >
            <Text
              style={[
                styles.languageText,
                i18n.language === code && styles.selectedLanguageText,
              ]}
            >
              {language.nativeName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 10,
    margin: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: Colors.tabIconSelected,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  languageButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.tabIconSelected,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedLanguage: {
    backgroundColor: Colors.tabIconSelected,
  },
  languageText: {
    color: Colors.tabIconSelected,
    fontSize: 16,
    fontWeight: '500',
  },
  selectedLanguageText: {
    color: Colors.white,
  },
});

export default LanguageSelector;