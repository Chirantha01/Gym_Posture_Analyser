import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import PoseDetectionCamera from '../../Components/cameraComponent'; // Adjust path as necessary
import { loadModel, predict } from '../../offline_model/squat_class/Model_Loader_Squat';
import * as tf from '@tensorflow/tfjs';
import {calculateAngle, calculateDistance_2} from '../supporting_methods/angle';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Squat_Model = () => {
    const [poseType, setPose] = useState('random')
    const [excercisePose, setExcercisePose] = useState(NaN)
    const [prediction, setPrediction] = useState(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [time, setTime] = useState(0);
    const timerRef = useRef(null);
    const repPoseRef = useRef(null); // Ref to track current repPose immediately
    const poseFrameCountRef = useRef(0); // Ref to track frames in the same pose immediately
    const repCountRef = useRef(0); // Ref to track repCount immediately
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
          // Start the timer if in correct posture
          if (!timerRef.current) {
              timerRef.current = setInterval(() => {
                  setTime(prevTime => prevTime + 1);
              }, 1000);
          }
      } else {
          // Stop the timer if not in correct posture
          if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
          }
      }

      return () => {
          // Cleanup the interval on component unmount
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
      const leftAnkle = keypoints.find((k) => k.name === 'left_ankle');
      
      const rightShoulder = keypoints.find((k) => k.name === 'right_shoulder');
      const rightHip = keypoints.find((k) => k.name === 'right_hip');
      const rightKnee = keypoints.find((k) => k.name === 'right_knee');
      const rightAnkle = keypoints.find((k) => k.name === 'right_ankle');
    
      let leftHipAngle = null;
      let rightHipAngle = null;
      let leftKneeAngle = null;
      let rightKneeAngle = null;
      let knee_displacement_ratio = null;
      let hip_displacement_ratio = null;
      let shoulder_descent_ratio = null;
    
      if (leftShoulder && leftHip && leftKnee) {
        leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
      }   
      if (rightShoulder && rightHip && rightKnee) {
        rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
      }
      if (leftHip && leftKnee && leftAnkle) {
        leftKneeAngle = calculateAngle(leftHip,leftKnee,leftAnkle);
      }
      if (rightHip && rightKnee && rightAnkle) {
        rightKneeAngle = calculateAngle(rightHip,rightKnee,rightAnkle);
      }

      let knee_x = (leftKnee.x + rightKnee.x) / 2;
      let knee_y = (leftKnee.y + rightKnee.y) / 2;
      let hip_x = (leftHip.x + rightHip.x) / 2;
      let hip_y = (leftHip.y + rightHip.y) / 2;
      let shoulder_x = (leftShoulder.x + rightShoulder.x) / 2;
      let shoulder_y = (leftShoulder.y + rightShoulder.y) / 2;
      let ankle_x = (leftAnkle.x + rightAnkle.x) / 2;
      let ankle_y = (leftAnkle.y + rightAnkle.y) / 2;

      knee_displacement_ratio = (knee_y - ankle_y) / calculateDistance_2(knee_x,knee_y,hip_x,hip_y);
      hip_displacement_ratio = (hip_y - shoulder_y) / calculateDistance_2(hip_x,hip_y,knee_x,knee_y);
      shoulder_descent_ratio = calculateDistance_2(knee_x,knee_y,shoulder_x,shoulder_y) / (calculateDistance_2(hip_x,hip_y,knee_x,knee_y) + calculateDistance_2(shoulder_x,shoulder_y,hip_x,hip_y));
   
      return [leftHipAngle, rightHipAngle, leftKneeAngle, rightKneeAngle, knee_displacement_ratio, hip_displacement_ratio, shoulder_descent_ratio];
  };

  const frameCount = async (pose  ) => {
    if (pose === 'correct_low' || pose === 'correct_high') {
        correctFrameRef.current += 1;
    } else if (pose === 'incorrect_backward' || pose === 'incorrect_forward') { 
        incorrectFrameRef.current += 1;
    }
    }

    const stopWorkout = () => { 
        const repCount = repCountRef.current;
        const correctFrame = correctFrameRef.current;
        const incorrectFrame = incorrectFrameRef.current;
        const accuracy = correctFrame / (correctFrame + incorrectFrame)*100;
        const [date , last_modified] = convertToUTC530()
        const jsonObject = { time: time, reps: repCount,  accuracy: accuracy , e_name:"squat" , date:date , last_modified:last_modified};
        handleWorkoutData(jsonObject);
        navigator.goBack();
    };

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


