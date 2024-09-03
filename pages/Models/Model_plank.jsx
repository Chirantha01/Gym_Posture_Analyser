import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, ActivityIndicator } from 'react-native';
import PoseDetectionCamera from '../../Components/cameraComponent'; // Adjust path as necessary
import { loadModel, predict } from '../../offline_model/squat_class/squatModel';
import * as tf from '@tensorflow/tfjs';
import {calculateAngle , averagePostureHeight} from './../supporting_methods/angle';

const Model = () => {
    const [landmarks, setLandmarks] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
  
    const CAM_PREVIEW_WIDTH = Dimensions.get('window').width;
    const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / (3 / 4);
  
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
      console.log(height);
      return {
        knee,
        hip,
        shoulder,
        elbow,
        height
      };
  };

  
    const handleLandmarksDetected = async (keypoints) => {
      inputTensorData(keypoints);
      // try {
        
      //   const normalizedKeypoints = keypoints.map((keypoint) => ({
      //     ...keypoint,
      //     x: (1 - (keypoint.x / (CAM_PREVIEW_WIDTH * 0.5))),
      //     y: (1 - (keypoint.y / (CAM_PREVIEW_HEIGHT * 0.5))),
      //   }));
      //   setLandmarks(normalizedKeypoints);
  
      //   // Create a tensor from the x and y values
      //   const xValues = normalizedKeypoints.map((keypoint) => keypoint.x);
      //   const yValues = normalizedKeypoints.map((keypoint) => keypoint.y);
      //   const inputArray = [...xValues, ...yValues];
  
      //   const inputTensor = tf.tensor2d([inputArray], [1, inputArray.length]);
  
      //   // Get the prediction
      //   const result = await predict(inputTensor);
      //   setPrediction(result); // Assuming result is a single prediction value
      // } catch (error) {
      //   console.error("Error during prediction:", error);
      // }
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
        <PoseDetectionCamera onLandmarksDetected={handleLandmarksDetected} />
        {/* <View style={{ padding: 10 }}>
          <Text>Detected Landmarks:</Text>
          {landmarks.map((keypoint, index) => (
            <Text key={index}>
              {keypoint.name}: ({keypoint.x.toFixed(2)}, {keypoint.y.toFixed(2)})
            </Text>
          ))}
        </View> */}
        <View style={{ padding: 10 }}>
          <Text>Prediction: {prediction !== null ? prediction : 'Calculating...'}</Text>
        </View>
      </View>
    );
  };
  
  export default Model;