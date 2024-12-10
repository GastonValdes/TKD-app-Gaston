import { StyleSheet, Dimensions, View, TouchableOpacity } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { Video, ResizeMode } from 'expo-av';  
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ScreenOrientation from 'expo-screen-orientation';

interface FullscreenVideoPlayerProps {
  source: any;
  isVisible: boolean;
  onClose: () => void;
}

const FullscreenVideoPlayer: React.FC<FullscreenVideoPlayerProps> = ({
  source,
  isVisible,
  onClose,
}) => {
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    let isMounted = true;

    const setupOrientation = async () => {
      if (isVisible && isFullscreen) {
        // Lock to landscape orientation when video is fullscreen
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } else {
        // Return to portrait orientation when not fullscreen
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
        );
      }
    };

    setupOrientation();

    return () => {
      isMounted = false;
      // Reset orientation when component unmounts
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, [isVisible, isFullscreen]);

  const toggleFullscreen = async () => {
    setIsFullscreen(!isFullscreen);
  };

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
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  video: {
    backgroundColor: '#000',
  },
  controls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    zIndex: 1,
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  fullscreenButton: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
});

export default FullscreenVideoPlayer;