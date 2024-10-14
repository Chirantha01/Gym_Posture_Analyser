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
    const repPoseRef = useRef(null); // Ref to track current repPose immediately
    const poseFrameCountRef = useRef(0); // Ref to track frames in the same pose immediately
    const repCountRef = useRef(0); // Ref to track repCount immediately

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

        countReps(pose);

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
        </View>
    );
  };

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
        color: 'Black',
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
    }
});

  
  export default Squat_Model;