// components/VideoPlayer.tsx
import { StyleSheet, Dimensions, View, TouchableOpacity } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { Video, ResizeMode } from 'expo-av';
import { WebView } from 'react-native-webview';
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ScreenOrientation from 'expo-screen-orientation';

interface VideoPlayerProps {
  source: any;
  isVisible: boolean;
  onClose: () => void;
  isYouTube?: boolean;
  youtubeId?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  source,
  isVisible,
  onClose,
  isYouTube = false,
  youtubeId = "",
}) => {
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    let isMounted = true;

    const setupOrientation = async () => {
      if (isVisible && isFullscreen) {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } else {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
        );
      }
    };

    setupOrientation();

    return () => {
      isMounted = false;
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, [isVisible, isFullscreen]);

  const toggleFullscreen = async () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isYouTube) {
    return (
      <View style={[
        styles.container,
        isFullscreen ? styles.fullscreenContainer : null
      ]}>
        <WebView
          style={[
            styles.video,
            isFullscreen ? {
              width: height,
              height: width,
            } : {
              width: width * 0.9,
              height: height * 0.4,
            }
          ]}
          source={{
            uri: `https://www.youtube.com/embed/${youtubeId}?playsinline=1&autoplay=1`
          }}
          allowsFullscreenVideo={true}
        />
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={async () => {
              await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT
              );
              setIsFullscreen(false);
              onClose();
            }}
          >
            <Feather name="x" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      isFullscreen ? styles.fullscreenContainer : null
    ]}>
      <Video
        ref={videoRef}
        source={source}
        style={[
          styles.video,
          isFullscreen ? {
            width: height,
            height: width,
          } : {
            width: width * 0.9,
            height: height * 0.4,
          }
        ]}
        resizeMode={ResizeMode.CONTAIN}
        useNativeControls
        isLooping
        shouldPlay={isVisible}
      />
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={async () => {
            await ScreenOrientation.lockAsync(
              ScreenOrientation.OrientationLock.PORTRAIT
            );
            setIsFullscreen(false);
            onClose();
          }}
        >
          <Feather name="x" size={30} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.fullscreenButton}
          onPress={toggleFullscreen}
        >
          <Ionicons 
            name={isFullscreen ? "contract" : "expand"} 
            size={25} 
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... existing styles remain the same
});

export default VideoPlayer;