import { StyleSheet, Image, View } from 'react-native';
import React from 'react';

const CustomImage = ({ item, size, height }) => {
  if (!item.image) {
    return <View style={{ width: size, height }} key={item.key} />;
  }

  return (
    <View style={{ width: size, height }} key={item.key}>
      <Image
        source={item.image}
        style={styles.image}
        resizeMode="contain" // Ensures the image fits within the box without exceeding
      />
    </View>
  );
};

export default CustomImage;

const styles = StyleSheet.create({
  image: {
    width: '100%', // Fill the entire container width
    height: '100%', // Fill the entire container height
  },
});
