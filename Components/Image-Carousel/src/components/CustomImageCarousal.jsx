import { View, useWindowDimensions, Text, StyleSheet, Image } from 'react-native';
import React, { useState, useEffect, useRef, memo } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
} from 'react-native-reanimated';
import Pagination from './Pagination';

const CustomImageCarousal = ({ data, autoPlay, pagination }) => {
  console.log('Inner Carousel started...');
  const scrollViewRef = useAnimatedRef(null);
  const interval = useRef();
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay);
  const { width } = useWindowDimensions();
  const SIZE = width * 0.85; // Make card slightly larger for text + image
  const x = useSharedValue(0);
  const offSet = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
    onMomentumEnd: e => {
      offSet.value = e.contentOffset.x;
    },
  });

  useEffect(() => {
    if (isAutoPlay === true) {
      let _offSet = offSet.value;
      interval.current = setInterval(() => {
        if (_offSet >= Math.floor(SIZE * (data.length - 1) - 10)) {
          _offSet = 0;
        } else {
          _offSet = Math.floor(_offSet + SIZE);
        }
        scrollViewRef.current.scrollTo({ x: _offSet, y: 0 });
      }, 2000);
    } else {
      clearInterval(interval.current);
    }
    return () => {
      clearInterval(interval.current);
    };
  }, [SIZE, isAutoPlay, data.length, offSet.value, scrollViewRef]);

  return (
    <View>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={onScroll}
        onScrollBeginDrag={() => {
          console.log('Scroll began, disabling autoPlay');
          setIsAutoPlay(false);
        }}
        onMomentumScrollEnd={() => {
          console.log('Scroll ended, re-enabling autoPlay');
          setIsAutoPlay(autoPlay);
        }}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={SIZE}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
      >
        {data.map((item, index) => {
          return (
            <View key={index} style={[styles.cardContainer, { width: SIZE }]}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text> 
                <Text style={styles.description}>{item.description}</Text> 
              </View>
              <View style={styles.imageContainer}>
                <Image
                  source={item.image}
                  style={styles.image}
                  resizeMode="contain" // Maintain aspect ratio
                />
              </View>
            </View>
          );
        })}
      </Animated.ScrollView>
      {pagination && <Pagination data={data} x={x} size={SIZE} />}
    </View>
  );
};

export default memo(CustomImageCarousal);

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row', // Align items in a row (text on the left, image on the right)
    backgroundColor: '#101010',
    borderRadius: 10,
    padding: 0,
    marginVertical: 10,
    marginHorizontal: 10,
    elevation: 3, // For shadow on Android
    shadowColor: '#000', // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    height: 135,
  },
  textContainer: {
    flex: 1, // Take up the remaining space after the image
    paddingRight: 10,
    paddingLeft: 10, // Add padding between text and image
    paddingTop: 10
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#b3a0ff',
    textAlign: "center"
  },
  description: {
    fontSize: 12,
    color: '#fff',
    fontWeight: "300",
    textAlign: "center",
    paddingTop: 5,
  },
  imageContainer: {
    width: 180, // Set the width of the image container to 200 pixels
    height: '100%', // Fill the entire height of the card
    overflow: 'hidden', // Prevent overflow
    justifyContent: 'center', // Center the image vertically
    alignItems: 'center', // Center the image horizontally
    padding: 0, // Add padding between text and image
    borderRadius: 10,
  },
  image: {
    width: 180, // Fill the entire width of the container
    height: undefined, // Allow height to be determined by aspect ratio
    aspectRatio: 1,
    borderRadius: 30,
  },
});
