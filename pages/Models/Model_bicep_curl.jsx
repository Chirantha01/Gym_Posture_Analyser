import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import PoseDetectionCamera from '../../Components/cameraComponent'; // Adjust path as necessary
import { loadModel, predict } from '../../offline_model/bicep_curl_class/Model_Loader_Bicep_Curl';
import * as tf from '@tensorflow/tfjs';
import {calculateAngle} from '../supporting_methods/angle';

const Bicep_Model = () => {
    const [poseType, setPose] = useState('normal')
    const [excercisePose, setExcercisePose] = useState(NaN)
    const [prediction, setPrediction] = useState(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [time, setTime] = useState(0);
    const timerRef = useRef(null);
  
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
      
      const rightShoulder = keypoints.find((k) => k.name === 'right_shoulder');
      const rightElbow = keypoints.find((k) => k.name === 'right_elbow');
      const rightWrist = keypoints.find((k) => k.name === 'right_wrist');
      const rightHip = keypoints.find((k) => k.name === 'right_hip');
    
      let leftShoulderAngle = null;
      let rightShoulderAngle = null;
      let leftElbowAngle = null;
      let rightElbowAngle = null;

    
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
      return [leftElbowAngle, rightElbowAngle, leftShoulderAngle, rightShoulderAngle];
  };

  
    const handleLandmarksDetected = async (keypoints) => {
      try {
        const [leftElbowAngle, rightElbowAngle, leftShoulderAngle, rightShoulderAngle] = inputTensorData(keypoints);

        // Create a 4D tensor from the calculated angles and height
        const inputArray = [leftElbowAngle, rightElbowAngle, leftShoulderAngle, rightShoulderAngle];
        const inputTensor = tf.tensor2d([inputArray], [1, inputArray.length]);

        // Get the prediction
        const result = await predict(inputTensor);
        setPrediction(result); // Assuming result is a single prediction value
        
        let maxIndex = result.indexOf(Math.max(...result));
        
        let pose;

        if (maxIndex === 0) {
          pose = 'correct_low';
          setExcercisePose(pose);
          setPose('correct');
        } else if (maxIndex === 1) {
          pose = 'correct_hight';
          setExcercisePose(pose);
          setPose('correct');
        } else if (maxIndex === 2) {
          pose = 'incorrect_forward';
          setExcercisePose(pose);
          setPose('incorrect');
        } 
        else if (maxIndex === 3) {
          pose = 'incorrect_backward';
          setExcercisePose(pose);
          setPose('incorrect');
        }
        console.log('Result:', result, 'Pose:', pose);

        console.log('correct_low: ',result[0],' correct_hight: ',result[1],' incorrect_forwad: ',result[2], ' incorrect_backward: ',result[3]);

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
  
    return (
      <View style={{ flex: 1 }}>
        <PoseDetectionCamera onLandmarksDetected={handleLandmarksDetected} poseType={poseType}/>
        <View style={{ padding: 10 }}>
                {excercisePose === 'correct_low' && (<View style={styles.alertBoxCorrect}><Text style={styles.alertText}>Correct_LOW</Text></View>)}
                {excercisePose === 'correct_high' && (<View style={styles.alertBoxCorrect}><Text style={styles.alertText}>Correct_HIGH</Text></View>)}
                {excercisePose === 'correct_low' && (<View style={styles.alertBoxIncorrect}><Text style={styles.alertText}>Correct_LOW</Text></View>)}
                {excercisePose === 'correct_low' && (<View style={styles.alertBoxIncorrect}><Text style={styles.alertText}>Correct_LOW</Text></View>)}
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    alertBoxIncorrect: {
        position: 'absolute',
        bottom: 20,
        left: '35%',
        transform: [{ translateX: -75 }],
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        zIndex: 100,
    },
    alertBoxCorrect: {
      position: 'absolute',
      bottom: 20,
      left: '45%',
      transform: [{ translateX: -75 }],
      backgroundColor: 'green',
      padding: 10,
      borderRadius: 5,
      zIndex: 100,
  },
    alertText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
  
  export default Bicep_Model;