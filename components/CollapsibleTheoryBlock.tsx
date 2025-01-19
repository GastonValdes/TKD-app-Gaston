import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import TerminologyTable from './TerminologyTable';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const CollapsibleTheoryBlock = ({ title, theory, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [fontSize, setFontSize] = useState(16);

  const toggleCollapse = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsCollapsed(!isCollapsed);
  };

  const increaseFontSize = () => {
    if (fontSize < 24) {
      setFontSize(prevSize => prevSize + 2);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(prevSize => prevSize - 2);
    }
  };

  const resetFontSize = () => {
    setFontSize(16);
  };

  // Check if the theory content should be rendered as a table
  const shouldRenderTable = theory && (
    theory.includes('\t') || 
    theory.toLowerCase().includes('korean') ||
    theory.toLowerCase().includes('english')
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={toggleCollapse}
        style={styles.headerContainer}
        activeOpacity={0.7}
      >
        <Text style={styles.theorytitle}>{title}</Text>
        <Ionicons
          name={isCollapsed ? "chevron-down" : "chevron-up"}
          size={24}
          color={Colors.primaryColor}
        />
      </TouchableOpacity>
      
      {!isCollapsed && (
        <View style={styles.contentContainer}>
          {theory && (
            <View style={styles.theoryContainer}>
              {shouldRenderTable ? (
                <TerminologyTable data={theory} />
              ) : (
                <Text style={[styles.theory, { fontSize }]}>{theory}</Text>
              )}
            </View>
          )}
          {children}
          
          {!shouldRenderTable && (
            <View style={styles.fontSizeControls}>
              <TouchableOpacity 
                onPress={decreaseFontSize}
                style={[styles.fontButton, fontSize <= 12 && styles.disabledButton]}
                disabled={fontSize <= 12}
              >
                <Ionicons name="remove" size={24} color={fontSize <= 12 ? Colors.lightGrey : Colors.primaryColor} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={resetFontSize}
                style={styles.fontButton}
              >
                <Ionicons name="refresh" size={24} color={Colors.primaryColor} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={increaseFontSize}
                style={[styles.fontButton, fontSize >= 24 && styles.disabledButton]}
                disabled={fontSize >= 24}
              >
                <Ionicons name="add" size={24} color={fontSize >= 24 ? Colors.lightGrey : Colors.primaryColor} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = {
  container: {
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  contentContainer: {
    paddingBottom: 10,
  },
  theoryContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  theorytitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  theory: {
    lineHeight: 24,
  },
  fontSizeControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
    marginTop: 10,
    backgroundColor: Colors.white,
  },
  fontButton: {
    padding: 8,
    marginHorizontal: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
    shadowOpacity: 0,
    elevation: 0,
  }
};

export default CollapsibleTheoryBlock;