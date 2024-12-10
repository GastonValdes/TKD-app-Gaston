import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface ZoomableTheoryBlockProps {
  title?: string;
  theory?: string;
  children?: React.ReactNode;
}

const ZoomableTheoryBlock = ({ title, theory, children }: ZoomableTheoryBlockProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  // Animation values for collapse
  const contentHeight = useSharedValue(0);
  
  // Animation values for zoom
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const toggleCollapse = () => {
    if (isZoomed) {
      // Reset zoom when collapsing
      resetZoom();
    }
    
    setIsCollapsed(!isCollapsed);
    contentHeight.value = withTiming(isCollapsed ? 1000 : 0, {
      duration: 300,
    });
  };

  const resetZoom = () => {
    scale.value = withSpring(1);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    setIsZoomed(false);
  };

  // Gesture handlers
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
      setIsZoomed(event.scale > 1);
    })
    .onEnd(() => {
      if (scale.value < 1) {
        resetZoom();
      }
    });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        resetZoom();
      }
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture);

  // Animated styles
  const animatedContentStyle = useAnimatedStyle(() => ({
    maxHeight: contentHeight.value,
    opacity: contentHeight.value === 0 ? 0 : 1,
  }));

  const animatedZoomStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={toggleCollapse}
        style={styles.headerContainer}
      >
        <Text style={styles.theorytitle}>{title}</Text>
        <Ionicons
          name={isCollapsed ? "chevron-down" : "chevron-up"}
          size={24}
          color={Colors.primaryColor}
        />
      </TouchableOpacity>
      
      <Animated.View style={[styles.contentContainer, animatedContentStyle]}>
        <GestureHandlerRootView>
          <GestureDetector gesture={composed}>
            <Animated.View style={[styles.zoomContainer, animatedZoomStyle]}>
              {theory && <Text style={styles.theory}>{theory}</Text>}
              {children}
            </Animated.View>
          </GestureDetector>
        </GestureHandlerRootView>
      </Animated.View>

      {isZoomed && (
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={resetZoom}
        >
          <Ionicons name="contract" size={24} color={Colors.primaryColor} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  contentContainer: {
    overflow: 'hidden',
  },
  zoomContainer: {
    width: '100%',
  },
  theorytitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  theory: {
    paddingHorizontal: 10,
  },
  resetButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ZoomableTheoryBlock;