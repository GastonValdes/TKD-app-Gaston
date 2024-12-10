import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, Linking } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import Animated, { FadeIn, FadeInDown, FadeInRight } from "react-native-reanimated";
import { StatusBar } from "react-native";

const Page = () => {
  const router = useRouter();

  const handleEmailPress = () => {
    Linking.openURL("mailto:gastonvaldes@gmail.com");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require("@/assets/images/background.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={styles.wrapper}>
          <Animated.Text
            style={styles.title}
            entering={FadeInRight.delay(300).duration(500)}
          >
            ITF Taekwon-Do App V3.17
          </Animated.Text>
          <Animated.Text
            style={styles.description}
            entering={FadeInRight.delay(700).duration(500)}
          >
            Su complemento ideal fuera del Dojang
          </Animated.Text>
          <Animated.Text
            style={styles.description}
            entering={FadeInRight.delay(700).duration(500)}
          >
            Creada por: Gastón Valdés{"\n"}
            <Text style={styles.link} onPress={handleEmailPress}>
              gastonvaldes@gmail.com
            </Text>
          </Animated.Text>
          <Animated.View entering={FadeInDown.delay(1200).duration(500)}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => router.replace("/(tabs)")}
            >
              <Text style={styles.btnText}>Iniciar</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 50,
    paddingHorizontal: 30,
    gap: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  title: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 1.5,
    lineHeight: 36,
    textAlign: "center",
  },
  description: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 1.2,
    lineHeight: 22,
    textAlign: "center",
  },
  link: {
    color: Colors.white,
    textDecorationLine: "underline",
  },
  btn: {
    backgroundColor: Colors.tint,
    paddingVertical: 15,
    marginVertical: 20,
    alignItems: "center",
    borderRadius: 10,
  },
  btnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
