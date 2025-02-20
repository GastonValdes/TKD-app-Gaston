import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Colors } from "@/constants/Colors";

const TerminologyTable = ({ data, fontSize = 16 }) => {
  
  // Return null if there's no <Table> marker in the text
  if (!data.includes('<Table>')) {
    return null;
  }
  
   // Remove the <Table> marker from the content
   const cleanedData = data.replace(/<Table>/g, '').replace(/\n\s*\n/g, '\n');

  // Split the data into rows based on newlines
  const rows = cleanedData.split('\n').filter(row => row.trim());
    
  // Split each row into columns based on tabs
  const tableData = rows.map(row => row.split('\t').map(cell => cell.trim()));

  // Calculate column widths based on content and fontSize
  const columnWidths = useMemo(() => {
    const numColumns = Math.max(...tableData.map(row => row.length));
    const widths = new Array(numColumns).fill(0);
    const fontSizeMultiplier = fontSize / 16; // Scale based on fontSize

    tableData.forEach(row => {
      row.forEach((cell, index) => {
        // Adjust width calculation based on fontSize
        const estimatedWidth = Math.min(400, Math.max(120, cell.length * 10 * fontSizeMultiplier));
        widths[index] = Math.max(widths[index], estimatedWidth);
      });
    });

    return widths;
  }, [tableData, fontSize]);

  return (
    <ScrollView 
      horizontal 
      style={{ marginBottom: 10 }}
      showsHorizontalScrollIndicator={true}
    >
      <View style={{ flexDirection: 'column' }}>
        {/* Header Row */}
        <View style={{ flexDirection: 'row' }}>
          {tableData[0].map((header, index) => (
            <View 
              key={index} 
              style={{
                width: columnWidths[index],
                backgroundColor: Colors.background,
                borderWidth: 1,
                borderColor: Colors.lightGrey,
                padding: 8,
              }}
            >
              <Text style={{ 
                fontWeight: 'bold',
                flexWrap: 'wrap',
                fontSize: fontSize
              }}>
                {header}
              </Text>
            </View>
          ))}
        </View>
        
        {/* Data Rows */}
        {tableData.slice(1).map((row, rowIndex) => (
          <View 
            key={rowIndex} 
            style={{ 
              flexDirection: 'row',
              backgroundColor: rowIndex % 2 === 0 ? '#fff' : '#f9f9f9'
            }}
          >
            {row.map((cell, cellIndex) => (
              <View 
                key={cellIndex} 
                style={{
                  width: columnWidths[cellIndex],
                  borderWidth: 1,
                  borderColor: Colors.lightGrey,
                  padding: 8,
                }}
              >
                <Text style={{ 
                  flexWrap: 'wrap',
                  fontSize: fontSize
                }}>
                  {cell}
                </Text>
              </View>
            ))}
            {/* Fill in any missing cells */}
            {[...Array(tableData[0].length - row.length)].map((_, index) => (
              <View 
                key={`empty-${index}`}
                style={{
                  width: columnWidths[row.length + index],
                  borderWidth: 1,
                  borderColor: Colors.lightGrey,
                  padding: 8,
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default TerminologyTable;