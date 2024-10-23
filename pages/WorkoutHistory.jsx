import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Graph from "./Graph";
import PieChartCard from "../Components/PieChartCard";
import GetData from "../Components/dataExtractor";

const WorkoutHistory = () => {

    GetData();  // Call the function to get the data
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

    const data = selectedTimePeriod === 'week' ? [
        { value: 50, label: 'Mon' },
        { value: 60, label: 'Tue' },
        { value: 70, label: 'Wed' },
        { value: 90, label: 'Thu' },
        { value: 253, label: 'Fri' },
        { value: 61, label: 'Sat' },
        { value: 23, label: 'Sun' }
    ] : selectedTimePeriod === 'month' ? Array.from({ length: 30 }, (_, i) => ({
        value: Math.floor(Math.random() * 300) + 20,  // Random workout value for each day
        label: `${i + 1}`
    })) : [
        { value: 800, label: 'Jan' },
        { value: 950, label: 'Feb' },
        { value: 1100, label: 'Mar' },
        { value: 1200, label: 'Apr' },
        { value: 1350, label: 'May' },
        { value: 1400, label: 'Jun' },
        { value: 1500, label: 'Jul' },
        { value: 1000, label: 'Aug' },
        { value: 1750, label: 'Sep' },
        { value: 1800, label: 'Oct' },
        { value: 1900, label: 'Nov' },
        { value: 2000, label: 'Dec' }
    ];

    const secondData = selectedWorkout === 'bicepCurl' ? [
        { value: 50, label: 'Set 1' },
        { value: 80, label: 'Set 2' },
        { value: 65, label: 'Set 3' }
    ] : selectedWorkout === 'squat' ? [
        { value: 120, label: 'Set 1' },
        { value: 150, label: 'Set 2' },
        { value: 180, label: 'Set 3' }
    ] : selectedWorkout === 'latPullDown' ? [
        { value: 90, label: 'Set 1' },
        { value: 95, label: 'Set 2' },
        { value: 100, label: 'Set 3' }
    ] : selectedWorkout === 'pushUp' ? [
        { value: 70, label: 'Set 1' },
        { value: 75, label: 'Set 2' },
        { value: 80, label: 'Set 3' }
    ] : [
        { value: 100, label: 'Set 1' },
        { value: 130, label: 'Set 2' },
        { value: 150, label: 'Set 3' }
    ];

    return (
        <ScrollView style={styles.container}>
            <View>
                <Text style={styles.topicText}>Check your progress,</Text>
                <Text style={styles.subTopicText}>Your Workout Stats Today</Text>
                <ScrollView horizontal={true}>
                    <View style={styles.progressChartContainer}>
                        <PieChartCard value={20} title={'Bicep Curls'} reps={10} time={10}/>
                        <PieChartCard value={10} title={'Squat'} reps={10} time={10}/>
                        <PieChartCard value={10} title={'Push Ups'} reps={10} time={10}/>
                        <PieChartCard value={10} title={'Plank'} reps={10} time={10}/>
                        <PieChartCard value={10} title={'Pull Down'} reps={10} time={10}/>
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
