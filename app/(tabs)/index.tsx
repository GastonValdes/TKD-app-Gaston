import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from '@/components/Header'
import CategoryButtons from '@/components/CategoryButtons'
import Listings from '@/components/Listings'
import ListinData from '@/data/destinations.json';

type Props = {}

const Page = (props: Props) => {
  const {top: safeTop} = useSafeAreaInsets ();
  const [category, setCategory] = useState('Todos');
  
  const onCatChanged = (category: string) => {
console.log("Category: ",category);
setCategory(category);
  }

  return (
    <View style={[styles.container, {paddingTop: safeTop}]}>
      < Header/>
    
      <CategoryButtons onCategoryChanged={onCatChanged} />

      <Listings listings={ListinData} category={category} />
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
})