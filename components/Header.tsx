import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";



type Props = {}

const Header = (props: Props) => {
    const {top: safeTop} = useSafeAreaInsets ();
    return (
        <View style={styles.container}>
            <Image source={require('@/assets/images/Header.png')} style={styles.userImg}/>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    container: {
        
    },
    userImg:{
        width: '100%',
        height: 80,
        resizeMode: 'center'         
    }
})