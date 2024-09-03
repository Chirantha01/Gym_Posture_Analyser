import React from "react";
import {View ,Text , StyleSheet , FlatList , StatusBar} from 'react-native';
import Graph from "./Graph";

const WorkoutHistory = () => {
    const data = [
      {
        id: '1',
        date : "Friday August 30",
        time : "1 hour 15 min",
        workout : [
            {type: "Bicep Curl" , Reps : 35},
            {type: "Squats" , Reps : 40},
            {type: "Side Lateral" , Reps : 20},
            {type: "Barbel Curl" , Reps : 20},
            {type: "Dumbell Press" , Reps : 20}
        ]
      },
      {
        id: '2',
        date : "Saturday August 31",
        time : "1 hour",
        workout : [
            {type: "Bicep Curl" , Reps : 35},
            {type: "Squats" , Reps : 40},
            {type: "Side Lateral" , Reps : 20},
            {type: "Barbel Curl" , Reps : 20},
            {type: "Dumbell Press" , Reps : 20}
        ]
      },
      {
        id: '3',
        date : "Sunday September 1",
        time : "25 min",
        workout : [
            {type: "Bicep Curl" , Reps : 35},
            {type: "Barbel Curl" , Reps : 20},
        ]
      },
      {
        id: '4',
        date : "Monday September 2",
        time : "45 min",
        workout : [
            {type: "Bicep Curl" , Reps : 35},
            {type: "Side Lateral" , Reps : 20},
            {type: "Barbel Curl" , Reps : 20},
            {type: "Dumbell Press" , Reps : 20}
        ]
      },
      {
        id: '5',
        date : "Tuesday September 3",
        time : "1 hour 10 min",
        workout : [
            {type: "Bicep Curl" , Reps : 35},
            {type: "Squats" , Reps : 40},
            {type: "Side Lateral" , Reps : 20},
            {type: "Barbel Curl" , Reps : 20},
            {type: "Dumbell Press" , Reps : 20}
        ]
      },
    ];
  
  
    const renderItem = ({ item, index }) => {
      return (
        <View style={styles.itemContainer} className="bg-blue-400 p-6">
          <Text className="text-2xl text-blue-900 font-bold">{item.date}</Text>
          <View>
            <Text className="text-xl text-blue-900 font-semibold">{item.time}</Text>
            {item.workout.map((exercise, index) => (
              <Text key={index}>
                {`${exercise.type}: ${exercise.Reps} Reps`}
              </Text>
            ))}
          </View>
        </View>
      );
    };
  
    return (
      <View className="bg-white">
        <StatusBar style="auto" />
        <Text className="text-3xl font-bold p-6 justify-center bg-white">Workouts</Text>
        <View className="bg-white mb-8"><Graph/></View>
        <FlatList
          data={data}
          contentContainerStyle={styles.container}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={1}
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor:'#fff'
    },
    itemContainer: {
      width: '96%',
      margin: '2%',
      borderRadius: 45,
      overflow: 'hidden',
      padding: 16,
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

export default WorkoutHistory;