// Workout.js
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WorkoutCard = ({ workoutTitle, workoutSubTitle, image, onPress }) => {
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{workoutTitle}</Text>
        <Text style={styles.subtitle}>{workoutSubTitle}</Text>
      </View>
      <Image source={image} style={styles.image} />
    </TouchableOpacity>
  );
};

const Workout = () => {
  const navigation = useNavigation(); // Use this hook to access navigation in non-screen components
  const [searchQuery, setSearchQuery] = useState('');

  const data = [
    {
      id: '1',
      image: require('../assets/img-bicep.jpg'),
      title: 'Bicep Curls',
      subtitle: 'Top Arm Exercise',
      navigateTo: 'Model_bicep',
    },
    {
      id: '2',
      image: require('../assets/img-squat.jpg'),
      title: 'Squats',
      subtitle: 'Top Leg Exercises',
      navigateTo: 'Model_squat',
    },
    {
      id: '3',
      image: require('../assets/pushup.jpg'),
      title: 'Push Ups',
      subtitle: 'Top Chest Exercises',
      navigateTo: 'Model_push_up',
    },
    {
      id: '4',
      image: require('../assets/latPullDown.jpg'),
      title: 'Lat Pull Down',
      subtitle: 'Top Back Exercises',
      navigateTo: 'Model_lat_pull_down',
    },
    {
      id: '5',
      image: require('../assets/img-plank.jpg'),
      title: 'Plank',
      subtitle: 'Top Ab Exercises',
      navigateTo: 'Model_plank',
    },
    
  ];

  // Filter the workout data based on the search query
  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <TextInput
        style={styles.searchInput}
        placeholder="Search Workouts..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Text style={styles.text}>Select your workout,</Text>
      <Text style={styles.sub_text}>We will help you correct your posture...</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredData.map((item) => (
          <WorkoutCard
            key={item.id}
            workoutTitle={item.title}
            workoutSubTitle={item.subtitle}
            image={item.image}
            onPress={() => {
              if (item.navigateTo) {
                navigation.navigate(item.navigateTo);
              }
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232323',
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  text: {
    color: "#896CFE",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 0,
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  sub_text: {
    color: "white",
    fontSize: 15,
    fontWeight: "semi-bold",
    marginBottom: 20,
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginHorizontal: 15,
    height: 140,
    marginVertical: 10,
    borderRadius: 20,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  image: {
    width: 175,
    height: 140,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  title: {
    fontWeight: '500',
    fontSize: 20,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 100,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    margin: 16,
  },
});

export default Workout;
