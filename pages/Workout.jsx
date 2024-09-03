import React from 'react';
import { View, Text, Image, StyleSheet, FlatList , StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const Workout = () => {
  const data = [
    {
      id: '1',
      image: require('../assets/img-bicep.jpg'),
      title: 'Bicep Curls',
      subtitle: 'Arm Exercise'
    },
    {
      id: '2',
      image: require('../assets/img-squat.jpg'),
      title: 'Squats',
      subtitle: 'Leg Exercises'
    },
    {
      id: '3',
      image: require('../assets/img-sideLateral.jpg'),
      title: 'Side Lateral',
      subtitle: 'Shoulder Exercises'
    },
    {
      id: '4',
      image: require('../assets/img-DumbellPress.jpg'),
      title: 'Dumbell Press',
      subtitle: 'Chest Exercises'
    },
    {
      id: '5',
      image: require('../assets/img-plank.jpg'),
      title: 'Plank',
      subtitle: 'Abdominal Exercises'
    },
    {
      id: '6',
      image: require('../assets/img-SumoSquat.jpg'),
      title: 'Sumo Squat',
      subtitle: 'Leg Exercises'
    },
    {
      id: '7',
      image: require('../assets/img-BenchPress.jpg'),
      title: 'Bench Press',
      subtitle: 'Chest Exercises'
    },
    {
      id: '8',
      image: require('../assets/img-BarbelCurl.jpg'),
      title: 'Barbel Curl',
      subtitle: 'Arm Exercises'
    },
  ];


  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.itemContainer}>
        <Image source={item.image } style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      <StatusBar style="auto" />
      <FlatList
        data={data}
        contentContainerStyle={styles.container}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={() => (
          <Text className="text-3xl font-bold p-6 justify-center bg-white">Workouts</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#fff'
  },
  itemContainer: {
    width: '48%',
    height: 300,
    margin: '1%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:  'column' 
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  textContainer: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
});

export default Workout;
