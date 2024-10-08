import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import PoseDetectionCamera from '../../Components/cameraComponent'; // Adjust path as necessary
import { loadModel, predict } from '../../offline_model/squat_class/Model_Loader_Squat';
import * as tf from '@tensorflow/tfjs';
import {calculateAngle, calculateDistance, calculateDistance_2} from '../supporting_methods/angle';

const Squat_Model = () => {
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

  
    const handleLandmarksDetected = async (keypoints) => {
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
        console.log('Result:', result, 'Pose:', pose);

        console.log('correct_high: ',result[0],' correct_low: ',result[1],' incorrect: ',result[2], ' random: ',result[3]);

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
  
  export default Squat_Model;