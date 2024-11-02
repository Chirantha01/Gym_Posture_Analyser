import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet,TouchableOpacity } from 'react-native';
import PoseDetectionCamera from '../../Components/cameraComponent'; // Adjust path as necessary
import { loadModel, predict } from '../../offline_model/plank_class/Model_Loader_Plank';
import * as tf from '@tensorflow/tfjs';
import {calculateAngle , averagePostureHeight} from './../supporting_methods/angle';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

const Plank_Model = () => {
    const [poseType, setPose] = useState('normal')
    const [prediction, setPrediction] = useState(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [time, setTime] = useState(0);
    const timerRef = useRef(null);
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
      const leftElbow = keypoints.find((k) => k.name === 'left_elbow');
      const leftWrist = keypoints.find((k) => k.name === 'left_wrist');
      const leftHip = keypoints.find((k) => k.name === 'left_hip');
      const leftKnee = keypoints.find((k) => k.name === 'left_knee');
      const leftAnkle = keypoints.find((k) => k.name === 'left_ankle');
      
      const rightShoulder = keypoints.find((k) => k.name === 'right_shoulder');
      const rightElbow = keypoints.find((k) => k.name === 'right_elbow');
      const rightWrist = keypoints.find((k) => k.name === 'right_wrist');
      const rightHip = keypoints.find((k) => k.name === 'right_hip');
      const rightKnee = keypoints.find((k) => k.name === 'right_knee');
      const rightAnkle = keypoints.find((k) => k.name === 'right_ankle');
    
      let leftShoulderAngle = null;
      let rightShoulderAngle = null;
      let leftElbowAngle = null;
      let rightElbowAngle = null;
      let leftHipAngle = null;
      let rightHipAngle = null;
      let leftKneeAngle = null;
      let rightKneeAngle = null;

      let knee = null;
      let shoulder = null;
      let hip = null;
      let elbow = null;

    
      if (leftShoulder && leftElbow && leftWrist) {
        leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
      }   
      if (rightShoulder && rightElbow && rightWrist) {
        rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
      }
      if (leftShoulder && leftElbow && leftHip) {
        leftShoulderAngle = calculateAngle(leftElbow,leftShoulder,leftHip);
      }
      if (rightShoulder && rightElbow && rightHip) {
        rightShoulderAngle = calculateAngle(rightElbow,rightShoulder,rightHip);
      }
      if (leftShoulder && leftHip && leftKnee) {
        leftHipAngle = calculateAngle(leftShoulder,leftHip,leftKnee);
      }
      if (rightShoulder && rightHip && rightKnee) {
        rightHipAngle = calculateAngle(rightShoulder,rightHip,rightKnee);
      }
      if (leftHip && leftKnee && leftAnkle) {
        leftKneeAngle = calculateAngle(leftHip,leftKnee,leftAnkle);
      }
      if (rightHip && rightKnee && rightAnkle) {
        rightKneeAngle = calculateAngle(rightHip,rightKnee,rightAnkle);
      }
      if (leftElbowAngle && rightElbowAngle) {
        elbow = (leftElbowAngle + rightElbowAngle)/2;
      }
      if (leftShoulderAngle && rightShoulderAngle) {
        shoulder = (leftShoulderAngle + rightShoulderAngle)/2;
      }
      if (leftHipAngle && rightHipAngle) {
        hip = (leftHipAngle + rightHipAngle)/2;
      }
      if (leftKneeAngle && rightKneeAngle) {
        knee = (leftKneeAngle + rightKneeAngle)/2;
      }
      
      let height = averagePostureHeight(rightAnkle,leftAnkle,nose);
      return [knee, hip, shoulder, elbow, height];
  };

  const frameCount = async(pose) =>{
    if (pose === 'correct') {
      correctFrameRef.current += 1;
    } else if (pose === 'incorrect') {
      incorrectFrameRef.current += 1;
    }
  }

  const stopWorkout = () => { 
    const correctFrame = correctFrameRef.current;
    const incorrectFrame = incorrectFrameRef.current;
    const accuracy = correctFrame / (correctFrame + incorrectFrame)*100;
    const [date , last_modified] = convertToUTC530()
    console.log("Time: ", time, " Correct Frames: ", correctFrame, " Incorrect Frames: ", incorrectFrame, " Accuracy: ", accuracy,"date : ",date , "last_modified : ",last_modified);
    const jsonObject = { time: time,  accuracy: accuracy , e_name:"Plank" , date:date , last_modified:last_modified};
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
            const response = await axios.post("http://192.168.8.123:4000/workouts", responseArray,{headers:{'authorization': `Bearer ${token}`}});
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
      try {
        const [knee, hip, shoulder, elbow, height] = inputTensorData(keypoints);

        // Create a 5D tensor from the calculated angles and height
        const inputArray = [knee, hip, shoulder, elbow, height];
        const inputTensor = tf.tensor2d([inputArray], [1, inputArray.length]);

        // Get the prediction
        const result = await predict(inputTensor);
        setPrediction(result); // Assuming result is a single prediction value
        
        let maxIndex = result.indexOf(Math.max(...result));
        
        let pose;

        if (maxIndex === 0) {
          pose = 'correct';
          setPose('correct')
        } else if (maxIndex === 1) {
          pose = 'incorrect';
          setPose('incorrect');
        } else if (maxIndex === 2) {
          pose = 'random';
          setPose('random');
        } 
        frameCount(pose);

      } catch (error) {
        console.error("Error during prediction:", error);
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
        poseType === 'correct'
            ? styles.alertBoxCorrect
            : styles.alertBoxIncorrect;
    const alertTextStyle =
        poseType === 'correct'
            ? styles.alertTextCorrect
            : styles.alertTextIncorrect;
    const infoBoxStyle =
        poseType === 'correct'
            ? styles.infoBoxCorrect
            : styles.infoBoxIncorrect;
  
    return (
      <View style={styles.container}>
        <PoseDetectionCamera onLandmarksDetected={handleLandmarksDetected} poseType={poseType}/>
        <View style={infoBoxStyle}>
          <View style={styles.centeredTopView}>
            <View style={alertBoxStyle}>
                    {poseType === 'correct' && (<Text style={alertTextStyle}>Good Posture</Text>)}
                    {poseType === 'incorrect' && (<Text style={alertTextStyle}>Back is arched. Keep your body straight.</Text>)}
            </View>
          </View>
          <View style={styles.stats}>
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
  
  export default Plank_Model;