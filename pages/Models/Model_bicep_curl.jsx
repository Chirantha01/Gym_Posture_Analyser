import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import PoseDetectionCamera from '../../Components/cameraComponent'; // Adjust path as necessary
import { loadModel, predict } from '../../offline_model/bicep_curl_class/Model_Loader_Bicep_Curl';
import * as tf from '@tensorflow/tfjs';
import { calculateAngle } from '../supporting_methods/angle';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { event } from 'react-native-reanimated';

const Bicep_Model = () => {
    const [poseType, setPose] = useState('random');
    const [excercisePose, setExcercisePose] = useState(NaN);
    const [prediction, setPrediction] = useState(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [date , setDate] = useState("")
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
            leftShoulderAngle = calculateAngle(leftElbow, leftShoulder, leftHip);
        }
        if (rightShoulder && rightElbow && rightHip) {
            rightShoulderAngle = calculateAngle(rightElbow, rightShoulder, rightHip);
        }
        return [leftElbowAngle, rightElbowAngle, leftShoulderAngle, rightShoulderAngle];
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
        const accuracy = correctFrame / (correctFrame + incorrectFrame);
        const [date , last_modified] = convertToUTC530()
        console.log("Time: ", time, " Reps: ", repCount, " Correct Frames: ", correctFrame, " Incorrect Frames: ", incorrectFrame, " Accuracy: ", accuracy,"date : ",date , "last_modified : ",last_modified);
        const jsonObject = { time: time, reps: repCount,  accuracy: accuracy , e_name:"Bicep Curls" , date:date , last_modified:last_modified};
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
        
        try{
            const token = await AsyncStorage.getItem("jwtToken");
            if (token) {
                const response = await axios.post("http://192.168.241.208:4000/workout", jsonObject,{headers:{'authorization': `Bearer ${token}`}});
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
      if ((pose === 'correct_low' || pose === 'correct_high')&& isWorkoutStarted.current) {

          if (pose === repPoseRef.current) {
            poseFrameCountRef.current = 0;
          } 
          else {
              poseFrameCountRef.current += 1
              if (poseFrameCountRef.current >= 5) {
                  if (repPoseRef.current === 'correct_low', pose === 'correct_high') {
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
        } else{
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
                pose = 'correct_high';
                setExcercisePose(pose);
                setPose('correct');
            } else if (maxIndex === 2) {
                pose = 'incorrect_forward';
                setExcercisePose(pose);
                setPose('incorrect');
            } else if (maxIndex === 3) {
                pose = 'incorrect_backward';
                setExcercisePose(pose);
                setPose('incorrect');
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
            <PoseDetectionCamera onLandmarksDetected={handleLandmarksDetected} poseType={poseType} />
            <View style={infoBoxStyle}>
            <View style={styles.centeredTopView}>
                    <View style={alertBoxStyle}>
                        {poseType === 'correct' && <Text style={alertTextStyle}>Good Posture</Text>}
                        {poseType === 'incorrect' && (
                            <Text style={alertTextStyle}>Keep your elbows tucked to torso</Text>
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
                <Button title= {isWorkoutStarted.current ? "Pause" : "Start"} onPress={changeWorkoutStatus} />
                <Button title= "Stop" onPress={stopWorkout} />
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

export default Bicep_Model;
