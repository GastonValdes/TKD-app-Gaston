import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, ScrollView, Modal } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ListingType } from '@/types/listingTypes';
import { Feather, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Header from '@/components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import FullscreenVideoPlayer from '@/components/FullscreenVideoPlayer';
import { Video, ResizeMode } from 'expo-av';
import CollapsibleTheoryBlock from "@/components/CollapsibleTheoryBlock";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');
    
// Your existing imageMapping object here
const imageMapping: Record<string, any> = {
    "blanco.png": require("@/assets/images/blanco.png"),
    "punta-amarilla.png": require("@/assets/images/punta-amarilla.png"),
    "amarillo.png": require("@/assets/images/amarillo.png"),
    "punta-verde.png": require("@/assets/images/punta-verde.png"),
    "verde.png": require("@/assets/images/verde.png"),
    "punta-azul.png": require("@/assets/images/punta-azul.png"),
    "azul.png": require("@/assets/images/azul.png"),
    "punta-roja.png": require("@/assets/images/punta-roja.png"),
    "rojo.png": require("@/assets/images/rojo.png"),
    "punta-negra.png": require("@/assets/images/punta-negra.png"),
    "chariotFeet.png": require("@/assets/images/chariotFeet.png"),
    "default.png": require("@/assets/images/default.png"), // Fallback image
    "annunFeet.png": require("@/assets/images/annunFeet.png"),
    "sajuchiruji.png": require("@/assets/images/sajuchiruji.png"),
    "defensaBaja.png": require("@/assets/images/defensaBaja.png"),
    "defensaMedia.png": require("@/assets/images/defensaMedia.png"),
    "defensaBajaManoAbrierta.png": require("@/assets/images/defensaBajaManoAbrierta.png"),
    "apchagui.png": require("@/assets/images/apchagui.png"),
    "1_chonji.png": require("@/assets/images/1_chonji.png"),
    "2_dangun.png": require("@/assets/images/2_dangun.png"),
    "3_dosan.png": require("@/assets/images/3_dosan.png"),
    "1erlogoitf.png": require("@/assets/images/1erlogoitf.png"),
    "4_wonhyo.png": require("@/assets/images/4_wonhyo.png"),
    "shinewavemovement.png": require("@/assets/images/shinewavemovement.png"),
    "5_yulguk.png": require("@/assets/images/5_yulguk.png"),
    "6_joonggun.png": require("@/assets/images/6_joonggun.png"),
    "7_toigye.png": require("@/assets/images/7_toigye.png"),
    "8_hwarang.png": require("@/assets/images/8_hwarang.png"),
    "9_choongmoo.png": require("@/assets/images/9_choongmoo.png"),
    "tkd.png": require("@/assets/images/tkd.png"),
    "courtesy.png": require("@/assets/images/courtesy.png"),
    "integrity.png": require("@/assets/images/integrity.png"),
    "perseverance.png": require("@/assets/images/perseverance.png"),
    "selfcontrol.png": require("@/assets/images/selfcontrol.png"),
    "indomitablespirit.png": require("@/assets/images/indomitablespirit.png"),
    "history.png": require("@/assets/images/history.png"),
    "combate.png": require("@/assets/images/combate.png"),
    "1erDAN.png": require("@/assets/images/1erDAN.png"),
    "2doDAN.png": require("@/assets/images/2doDAN.png"),
    "3erDAN.png": require("@/assets/images/3erDAN.png"),
    "10_kwanggae.png": require("@/assets/images/10_kwanggae.png"),
    "ITF_Patterns_Poster_LowRes.png": require("@/assets/images/ITF_Patterns_Poster_LowRes.png"),
    "powerbrake2.png": require("@/assets/images/powerbrake2.png"),    
    "powerbrake.png": require("@/assets/images/powerbrake.png"),
    "video1.mp4": require("@/assets/videos/video1.mp4"),
    "tul.png": require("@/assets/images/tul.png"),
    "sparring.jpg": require("@/assets/images/sparring.jpg"),
    "carta.jpg": require("@/assets/images/carta.jpg"),
    "moral3.png": require("@/assets/images/moral3.png"),
    "culturamoral.png": require("@/assets/images/culturamoral.png"),
    "Terminology.png": require("@/assets/images/Terminology.png"),
    "patada.png": require("@/assets/images/patada.png"),
    "yop-Chagui.jpg": require("@/assets/images/yop-Chagui.jpg"),
    "Ap-Chagui.jpg": require("@/assets/images/Ap-Chagui.jpg"),
    "dollyo-chagui.png": require("@/assets/images/dollyo-chagui.png"),
    "tuit-Chagui.jpg": require("@/assets/images/tuit-Chagui.jpg"),
    "neryo-Chagui.jpg": require("@/assets/images/neryo-Chagui.jpg"),
    "bituro-Chagui.png": require("@/assets/images/bituro-Chagui.png"),
    "goro-Chagui.png": require("@/assets/images/goro-Chagui.png"),
    "bandae-dollyo.jpg": require("@/assets/images/bandae-dollyo.jpg"),
    
    // ... rest of your image mappings
};

const ListingDetails = () => {
    const { id } = useLocalSearchParams();
    const { t } = useTranslation();
    const { getItem } = useTranslatedContent();
    const listing = getItem(id as string);

    const [selectedMedia, setSelectedMedia] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [bookmark, setBookmark] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isVideo, setIsVideo] = useState<boolean>(false);
    const videoRef = useRef(null);
    const [status, setStatus] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [selectedVideoId, setSelectedVideoId] = useState<string>('');

    // Animation values
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    // Basic helper functions first
    const handleImagePress = (imageSource: any) => {
        scale.value = 1;
        setSelectedMedia(imageSource);
        setIsVideo(false);
        setIsModalVisible(true);
    };

    const handleMediaPress = (mediaSource: any, fileName: string) => {
        scale.value = 1;
        translateX.value = 0;
        translateY.value = 0;
        
        // Handle YouTube videos
        const isYouTube = fileName.startsWith('youtube:');
        if (isYouTube) {
            const youtubeId = fileName.split(':')[1];
            setSelectedVideoId(youtubeId);
            setSelectedMedia(null); // Set to null for YouTube videos
        } else {
            setSelectedMedia(mediaSource);
            setSelectedVideoId('');
        }
        
        setIsVideo(isYouTube || isVideoFile(fileName));
        setIsModalVisible(true);
    };

    const isVideoFile = (fileName: string) => {
        return fileName.toLowerCase().endsWith('.mp4') || 
               fileName.toLowerCase().endsWith('.mov') || 
               fileName.toLowerCase().endsWith('.avi');
    };

    // Rendering helper functions
    const renderTouchableImage = (imageSource: any, style: any) => {
        return (
            <TouchableOpacity onPress={() => handleImagePress(imageSource)}>
                <Image
                    source={imageSource}
                    style={style}
                />
            </TouchableOpacity>
        );
    };

    const createImageSource = (imagePath: string | undefined) => {
        if (!imagePath) return null;
        return imagePath.startsWith("http")
            ? { uri: imagePath }
            : imageMapping[imagePath];
    };

    const createNumberedImageSources = (num: number) => ({
        a: createImageSource(listing?.[`imageth${num}a` as keyof typeof listing] as string),
        b: createImageSource(listing?.[`imageth${num}b` as keyof typeof listing] as string),
        c: createImageSource(listing?.[`imageth${num}c` as keyof typeof listing] as string)
    });

    const imageSources = Array.from({ length: 40 }, (_, i) => createNumberedImageSources(i + 1));

    // More complex render functions
    const renderTheoryBlock = (index: number) => {
        const titleKey = `titletheory${index}` as keyof typeof listing;
        const theoryKey = `theory${index}` as keyof typeof listing;
        const videosKey = `videos${index}` as keyof typeof listing;
        const sources = imageSources[index - 1];

        if (!listing?.[titleKey] && !listing?.[theoryKey] && !sources.a && !sources.b && !sources.c) {
            return null;
        }

        return (
            <View key={index} style={styles.blocks}>
                <CollapsibleTheoryBlock
                    title={listing?.[titleKey] as string}
                    theory={listing?.[theoryKey] as string}
                >
                    {/* Render images if available */}
                    {(sources.a || sources.b || sources.c) && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                        >
                            {sources.a && renderTouchableImage(sources.a, styles.imageSec)}
                            {sources.b && renderTouchableImage(sources.b, styles.imageSec)}
                            {sources.c && renderTouchableImage(sources.c, styles.imageSec)}
                        </ScrollView>
                    )}
                    
                    {/* Render specific videos for this theory block if available */}
                    {listing?.[videosKey] && Array.isArray(listing[videosKey]) && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                        >
                            {(listing[videosKey] as string[]).map((videoName, vidIndex) => {
                                const isYouTube = videoName.startsWith('youtube:');
                                const youtubeId = isYouTube ? videoName.split(':')[1] : '';
                                const videoSource = isYouTube ? null : imageMapping[videoName];
                
                                return (
                                    <TouchableOpacity 
                                        key={vidIndex}
                                        onPress={() => handleMediaPress(videoSource, videoName)}
                                    >
                                        <View style={styles.videoContainer}>
                                            {isYouTube ? (
                                                <Image
                                                    source={{ uri: `https://img.youtube.com/vi/${youtubeId}/0.jpg` }}
                                                    style={styles.videoThumbnail}
                                                />
                                            ) : (
                                                <Video
                                                    source={videoSource}
                                                    style={styles.videoThumbnail}
                                                    resizeMode={ResizeMode.COVER}
                                                    shouldPlay={false}
                                                    isMuted={true}
                                                    useNativeControls={false}
                                                    isLooping={false}
                                                />
                                            )}
                                            <View style={styles.playButtonOverlay}>
                                                <Ionicons name="play-circle" size={30} color="white" />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    )}
                </CollapsibleTheoryBlock>
            </View>
        );
    };

    const renderVideos = (listing: ListingType) => {
        if (!listing.videos || listing.videos.length === 0) return null;
        
        return (
            <View style={styles.blocks}>
                <Text style={styles.theorytitle}>{t('videos')}</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                >
                    {listing.videos.map((videoName, index) => {
                        const isYouTube = videoName.startsWith('youtube:');
                        const youtubeId = isYouTube ? videoName.split(':')[1] : '';
                        const videoSource = isYouTube ? null : imageMapping[videoName];
    
                        return (
                            <TouchableOpacity 
                                key={index}
                                onPress={() => handleMediaPress(videoSource, videoName)}
                            >
                                <View style={styles.videoContainer}>
                                    {isYouTube ? (
                                        <Image
                                            source={{ uri: `https://img.youtube.com/vi/${youtubeId}/0.jpg` }}
                                            style={styles.videoThumbnail}
                                        />
                                    ) : (
                                        <Video
                                            source={videoSource}
                                            style={styles.videoThumbnail}
                                            resizeMode={ResizeMode.COVER}
                                            shouldPlay={false}
                                            isMuted={true}
                                            useNativeControls={false}
                                            isLooping={false}
                                        />
                                    )}
                                    <View style={styles.playButtonOverlay}>
                                        <Ionicons name="play-circle" size={30} color="white" />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        );
    };

    // Bookmark functions
    const saveBookmark = async (itemId: string) => {
        try {
            let bookmarksStr = await AsyncStorage.getItem('bookmark');
            let bookmarks = [];
            
            if (bookmarksStr) {
                try {
                    bookmarks = JSON.parse(bookmarksStr);
                    if (!Array.isArray(bookmarks)) {
                        bookmarks = [];
                    }
                } catch (e) {
                    bookmarks = [];
                }
            }
    
            if (!bookmarks.includes(itemId)) {
                bookmarks.push(itemId);
                await AsyncStorage.setItem('bookmark', JSON.stringify(bookmarks));
                setBookmark(true);
                setAlertMessage(t('addedToFavorites'));
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 2000);
            }
        } catch (error) {
            console.error('Error in saveBookmark:', error);
            setAlertMessage(t('errorSavingFavorite'));
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);
        }
    };

    const removeBookmark = async (itemId: string) => {
        try {
            const bookmarksStr = await AsyncStorage.getItem('bookmark');
            if (!bookmarksStr) return;
    
            let bookmarks = JSON.parse(bookmarksStr);
            if (!Array.isArray(bookmarks)) return;
    
            bookmarks = bookmarks.filter((id: string) => id !== itemId);
            await AsyncStorage.setItem('bookmark', JSON.stringify(bookmarks));
            setBookmark(false);
            setAlertMessage(t('removedFromFavorites'));
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);
        } catch (error) {
            console.error('Error in removeBookmark:', error);
            setAlertMessage(t('errorRemovingFavorite'));
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);
        }
    };

    // Effects
    useEffect(() => {
        const initializeBookmark = async () => {
            if (listing) {
                try {
                    setIsLoading(true);
                    let bookmarksStr = await AsyncStorage.getItem('bookmark');
                    
                    if (!bookmarksStr) {
                        bookmarksStr = '[]';
                        await AsyncStorage.setItem('bookmark', bookmarksStr);
                    }

                    const bookmarks = JSON.parse(bookmarksStr);
                    const isBookmarked = Array.isArray(bookmarks) && bookmarks.includes(listing.id);
                    setBookmark(isBookmarked);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error in bookmark initialization:', error);
                    setIsLoading(false);
                }
            }
        };

        initializeBookmark();
    }, [listing]);

    // Gesture handlers
    const pinchGesture = Gesture.Pinch()
        .onStart(() => {
            savedScale.value = scale.value;
        })
        .onUpdate((event) => {
            scale.value = savedScale.value * event.scale;
        })
        .onEnd(() => {
            if (scale.value < 1) {
                scale.value = withSpring(1);
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
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
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
        });

    const composed = Gesture.Simultaneous(pinchGesture, panGesture);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value }
        ]
    }));

    if (!listing) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{t('listingNotFound')}</Text>
            </View>
        );
    }

    const imageSource = listing.image.startsWith("http")
        ? { uri: listing.image }
        : imageMapping[listing.image];

    return (
        <>
            <Stack.Screen 
                options={{
                    headerTransparent: true,
                    headerTitle: "",
                    headerShown: false,
                }}
            />
            <View style={styles.container}>
                <Header/>
                
                {/* Back Button */}
                <TouchableOpacity 
                    style={styles.backButton}
                    activeOpacity={0.6}
                    onPress={() => router.replace('/(tabs)')}
                >
                    <Ionicons 
                        name="arrow-back" 
                        size={24} 
                        color={Colors.primaryColor}
                    />
                </TouchableOpacity>
    
                {/* Bookmark Button */}
                <TouchableOpacity 
                    style={styles.bookmarkButton}
                    activeOpacity={0.6}
                    onPress={() => {
                        if (isLoading || !listing) return;
                        if (bookmark) {
                            removeBookmark(listing.id);
                        } else {
                            saveBookmark(listing.id);
                        }
                    }}
                >
                    <Ionicons 
                        name={bookmark ? "bookmark" : 'bookmark-outline'} 
                        size={24} 
                        color={isLoading ? Colors.lightGrey : Colors.primaryColor}
                    />
                </TouchableOpacity>
    
                {/* Custom Alert */}
                {showAlert && (
                    <Animated.View style={styles.alertContainer}>
                        <Ionicons 
                            name={alertMessage.includes(t('addedToFavorites')) ? 'bookmark' : 'bookmark-outline'} 
                            size={20} 
                            color="white" 
                        />
                        <Text style={styles.alertText}>{alertMessage}</Text>
                    </Animated.View>
                )}
    
                {/* Main Content */}
                <View style={{ flexDirection: 'row'}}>
                    <View style={{ flex:1}}>
                        {renderTouchableImage(imageSource, styles.image)}
                    </View>
                    <View style={{ flex:4}}>
                        <Text style={styles.title}>{listing.name}</Text>
                        <Text style={styles.description}>{listing.description}</Text>
                    </View>            
                </View>
                
                <ScrollView>
                    <Text style={styles.sectiontitle}>{listing.section1}</Text>
                    {Array.from({ length: 12 }, (_, i) => renderTheoryBlock(i + 1))}
    
                    <Text style={styles.sectiontitle}>{listing.section2}</Text>
                    {Array.from({ length: 9 }, (_, i) => renderTheoryBlock(i + 13))}
    
                    <Text style={styles.sectiontitle}>{listing.section3}</Text>
                    {Array.from({ length: 19 }, (_, i) => renderTheoryBlock(i + 22))}
                    
                    {/* Add main videos section if available */}
                    <View style={styles.videoBlock}>
                        {renderVideos(listing)}
                    </View>
                </ScrollView>
                
                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    onRequestClose={() => {
                        scale.value = withSpring(1);
                        translateX.value = withSpring(0);
                        translateY.value = withSpring(0);
                        setIsModalVisible(false);
                    }}
                    animationType="fade"
                >
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <View style={styles.modalContainer}>
                            <TouchableOpacity 
                                style={styles.closeButton}
                                onPress={() => {
                                    scale.value = withSpring(1);
                                    translateX.value = withSpring(0);
                                    translateY.value = withSpring(0);
                                    setIsModalVisible(false);
                                }}
                            >
                                <Feather name="x" size={30} color="white" />
                            </TouchableOpacity>
                            
                            {isVideo ? (
                                selectedVideoId ? (
                                    <WebView
                                        style={{
                                            width: width * 0.9,
                                            height: height * 0.4,
                                        }}
                                        source={{
                                            uri: `https://www.youtube.com/embed/${selectedVideoId}?playsinline=1&autoplay=1`
                                        }}
                                        allowsFullscreenVideo={true}
                                    />
                                ) : (
                                    <FullscreenVideoPlayer
                                        source={selectedMedia}
                                        isVisible={isModalVisible}
                                        onClose={() => {
                                            setIsModalVisible(false);
                                        }}
                                    />
                                )
                            ) : (
                                <GestureDetector gesture={composed}>
                                    <Animated.View style={[styles.modalBackground]}>
                                        <Animated.Image
                                            source={selectedMedia}
                                            style={[styles.fullScreenImage, animatedStyle]}
                                            resizeMode="contain"
                                        />
                                    </Animated.View>
                                </GestureDetector>
                            )}
                        </View>
                    </GestureHandlerRootView>
                </Modal>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenImage: {
        width: width * 0.9,
        height: height * 0.7,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
    },
    
    container: {
        flex: 1,
    },
    errorText: {
        fontSize: 18,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginBottom: 16,
        resizeMode: 'contain'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 2,
        paddingHorizontal: 10,
        textAlign: 'center'
    },
    description: {
        fontSize: 18,
        textAlign: 'justify',
        paddingHorizontal: 10,
    },
    theorytitle: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 10,
    },
    theory: {
        paddingHorizontal: 10,
    },
    sectiontitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    imageSec: {
        width: 90,
        height: 90,
        borderRadius: 10,
        marginBottom: 16,
        marginHorizontal: 15,
        marginVertical: 10,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    blocks: {
        backgroundColor: Colors.white,
        marginBottom: 10,
        marginHorizontal: 10,
    },
   
    playButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -15 }, { translateY: -15 }],
    },
    videoContainer: {
        position: 'relative',
        marginHorizontal: 15,
        marginVertical: 10,
    },
    videoThumbnail: {
        width: 160,
        height: 90,
        borderRadius: 10,
        backgroundColor: '#000',
    },
    playButtonOverlay: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -15 }, { translateY: -15 }],
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
    },
    fullScreenVideo: {
        width: width,
        height: height * 0.7,
        backgroundColor: 'black',
    },
    alertContainer: {
        position: 'absolute',
        top: 90,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        borderRadius: 8,
        zIndex: 9999,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      alertText: {
        color: 'white',
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
      },
      videoBlock: {
        backgroundColor: Colors.white,
        position: 'relative',
        borderRadius: 30,
        borderWidth: 2,
        borderColor: Colors.lightGrey,
        overflow: 'hidden',
        shadowColor: '#080606',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
      },
      backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 999,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    bookmarkButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 999,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default ListingDetails;