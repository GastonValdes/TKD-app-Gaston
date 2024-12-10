import React from 'react'
import { Tabs } from 'expo-router'
import { TabBar } from '@/components/TabBar'
import { StatusBar } from 'react-native'
import { Colors } from "@/constants/Colors";

const TabLayout = () => {
  return (
    <>
      <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
          }}
        />
        
        <Tabs.Screen
          name="saved"
          options={{
            title: "Favoritos",
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Acerca de",
          }}
        />
      </Tabs>
      <StatusBar barStyle={'dark-content'} />
    </>
  )
}

export default TabLayout