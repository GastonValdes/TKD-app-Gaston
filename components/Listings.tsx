import { FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, View, Image, SafeAreaView, Dimensions } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { ListingType } from "@/types/listingTypes";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
    listings: any[];
    category: string;
};

const Listings = ({ listings, category }: Props) => {
    const [loading, setLoading] = useState(false);
    const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);
    const [numColumns, setNumColumns] = useState(3);
    
    // Get screen width
    const screenWidth = Dimensions.get('window').width;
    
    // Card dimensions
    const cardWidth = 95; // Slightly reduced from 100
    const containerPadding = 8; // Reduced from 15
    
    // Calculate layout on mount and screen rotation
    useEffect(() => {
        const calculateLayout = () => {
            // Available width considering minimal padding
            const availableWidth = screenWidth - (containerPadding * 2);
            // Calculate number of columns that can fit
            const columnsCount = Math.floor(availableWidth / cardWidth);
            setNumColumns(columnsCount);
        };

        calculateLayout();
        
        const subscription = Dimensions.addEventListener('change', calculateLayout);
        return () => {
            subscription.remove();
        };
    }, [screenWidth]);

    const loadBookmarkedItems = useCallback(async () => {
        try {
            const bookmarkedIds = await AsyncStorage.getItem('bookmark');
            if (bookmarkedIds) {
                const ids = JSON.parse(bookmarkedIds);
                setBookmarkedItems(ids);
            }
        } catch (error) {
            console.error('Error loading bookmarks:', error);
            setBookmarkedItems([]);
        }
    }, []);

    useEffect(() => {
        console.log("Updating Listing", category);
        setLoading(true);
        loadBookmarkedItems();

        setTimeout(() => {
            setLoading(false);
        }, 200);
    }, [category]);

    useEffect(() => {
        loadBookmarkedItems();
        const intervalId = setInterval(loadBookmarkedItems, 1000);
        return () => clearInterval(intervalId);
    }, []);

    // Filter listings based on the category
    const filteredListings = category === "Todos" 
        ? listings
        : listings.filter((item: ListingType) => item.category === category);

    // Mapping for local images
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
        "tkd.png": require("@/assets/images/tkd.png"),
        "history.png": require("@/assets/images/history.png"),
        "combate.png": require("@/assets/images/combate.png"),
        "1erDAN.png": require("@/assets/images/1erDAN.png"),
        "2doDAN.png": require("@/assets/images/2doDAN.png"),
        "3erDAN.png": require("@/assets/images/3erDAN.png"),        
        "powerbrake.jpg": require("@/assets/images/powerbrake.jpg"),
        "tul.png": require("@/assets/images/tul.png"),
        "carta.jpg": require("@/assets/images/carta.jpg"),
        "moral3.png": require("@/assets/images/moral3.png"),
    };

    const renderItems: ListRenderItem<ListingType> = ({ item }) => {
        const imageSource =
            item.image.startsWith("http")
                ? { uri: item.image }
                : imageMapping[item.image] || imageMapping["default.jpg"];

        const isBookmarked = bookmarkedItems.includes(item.id);

        return (
            <Link href={`/listing/${item.id}`} asChild>
                <TouchableOpacity>
                    <View style={styles.item}>
                        <Image source={imageSource} style={styles.image} />
                        {isBookmarked && (
                            <View style={styles.bookmark}>
                                <Ionicons 
                                    name="bookmark" 
                                    size={10} 
                                    color={Colors.white} 
                                />
                            </View>
                        )}
                        <View>
                            <Text style={styles.itemTxt}>{item.name}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Link>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { paddingHorizontal: containerPadding }]}>
            <FlatList 
                contentContainerStyle={styles.listContainer}
                data={loading ? [] : filteredListings}
                numColumns={numColumns}
                renderItem={renderItems}
                keyExtractor={(item) => item.id.toString()}
                key={numColumns}
                columnWrapperStyle={styles.columnWrapper}
            />
        </SafeAreaView>
    );
};

export default Listings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        paddingBottom: 280,
        paddingTop: 5,
    },
    columnWrapper: {
        justifyContent: 'space-evenly',
        marginBottom: 8,
    },
    item: {
        backgroundColor: Colors.white,
        borderRadius: 10,
        width: 95, // Slightly reduced from 100
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    image: {
        width: 85,
        height: 85,
        alignSelf: 'center',
        resizeMode: "contain",
    },
    itemTxt: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.black,
        marginBottom: 5,
        textAlign: "center",
    },
    bookmark: {
        position: 'absolute',
        top: 5,
        right: 2,
        backgroundColor: Colors.primaryColor,
        padding: 5,
        borderRadius: 15,
    }
});