import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, ActivityIndicator } from 'react-native';
import PoseDetectionCamera from '../Components/cameraComponent'; // Adjust path as necessary
import { loadModel, predict } from '../offline_model/squat_class/squatModel';
import * as tf from '@tensorflow/tfjs';

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
  
    const handleLandmarksDetected = async (keypoints) => {
      try {
        const normalizedKeypoints = keypoints.map((keypoint) => ({
          ...keypoint,
          x: (1 - (keypoint.x / (CAM_PREVIEW_WIDTH * 0.5))),
          y: (1 - (keypoint.y / (CAM_PREVIEW_HEIGHT * 0.5))),
        }));
        setLandmarks(normalizedKeypoints);
  
        // Create a tensor from the x and y values
        const xValues = normalizedKeypoints.map((keypoint) => keypoint.x);
        const yValues = normalizedKeypoints.map((keypoint) => keypoint.y);
        const inputArray = [...xValues, ...yValues];
  
        const inputTensor = tf.tensor2d([inputArray], [1, inputArray.length]);
  
        // Get the prediction
        const result = await predict(inputTensor);
        setPrediction(result); // Assuming result is a single prediction value
      } catch (error) {
        console.error("Error during prediction:", error);
      }
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