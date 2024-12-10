import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, ScrollView, FlatList } from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, Stack, useRouter, useSegments } from "expo-router";
import { ListingType } from '@/types/listingTypes';
import listingData from "@/data/destinations.json";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Header from '@/components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Image mapping object - same as before
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
        "shinewavemovement.png": require("@/assets/images/shinewavemovement.png"),
    "default.png": require("@/assets/images/default.png"),
};

const BookmarkedListings = () => {
    const [bookmarkedItems, setBookmarkedItems] = useState<ListingType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const segments = useSegments();
    const router = useRouter();
    const prevSegmentRef = useRef<string | null>(null);

    const loadBookmarkedItems = useCallback(async () => {
        try {
            const bookmarkedIds = await AsyncStorage.getItem('bookmark');
            if (bookmarkedIds) {
                const ids = JSON.parse(bookmarkedIds);
                const items = listingData.filter((item: ListingType) => 
                    ids.includes(item.id)
                );
                setBookmarkedItems(items);
            } else {
                setBookmarkedItems([]);
            }
        } catch (error) {
            console.error('Error loading bookmarks:', error);
            setBookmarkedItems([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load data only when navigating to this screen
    useEffect(() => {
        const currentSegment = segments[segments.length - 1];
        
        if (currentSegment === 'saved' && prevSegmentRef.current !== 'saved') {
            loadBookmarkedItems();
        }
        
        prevSegmentRef.current = currentSegment;
    }, [segments]);

    // Initial load
    useEffect(() => {
        loadBookmarkedItems();
    }, []);

    const getImageSource = (imageName: string) => {
        if (imageName.startsWith('http')) {
            return { uri: imageName };
        }
        return imageMapping[imageName] || imageMapping['default.png'];
    };

    const renderItem = ({ item }: { item: ListingType }) => (
        <Link href={`/listing/${item.id}`} asChild>
            <TouchableOpacity style={styles.listing}>
                <View style={styles.imageContainer}>
                    <Image 
                        source={getImageSource(item.image)}
                        style={styles.image}
                    />
                </View>
                <View style={styles.details}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.description} numberOfLines={2}>
                        {item.description}
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    );

    const renderContent = () => {
        if (isLoading && bookmarkedItems.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Text>Cargando...</Text>
                </View>
            );
        }

        if (!isLoading && bookmarkedItems.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Ionicons 
                        name="bookmark-outline" 
                        size={64} 
                        color={Colors.primaryColor}
                    />
                    <Text style={styles.emptyText}>
                        No tienes favoritos guardados
                    </Text>
                    <Link href="/" asChild>
                        <TouchableOpacity style={styles.browseButton}>
                            <Text style={styles.browseButtonText}>
                                Explorar Contenido
                            </Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            );
        }

        return (
            <FlatList
                data={bookmarkedItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshing={isLoading}
                onRefresh={loadBookmarkedItems}
            />
        );
    };

    return (
        <>
            <Stack.Screen 
                options={{
                    headerTitle: "Favoritos",
                    headerStyle: { backgroundColor: Colors.primaryColor },
                    headerTintColor: '#fff',
                }}
            />
            <View style={styles.container}>
                <Header />
                {renderContent()}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.lightGrey,
        paddingBottom: 100,
    },
    listContainer: {
        padding: 10,
    },
    listing: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        padding: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    details: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: Colors.primaryColor,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    browseButton: {
        backgroundColor: Colors.primaryColor,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    browseButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default BookmarkedListings;