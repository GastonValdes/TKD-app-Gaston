import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import menuCategoryList from "@/constants/Categories";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
    onCategoryChanged: (category: string) => void;
};

const CategoryButtons = ({ onCategoryChanged }: Props) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleSelectCategory = (index: number) => {
        setActiveIndex(index);
        onCategoryChanged(menuCategoryList[index].title);
    };

    return (
        <View style={{ paddingHorizontal: 15 }}>
            
            <ScrollView
                horizontal
                contentContainerStyle={{
                    gap: 20,
                    paddingVertical: 10,
                    marginBottom: 10,
                }}
            >
                {menuCategoryList.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleSelectCategory(index)}
                        style={activeIndex === index ? styles.categoryBtnActive : styles.categoryBtn}
                    >
                        <MaterialCommunityIcons
                            name={item.iconName as any}
                            size={20}
                            color={activeIndex === index ? Colors.white : Colors.black}
                        />
                        <Text
                            style={
                                activeIndex === index
                                    ? styles.categoryBtnTxtActive
                                    : styles.categoryBtnText
                            }
                        >
                            {item.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default CategoryButtons;

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: Colors.black,
    },
    categoryBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    categoryBtnText: {
        marginLeft: 5,
        color: Colors.black,
    },
    categoryBtnActive: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.primaryColor,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        shadowColor: "#333333",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    categoryBtnTxtActive: {
        marginLeft: 5,
        color: Colors.white,
    },
});
