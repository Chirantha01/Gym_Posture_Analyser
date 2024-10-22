import {
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  Text,
} from 'react-native';
import React from 'react';
import CustomImageCarousal from './src/components/CustomImageCarousal';

const App = () => {
  console.log("Carousel loaded...");
  const data = [
    {
      image: require('../../assets/img1.jpg'),
      title: 'Weekly Challenge',
      description: 'Tackle this Challenge',
    },
    {
      image: require('../../assets/img2.jpg'),
      title: 'Workout Routines',
      description: 'Check out the latest routines',
    },
    {
      image: require('../../assets/img3.jpg'),
      title: 'Daily Nutrients',
      description: 'Fast track your fitness journey',
    },
    {
      image: require('../../assets/img4.jpg'),
      title: 'Healthy Recipes',
      description: 'Tasty but Healthy',
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.carouselContainer}>
        <CustomImageCarousal data={data} autoPlay={true} pagination={true} />
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flex: 1,
    backgroundColor: '#232323',
    paddingBottom: 0,
  },
  text: { textAlign: 'center', color: 'white', marginBottom: 10 },
  carouselContainer: {
    marginBottom: 10,
  },
});