const handleWorkoutData = async (jsonObject) => {

    responseArray = {'workouts':[jsonObject]}
    try{
        const token = await AsyncStorage.getItem("jwtToken");
        if (token) {
            const response = await axios.post("http://43.205.242.48/workouts", responseArray,{headers:{'authorization': `Bearer ${token}`}});
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

  const countReps = async (pose) => {
    if (pose === 'correct_low' || pose === 'correct_high') {
        console.log(poseFrameCountRef.current);
        if (pose === repPoseRef.current) {
          poseFrameCountRef.current = 0;
        } 
        else {
            poseFrameCountRef.current += 1
            if (poseFrameCountRef.current >= 5) {
                if (repPoseRef.current === 'correct_high', pose === 'correct_low') {
                    repCountRef.current += 1;
                }
                // setRepPose(pose);
                repPoseRef.current = pose;
                
            }
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
      }
        else{
      
    try {
        const [leftHipAngle, rightHipAngle, leftKneeAngle, rightKneeAngle, knee_displacement_ratio, hip_displacement_ratio, shoulder_descent_ratio] = inputTensorData(keypoints);

        // Create a 7D tensor from the calculated angles and height
        const inputArray = [leftHipAngle, rightHipAngle, leftKneeAngle, rightKneeAngle, knee_displacement_ratio, hip_displacement_ratio, shoulder_descent_ratio];
        const inputTensor = tf.tensor2d([inputArray], [1, inputArray.length]);

        // Get the prediction
        const result = await predict(inputTensor);
        setPrediction(result); // Assuming result is a single prediction value
        
        let maxIndex = result.indexOf(Math.max(...result));
        
        let pose;

        if (maxIndex === 0) {
          pose = 'correct_high';
          setExcercisePose(pose);
          setPose('correct');
        } else if (maxIndex === 1) {
          pose = 'correct_low';
          setExcercisePose(pose);
          setPose('correct');
        } else if (maxIndex === 2) {
          pose = 'incorrect';
          setExcercisePose(pose);
          setPose('incorrect');
        } 
        else if (maxIndex === 3) {
          pose = 'random';
          setExcercisePose(pose);
          setPose('random');
        }

        countReps(pose);
        frameCount(pose);

      } catch (error) {
        console.error("Error during prediction:", error);
      };
    };
};
    if (!isModelLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading model...</Text>
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
                        {excercisePose === 'correct_low' && <Text style={alertTextStyle}>Good Posture</Text>}
                        {excercisePose === 'correct_high' && <Text style={alertTextStyle}>Good Posture</Text>}
                        {excercisePose === 'incorrect_forward' && (
                            <Text style={alertTextStyle}>Keep a neutral spine. Restrict the movement of the knees.</Text>
                        )}
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
    );
  };

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#232323',
    },
    centeredTopView: {
        alignItems: 'center', 
        marginBottom: 20, 
    },
    infoBoxCorrect: {
        backgroundColor: '#E2F163',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center', 
        marginTop: 20,
        marginHorizontal: 50,
        height: 150,
    },
    infoBoxIncorrect: {
        backgroundColor: '#F99A46',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center', 
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
        color: 'Black',
        fontWeight: 'bold',
    },
    alertTextIncorrect: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
    },
    stats: {
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

  
  export default Squat_Model;