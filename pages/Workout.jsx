import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';

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
      image: require('../assets/img3.jpg'),
      title: 'Delicious Pizza',
      subtitle: 'Yum!'
    },
    {
      id: '4',
      image: require('../assets/img4.jpg'),
      title: 'Beautiful Beach',
      subtitle: 'Paradise'
    },
    {
      id: '5',
      image: require('../assets/user.jpg'),
      title: 'Crazy Concert',
      subtitle: 'Rock on!'
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
    <FlatList
      data={data}
      contentContainerStyle={styles.container}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
    />
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
