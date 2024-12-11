import { StyleSheet, Text, View, Image, Linking, TouchableOpacity } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { Colors } from '@/constants/Colors';

type Props = {};

const Page = (props: Props) => {
  const { top: safeTop } = useSafeAreaInsets();

  const handleEmailPress = () => {
    Linking.openURL('mailto:gastonvaldes@gmail.com');
  };

  return (
    <View style={[styles.container, { paddingTop: safeTop }]}>
      <Header />
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.title}>Acerca De</Text>
        <Text style={styles.textarea}>
          ITF Taekwon-Do App{"\n"}Version 3.17
        </Text>
        <Image source={require('@/assets/images/LargeIcon.png')} style={styles.centerImg} />
        <Text style={styles.textarea}>Copyright 2024{"\n"}Boo Sabum Gastón R. Valdés</Text>
        <Text>2do DAN Internacional Taekwon-do ITF</Text>
        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.link}>gastonvaldes@gmail.com</Text>
        </TouchableOpacity>
        <Text style={{textAlign: 'center'}}>Esta Aplicacion no tiene afiliacion con la International Taekwon-Do Federation{"\n"}Su contenido refleja las enseñanzas del estilo de Taekwon-Do ITF desarrollado por el General Choi Hong Hi</Text>
      </View>
    </View>
  );
};

export default Page;

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
});
