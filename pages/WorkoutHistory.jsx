import React, { useState , useCallback} from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Graph from "./Graph";
import PieChartCard from "../Components/PieChartCard";
import GetData from "../Components/dataExtractor";
import {useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WorkoutHistory = () => {
  
 // Call the function to get the data
    const [workouts , setWorkouts] = useState([]);

    const fetchWorkouts = async(token) =>{
        const res = await axios.get("http://192.168.1.148:4000/home",{headers:{'authorization': `Bearer ${token}`}});
        const data = res.data;
        console.log(data);
        if (data.workouts){
          return data.workouts;
        }
        else{
          return null;
        }
    }
    
    const {lastWeekData,
        lastMonthData,
        lastYearMonthlyAverageData,
        todayPlankData,
        todayPushUpData,
        todaySquatData,
        todayLatPullDownData,
        todayBiceCurlData,
        lastMonthPlankAccuracy,
        lastMonthBicepCurlsAccuracy,
        lastMonthSquatAccuracy,
        lastMonthLatPullDownAccuracy,
        lastMonthPushUpAccuracy} = GetData(fetchWorkouts); 

    useFocusEffect(
        useCallback(() => {
          const fetchWorkoutData = async () => {
            try {
              const token = await AsyncStorage.getItem("jwtToken");
              if (token) {
                const workouts = await fetchHome(token);
                if (user) {
                  setWorkouts(workouts);  // Set the username after fetching
                }
              } else {
                console.log("Token not found.");
              }
            } catch (error) {
              console.log("Error fetching Token", error);
            }
          };
    
          fetchWorkoutData();  // Fetch username when the screen is focused
        }, []) // Empty dependency array to ensure this runs every time the screen is focused
    );
  
    const [selectedTimePeriod, setSelectedTimePeriod] = useState('week');
    const [selectedWorkout, setSelectedWorkout] = useState('bicepCurl'); // New state for second graph
    const [spacing, setSpacing] = useState(20);

    const handleTimePeriodChange = (timePeriod) => {
        setSelectedTimePeriod(timePeriod);
        if (timePeriod === 'week') {
            setSpacing(20);
        } else if (timePeriod === 'month') {
            setSpacing(5);
        } else if (timePeriod === 'year') {
            setSpacing(10);
        }
    };

    const data = selectedTimePeriod === 'week' ? lastWeekData : selectedTimePeriod === 'month' ? lastMonthData : lastYearMonthlyAverageData;

    const secondData = selectedWorkout === 'bicepCurl' ? lastMonthBicepCurlsAccuracy
     : selectedWorkout === 'squat' ? lastMonthSquatAccuracy 
     : selectedWorkout === 'latPullDown' ? lastMonthLatPullDownAccuracy
     : selectedWorkout === 'pushUp' ? lastMonthPushUpAccuracy
     : lastMonthPlankAccuracy;

    return (
        <ScrollView style={styles.container}>
            <View>
                <Text style={styles.topicText}>Check your progress,</Text>
                <Text style={styles.subTopicText}>Your Workout Stats Today</Text>
                <ScrollView horizontal={true}>
                    <View style={styles.progressChartContainer}>
                        {/* Daily components */}
                        <PieChartCard value={todayBiceCurlData.accuracy} title={'Bicep Curls'} reps={todayBiceCurlData.e_reps} time={todayBiceCurlData.e_time}/>
                        <PieChartCard value={todaySquatData.accuracy} title={'Squat'} time={todaySquatData.e_time}/>
                        <PieChartCard value={todayPushUpData.accuracy} title={'Push Ups'} reps={todayPushUpData.e_reps} time={todayPushUpData.e_time}/>
                        <PieChartCard value={todayPlankData.accuracy} title={'Plank'} time={todayPlankData.e_time}/>
                        <PieChartCard value={todayLatPullDownData.accuracy} title={'Pull Down'} reps={todayLatPullDownData.e_reps} time={todayLatPullDownData.e_time}/>
                    </View>
                </ScrollView>

                <Text style={styles.subTopicText}>Progress of Last,</Text>
                <View style={styles.switchContainer}>
                    <View style={[
                        styles.switchText,
                        selectedTimePeriod === 'week' ? styles.activeContainer : styles.inactiveContainer
                    ]}>
                        <TouchableOpacity onPress={() => handleTimePeriodChange('week')}>
                            <Text style={[
                                styles.switchText,
                                selectedTimePeriod === 'week' ? styles.activeText : styles.inactiveText
                            ]}>
                                Week
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[
                        styles.switchText,
                        selectedTimePeriod === 'month' ? styles.activeContainer : styles.inactiveContainer
                    ]}>
                        <TouchableOpacity onPress={() => handleTimePeriodChange('month')}>
                            <Text style={[
                                styles.switchText,
                                selectedTimePeriod === 'month' ? styles.activeText : styles.inactiveText
                            ]}>
                                Month
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[
                        styles.switchText,
                        selectedTimePeriod === 'year' ? styles.activeContainer : styles.inactiveContainer
                    ]}>
                        <TouchableOpacity onPress={() => handleTimePeriodChange('year')}>
                            <Text style={[
                                styles.switchText,
                                selectedTimePeriod === 'year' ? styles.activeText : styles.inactiveText
                            ]}>
                                Year
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.graphContainer}>
                    <Graph data={data} spacing={spacing} />
                </View>

                {/* Second Graph with 5 switches */}
                <Text style={styles.subTopicText}>Progress by Exercises</Text>
                <View style={styles.switchContainerWorkout}>
                <ScrollView horizontal={true}>
                    <View style={[
                        styles.switchText,
                        selectedWorkout === 'bicepCurl' ? styles.activeContainer : styles.inactiveContainer
                    ]}>
                        <TouchableOpacity onPress={() => setSelectedWorkout('bicepCurl')}>
                            <Text style={[
                                styles.switchText,
                                selectedWorkout === 'bicepCurl' ? styles.activeText : styles.inactiveText
                            ]}>
                                Bicep Curls
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[
                        styles.switchText,
                        selectedWorkout === 'squat' ? styles.activeContainer : styles.inactiveContainer
                    ]}>
                        <TouchableOpacity onPress={() => setSelectedWorkout('squat')}>
                            <Text style={[
                                styles.switchText,
                                selectedWorkout === 'squat' ? styles.activeText : styles.inactiveText
                            ]}>
                                Squats
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[
                        styles.switchText,
                        selectedWorkout === 'latPullDown' ? styles.activeContainer : styles.inactiveContainer
                    ]}>
                        <TouchableOpacity onPress={() => setSelectedWorkout('latPullDown')}>
                            <Text style={[
                                styles.switchText,
                                selectedWorkout === 'latPullDown' ? styles.activeText : styles.inactiveText
                            ]}>
                                Pull Down
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[
                        styles.switchText,
                        selectedWorkout === 'pushUp' ? styles.activeContainer : styles.inactiveContainer
                    ]}>
                        <TouchableOpacity onPress={() => setSelectedWorkout('pushUp')}>
                            <Text style={[
                                styles.switchText,
                                selectedWorkout === 'pushUp' ? styles.activeText : styles.inactiveText
                            ]}>
                                Push Ups
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[
                        styles.switchText,
                        selectedWorkout === 'plank' ? styles.activeContainer : styles.inactiveContainer
                    ]}>
                        <TouchableOpacity onPress={() => setSelectedWorkout('plank')}>
                            <Text style={[
                                styles.switchText,
                                selectedWorkout === 'plank' ? styles.activeText : styles.inactiveText
                            ]}>
                                Plank
                            </Text>
                        </TouchableOpacity>
                    </View>
                    </ScrollView>
                </View>

                <View style={styles.graphContainer}>
                    <Graph data={secondData}/>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#232323',
        flex: 1,
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
    subTopicText: {
        color: "#B3A0FF",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 0,
        alignSelf: "flex-start",
        marginLeft: 20,
        marginTop: 20,
    },
    progressChartContainer: {
        paddingLeft: 10,
        paddingTop: 10,
        flexDirection: 'row',
    },
    graphContainer: {
        marginLeft: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        paddingLeft: 10,
        alignItems: 'center',
        marginVertical: 20,
    },
    switchContainerWorkout: {
        flexDirection: 'row',
        paddingLeft: 10,
        alignItems: 'center',
        marginVertical: 20,
    },
    switchText: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 100,
        textAlign: 'center',
        justifyContent: 'center',
    },
    activeContainer: {
        margin: 5,
        height: 40,
        backgroundColor: '#232323',
        borderRadius: 100,
        borderColor: '#E2F163',
        borderWidth: 1,
    },
    inactiveContainer: {
        margin: 5,
        height: 40,
        backgroundColor: '#232323',
        borderRadius: 100,
        borderColor: 'white',
        borderWidth: 1,
    },
    activeText: {
        color: '#E2F163',
    },
    inactiveText: {
        color: 'white',  // Inactive text color (dimmed)
    },
});

export default WorkoutHistory;
