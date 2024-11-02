import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import PoseDetectionCamera from '../../Components/cameraComponent'; // Adjust path as necessary
import { loadModel, predict } from '../../offline_model/lat_pull_down_class/Model_Loader_Lat_Pull_Down';
import * as tf from '@tensorflow/tfjs';
import { calculateAngle, calculateDistance_2 } from '../supporting_methods/angle';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LatPullDown_Model = () => {
    const [poseType, setPose] = useState('normal');
    const [excercisePose, setExcercisePose] = useState(NaN);
    const [prediction, setPrediction] = useState(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [time, setTime] = useState(0);
    const timerRef = useRef(null);
    const repPoseRef = useRef(null); 
    const poseFrameCountRef = useRef(0);
    const repCountRef = useRef(0);
    const correctFrameRef = useRef(0); // Ref to track correct frames immediately
    const incorrectFrameRef = useRef(0); // Ref to track incorrect frames immediately
    const isWorkoutStarted = useRef(false);
    const navigator = useNavigation();

    useEffect(() => {
        const loadModelAsync = async () => {
            try {
                await loadModel();
                setIsModelLoaded(true);
            } catch (error) {
                console.error("Model failed to load:", error);
            }
        };
  
        loadModelAsync();
    }, []);

    useEffect(() => {
        if (poseType === 'correct') {
            if (!timerRef.current) {
                timerRef.current = setInterval(() => {
                    setTime(prevTime => prevTime + 1);
                }, 1000);
            }
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [poseType]);

    const inputTensorData = (keypoints) => {
        const nose = keypoints.find((k) => k.name === 'nose');

        const leftShoulder = keypoints.find((k) => k.name === 'left_shoulder');
        const leftHip = keypoints.find((k) => k.name === 'left_hip');
        const leftKnee = keypoints.find((k) => k.name === 'left_knee');
        const leftElbow = keypoints.find((k) => k.name === 'left_elbow');
        const leftWrist = keypoints.find((k) => k.name === 'left_wrist');
        
        const rightShoulder = keypoints.find((k) => k.name === 'right_shoulder');
        const rightHip = keypoints.find((k) => k.name === 'right_hip');
        const rightKnee = keypoints.find((k) => k.name === 'right_knee');
        const rightElbow = keypoints.find((k) => k.name === 'right_elbow');
        const rightWrist = keypoints.find((k) => k.name === 'right_wrist');
      
        let leftHipAngle = null;
        let rightHipAngle = null;
        let leftShoulderAngle = null;
        let rightShoulderAngle = null;
        let leftElbowAngle = null;
        let rightElbowAngle = null;
        
        let torso_straightness = null;
        let arms_straightness = null;

        if (leftShoulder && leftHip && leftKnee) {
            leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
        }   
        if (rightShoulder && rightHip && rightKnee) {
            rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
        }
        if (leftHip && leftShoulder && leftElbow) {
            leftShoulderAngle = calculateAngle(leftHip, leftShoulder, leftElbow);
        }
        if (rightHip && rightShoulder && rightElbow) {
            rightShoulderAngle = calculateAngle(rightHip, rightShoulder, rightElbow);
        }
        if (leftShoulder && leftElbow && leftWrist) {
            leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
        }
        if (rightShoulder && rightElbow && rightWrist) {
            rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
        }

        let wrist_x = (leftWrist.x + rightWrist.x) / 2;
        let wrist_y = (leftWrist.y + rightWrist.y) / 2;
        let hip_x = (leftHip.x + rightHip.x) / 2;
        let hip_y = (leftHip.y + rightHip.y) / 2;
        let shoulder_x = (leftShoulder.x + rightShoulder.x) / 2;
        let shoulder_y = (leftShoulder.y + rightShoulder.y) / 2;

        torso_straightness = (shoulder_y - hip_y) / calculateDistance_2(shoulder_x, shoulder_y, hip_x, hip_y);
        arms_straightness = (wrist_y - shoulder_y) / calculateDistance_2(wrist_x, wrist_y, shoulder_x, shoulder_y);
     
        return [leftElbowAngle, rightElbowAngle, leftShoulderAngle, rightShoulderAngle, leftHipAngle, rightHipAngle, torso_straightness, arms_straightness];
    };

    const countReps = async (pose) => {
        if ((pose === 'correct_low' || pose === 'correct_high')&& isWorkoutStarted.current) {
            console.log(poseFrameCountRef.current);
            if (pose === repPoseRef.current) {
                poseFrameCountRef.current = 0;
            } else {
                poseFrameCountRef.current += 1;
                if (poseFrameCountRef.current >= 5) {
                    if (repPoseRef.current === 'correct_high' && pose === 'correct_low') {
                        repCountRef.current += 1;
                    }
                    repPoseRef.current = pose;
                }
            }
        }
    };

    const frameCount = async (pose) => {
        if (pose === 'correct_low' || pose === 'correct_high') {
            correctFrameRef.current += 1;
        } else if (pose === 'incorrect_backward' || pose === 'incorrect_forward') { 
            incorrectFrameRef.current += 1;
        }
    }

    function convertToUTC530() {

        const date = new Date();
    
        // Calculate offset for UTC+05:30 (5.5 hours or 330 minutes)
        const offsetInMinutes = 330; // 5 hours 30 minutes
    
        // Adjust the date by the offset in minutes
        const utc530Date = new Date(date.getTime() + offsetInMinutes * 60000);
        // const extract_date = utc530Date.toISOString().replace('T', ' ').substr(0, 19);
        // const dateDMY = extract_date.split()[0];
        const dateDMY = utc530Date.toISOString().split('T')[0];
    
        return [dateDMY,utc530Date]; // Format the date and time
    }

    const stopWorkout = () => { 
        const repCount = repCountRef.current;
        const correctFrame = correctFrameRef.current;
        const incorrectFrame = incorrectFrameRef.current;
        const accuracy = correctFrame / (correctFrame + incorrectFrame)*100;
        const [date , last_modified] = convertToUTC530()
        console.log("Time: ", time, " Reps: ", repCount, " Correct Frames: ", correctFrame, " Incorrect Frames: ", incorrectFrame, " Accuracy: ", accuracy,"date : ",date , "last_modified : ",last_modified);
        const jsonObject = { time: time, reps: repCount,  accuracy: accuracy , e_name:"lat pull down" , date:date , last_modified:last_modified};
        handleWorkoutData(jsonObject);
        navigator.goBack();
    };

    const handleWorkoutData = async (jsonObject) => {
        
        responseArray = {'workouts':[jsonObject]}
        try{
            const token = await AsyncStorage.getItem("jwtToken");
            if (token) {
                const response = await axios.post("http://192.168.8.123:4000/workout", responseArray,{headers:{'authorization': `Bearer ${token}`}});
            } else {
                console.log("Token not found.");
            }
            
        } catch(error) {
            const data = error.response.data;
            if (error.response.status === 403){
                console.log(data.error);
            }
            if (error.respose.status === 402){
                console.log(data.message);
            }
        }
    };

    const changeWorkoutStatus = () => {
        isWorkoutStarted.current = !isWorkoutStarted.current;
        if (!isWorkoutStarted.current) {
            setPose('random');
        }
    };

    const handleLandmarksDetected = async (keypoints) => {
        if (!isWorkoutStarted.current) {
            return;
        } else{
        try {
            const [leftElbowAngle, rightElbowAngle, leftShoulderAngle, rightShoulderAngle, leftHipAngle, rightHipAngle, torso_straightness, arms_straightness] = inputTensorData(keypoints);
            const inputArray = [leftElbowAngle, rightElbowAngle, leftShoulderAngle, rightShoulderAngle, leftHipAngle, rightHipAngle, torso_straightness, arms_straightness];
            const inputTensor = tf.tensor2d([inputArray], [1, inputArray.length]);
            const result = await predict(inputTensor);
            setPrediction(result);

            let maxIndex = result.indexOf(Math.max(...result));
            let pose;

            if (maxIndex === 1) {
                pose = 'correct_low';
                setExcercisePose(pose);
                setPose('correct');
            } else if (maxIndex === 0) {
                pose = 'correct_high';
                setExcercisePose(pose);
                setPose('correct');
            } else if (maxIndex === 2) {
                pose = 'incorrect';
                setExcercisePose(pose);
                setPose('incorrect');
            } else if (maxIndex === 3) {
                pose = 'random';
                setExcercisePose(pose);
                setPose('random');
            }

            countReps(pose);
            frameCount(pose);

        } catch (error) {
            console.error("Error during prediction:", error);
        }
        }
    };

    if (!isModelLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text color="white">Loading model...</Text>
            </View>
        );
    }
    const alertBoxStyle =
        excercisePose === 'correct_low' || excercisePose === 'correct_high'
            ? styles.alertBoxCorrect
            : styles.alertBoxIncorrect;
    const alertTextStyle =
        excercisePose === 'correct_low' || excercisePose === 'correct_high'
            ? styles.alertTextCorrect
            : styles.alertTextIncorrect;
    const infoBoxStyle =
        excercisePose === 'correct_low' || excercisePose === 'correct_high'
            ? styles.infoBoxCorrect
            : styles.infoBoxIncorrect;

    return (
                <View style={styles.container}>
                    <PoseDetectionCamera onLandmarksDetected={handleLandmarksDetected} poseType={poseType} />
                    <View style={infoBoxStyle}>
                        <View style={styles.centeredTopView}>
                            <View style={alertBoxStyle}>
                                {poseType === 'correct' && (<Text style={alertTextStyle}>Good Posture</Text>)}
                                {poseType === 'incorrect' && (<Text style={alertTextStyle}>Straighten your torso, keep your torso Vertical</Text>)}
                            </View>
                        </View>
                        <View style={styles.stats}>
                            <Text style={styles.statTitle}>
                                Reps: <Text style={styles.statText}>{repCountRef.current}</Text>
                            </Text>
                            <Text style={styles.statTitle}>
                                Time: <Text style={styles.statText}>{time}s</Text>
                            </Text>
                        </View>
                    </View>
                    <View style={styles.controlButtons}>
                        <TouchableOpacity style={styles.btn_1} onPress={changeWorkoutStatus}>
                            <Text style={styles.btnText}>{isWorkoutStarted.current ? "Pause" : "Start"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn_2} onPress={stopWorkout}>
                            <Text style={styles.btnText}>Stop</Text>
                        </TouchableOpacity>
                    </View>
                </View>
    )};

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#232323',
        },
        centeredTopView: {
            alignItems: 'center', // Center the top content
            marginBottom: 20, // Add space between top view and reps/timer
        },
        infoBoxCorrect: {
            backgroundColor: '#E2F163',
            padding: 15,
            borderRadius: 12,
            alignItems: 'center', // Center the text vertically
            marginTop: 20,
            marginHorizontal: 50,
            height: 150,
        },
        infoBoxIncorrect: {
            backgroundColor: '#F99A46',
            padding: 15,
            borderRadius: 12,
            alignItems: 'center', // Center the text vertically
            marginTop: 20,
            marginHorizontal: 50,
            height: 150,
        },
        alertBoxCorrect: {
            alignItems: 'center',
            padding: 10,
            borderRadius: 8,
        },
        alertBoxIncorrect: {
            alignItems: 'center',
            padding: 0,
            borderRadius: 8,
        },
        alertTextCorrect: {
            fontSize: 20,
            color: 'black',
            fontWeight: 'bold',
        },
        alertTextIncorrect: {
            fontSize: 20,
            color: 'black',
            fontWeight: 'bold',
        },
        stats: {
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: 190
        },
        statTitle: {
            fontSize: 18,
            fontWeight: 'bold',
        },
        statText: {
            fontSize: 16,
            color: '#505050',
            marginTop: 5,
        },
        controlButtons: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'space-between',
            width: '50%',
            alignSelf: 'center',
        },
        btn_1: {
            width: 70,
            height: 40,
            backgroundColor: '#E2F163',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
        },
        btn_2: {
            width: 70,
            height: 40,
            backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
        },
        btnText: {
            color: '#000',
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
        },
    });
    
    export default LatPullDown_Model;
    