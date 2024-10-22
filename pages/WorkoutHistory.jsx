import React from "react";
import {View ,Text , StyleSheet , FlatList , StatusBar} from 'react-native';
import Graph from "./Graph";
import PieChartCard from "../Components/PieChartCard";
import { ScrollView } from "react-native-gesture-handler";


const WorkoutHistory = () => {
  
    return (
      <ScrollView style = {styles.container}>
      <View>
      <Text style={styles.topicText}>Check your progress,</Text>
      <Text>Your Workout Stats Today</Text>
        <ScrollView horizontal={true}>
          <View style = {styles.progressChartContainer}>
            <PieChartCard value={10} title={'Bicep Curls'}/>
            <PieChartCard value={10} title={'Squat'}/>
            <PieChartCard value={10} title={'Push Ups'}/>
            <PieChartCard value={10} title={'Plank'}/>
            <PieChartCard value={10} title={'Pull Down'}/>
          </View>
        </ScrollView>
        <View><Graph/></View>
      </View>
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor:'#232323',
      flex : 1,
    },
    topicText: {
      color: "#896CFE",
      fontSize: 26,
      fontWeight: "bold",
      marginBottom: 0,
      alignSelf: "flex-start",
      marginLeft: 20,
      paddingTop: 50,
    },
    progressChartContainer: {
      paddingLeft:2.5,
      paddingTop:10,
      flexDirection: 'row',
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