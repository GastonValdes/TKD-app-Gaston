import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, ScrollView, SafeAreaView, Modal } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ListingType } from '@/types/listingTypes';
import listingData from "@/data/datacontent.json";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Header from '@/components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ScreenOrientation from 'expo-screen-orientation';
import FullscreenVideoPlayer from '@/components/FullscreenVideoPlayer';
import { Video, ResizeMode } from 'expo-av';
import CollapsibleTheoryBlock from "@/components/CollapsibleTheoryBlock";
import ZoomableTheoryBlock from "@/components/ZoomableTheoryBlock";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const IMG_HEIGHT = 300;

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
    "powerbrake.jpg": require("@/assets/images/powerbrake.jpg"),
    "video1.mp4": require("@/assets/videos/video1.mp4"),
    "tul.png": require("@/assets/images/tul.png"),
    "sparring.jpg": require("@/assets/images/sparring.jpg"),
    "carta.jpg": require("@/assets/images/carta.jpg"),
    "moral3.png": require("@/assets/images/moral3.png"),
    "culturamoral.png": require("@/assets/images/culturamoral.png"),
    
    // ... rest of your image mappings
};

const ListingDetails = () => {
    const { id } = useLocalSearchParams();
    const [selectedMedia, setSelectedMedia] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [bookmark, setBookmark] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isVideo, setIsVideo] = useState<boolean>(false);
    const videoRef = useRef(null);
    const [status, setStatus] = useState({});

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const listing: ListingType | undefined = (listingData as ListingType[]).find(
        (item) => item.id === id
    );

    // Test AsyncStorage functionality
    const testAsyncStorage = async () => {
        try {
            await AsyncStorage.setItem('test', 'test value');
            console.log('Test write successful');
            
            const testValue = await AsyncStorage.getItem('test');
            console.log('Test read value:', testValue);
            
            const keys = await AsyncStorage.getAllKeys();
            console.log('All AsyncStorage keys:', keys);
        } catch (error) {
            console.error('AsyncStorage test failed:', error);
        }
    };

    useEffect(() => {
        testAsyncStorage();
        const initializeBookmark = async () => {
            if (listing) {
                try {
                    console.log('Starting bookmark initialization for listing:', listing.id);
                    setIsLoading(true);
                    
                    let bookmarksStr = await AsyncStorage.getItem('bookmark');
                    console.log('Retrieved bookmarks string:', bookmarksStr);
                    
                    if (!bookmarksStr) {
                        console.log('No bookmarks found, initializing empty array');
                        bookmarksStr = '[]';
                        await AsyncStorage.setItem('bookmark', bookmarksStr);
                    }

                    const bookmarks = JSON.parse(bookmarksStr);
                    console.log('Parsed bookmarks:', bookmarks);
                    
                    const isBookmarked = Array.isArray(bookmarks) && bookmarks.includes(listing.id);
                    console.log('Is current listing bookmarked?', isBookmarked);
                    
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

    const saveBookmark = async (itemId: string) => {
        try {
            console.log('Starting saveBookmark for ID:', itemId);
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
                // Replace alert with custom notification
                setAlertMessage('Agregado a Favoritos');
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 2000); // Hide after 2 seconds
            }
        } catch (error) {
            console.error('Error in saveBookmark:', error);
            setAlertMessage('Error al guardar favorito');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);
        }
    };
    const removeBookmark = async (itemId: string) => {
        try {
            console.log('Starting removeBookmark for ID:', itemId);
            const bookmarksStr = await AsyncStorage.getItem('bookmark');
            if (!bookmarksStr) return;
    
            let bookmarks = JSON.parse(bookmarksStr);
            if (!Array.isArray(bookmarks)) return;
    
            bookmarks = bookmarks.filter((id: string) => id !== itemId);
            await AsyncStorage.setItem('bookmark', JSON.stringify(bookmarks));
            setBookmark(false);
            // Replace alert with custom notification
            setAlertMessage('Eliminado de Favoritos');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);
        } catch (error) {
            console.error('Error in removeBookmark:', error);
            setAlertMessage('Error al eliminar favorito');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);
        }
    };


    const handleImagePress = (imageSource: any) => {
        scale.value = 1;
        setSelectedMedia(imageSource);
        setIsVideo(false);
        setIsModalVisible(true);
    };

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

    const isVideoFile = (fileName: string) => {
        return fileName.toLowerCase().endsWith('.mp4') || 
               fileName.toLowerCase().endsWith('.mov') || 
               fileName.toLowerCase().endsWith('.avi');
    };

    const handleMediaPress = (mediaSource: any, fileName: string) => {
        scale.value = 1;
        translateX.value = 0;
        translateY.value = 0;
        setSelectedMedia(mediaSource);
        setIsVideo(isVideoFile(fileName));
        setIsModalVisible(true);
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scale: scale.value }
            ]
        };
    });

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

    const renderVideos = (listing: ListingType) => {
        if (!listing.videos || listing.videos.length === 0) return null;
        
        return (
            <View style={styles.blocks}>
                <Text style={styles.theorytitle}>Videos</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                >
                    {listing.videos.map((videoName, index) => {
                        const videoSource = imageMapping[videoName];
                        if (!videoSource) return null;

                        return (
                            <TouchableOpacity 
                                key={index}
                                onPress={() => handleMediaPress(videoSource, videoName)}
                            >
                                <View style={styles.videoContainer}>
                                    <Video
                                        source={videoSource}
                                        style={styles.videoThumbnail}
                                        resizeMode={ResizeMode.COVER}
                                        shouldPlay={false}
                                        isMuted={true}
                                        useNativeControls={false}
                                        isLooping={false}
                                    />
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

    const renderTheoryBlock = (index: number) => {
        const titleKey = `titletheory${index}` as keyof ListingType;
        const theoryKey = `theory${index}` as keyof ListingType;
        const sources = imageSources[index - 1];
    
        if (!listing[titleKey] && !listing[theoryKey] && !sources.a && !sources.b && !sources.c) {
            return null;
        }
    
        return (
            <View key={index} style={styles.blocks}>
                <CollapsibleTheoryBlock
                    title={listing[titleKey] as string}
                    theory={listing[theoryKey] as string}
                >
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
                </CollapsibleTheoryBlock>
            </View>
        );
    };
    
const renderModal = () => (
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
                        <FullscreenVideoPlayer
                            source={selectedMedia}
                            isVisible={isModalVisible}
                            onClose={() => {
                                setIsModalVisible(false);
                            }}
                        />
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
    );

    if (!listing) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Listing not found.</Text>
            </View>
        );
    }

    const imageSource = listing.image.startsWith("http")
        ? { uri: listing.image }
        : imageMapping[listing.image];

    const createImageSource = (imagePath: string) => {
        return imagePath.startsWith("http")
            ? { uri: imagePath }
            : imageMapping[imagePath];
    };

    const createNumberedImageSources = (num: number) => ({
        a: createImageSource(listing[`imageth${num}a`]),
        b: createImageSource(listing[`imageth${num}b`]),
        c: createImageSource(listing[`imageth${num}c`])
    });

    const imageSources = Array.from({ length: 40 }, (_, i) => createNumberedImageSources(i + 1));

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
                    style={{
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
                    }}
                    activeOpacity={0.6}
                    onPress={() => {
                        console.log('Back button pressed');
                        router.replace('/(tabs)');
                    }}
                >
                    <Ionicons 
                        name="arrow-back" 
                        size={24} 
                        color={Colors.primaryColor}
                    />
                </TouchableOpacity>
    
                {/* Bookmark Button */}
                <TouchableOpacity 
                    style={{
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
                    }}
                    activeOpacity={0.6}
                    onPress={() => {
                        console.log('Bookmark button pressed!');
                        if (isLoading || !listing) {
                            console.log('Cannot proceed - loading or no listing');
                            return;
                        }
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
                            name={alertMessage.includes('Agregado') ? 'bookmark' : 'bookmark-outline'} 
                            size={20} 
                            color="white" 
                        />
                        <Text style={styles.alertText}>{alertMessage}</Text>
                    </Animated.View>
                )}
    
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
                    <View style={styles.videoBlock}>
                    {renderVideos(listing)}
                    </View>
                </ScrollView>
                {renderModal()}
            </View>
        </>
    );
 }  
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
      }
});

export default ListingDetails;