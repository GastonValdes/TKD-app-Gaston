import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import CategoryButtons from '@/components/CategoryButtons';
import Listings from '@/components/Listings';

const Page = () => {
  const { top: safeTop } = useSafeAreaInsets();
  const [category, setCategory] = useState('Todos');
  
  const onCatChanged = (category: string) => {
    setCategory(category);
  };

  return (
    <View style={[styles.container, { paddingTop: safeTop }]}>
      <Header />
      <CategoryButtons onCategoryChanged={onCatChanged} />
      <Listings category={category} />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});