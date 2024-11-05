import React, { useState, useRef , useEffect } from 'react';
import { Alert, Button, Image, Pressable, SafeAreaView, StyleSheet, Switch, Text, TextInput, View, Animated } from 'react-native';
const logo = require("../assets/logo.png");
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

//login page
const LoginForm = ({ onSignIn, onSwitchToSignUp, onGoBack }) => {
    const [click, setClick] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({usernameOrEmail:[],password:[]});
    const [otherError , setOtherError] = useState("");
    const buttonScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        console.log(errors); // This will log after the state has updated and re-rendered
        console.log(otherError);
    }, [errors,otherError]);

    const handlePressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.95, // Scale down to 95%
            useNativeDriver: true, // Use native driver for better performance
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1, // Scale back to 100%
            useNativeDriver: true,
        }).start();
    };

    const handleBackendErrors = (responseErrors) => {
        const errorMap = {
            usernameOrEmail: [],
            password: []
        };
    
        // Initialize each field with an empty array
        responseErrors.forEach((error) => {
          if (!errorMap[error.field]) {
            errorMap[error.field] = [];
          }
          // Push the error message to the array of errors for the corresponding field
          errorMap[error.field].push(error.message);
        });
        console.log(errorMap);
        setErrors(errorMap); // Update error state
      };

    const handleSignIn = async (event) => {
        console.log(username);
        event.preventDefault();
        setErrors({usernameOrEmail:[],password:[]});
        setOtherError("");
        try{
            console.log({ usernameOrEmail: username, password: password });
            const response = await axios.post("http://43.205.242.48/signin", { usernameOrEmail: username, password: password });

            const data = response.data;
            const token = data.token;
            if (token) {
                await AsyncStorage.setItem('jwtToken', token);
            }
            onSignIn();
        } catch(error) {
            if (error.response && error.response.status === 400) {
                const data = error.response.data;
                if (data.errors) {
                  handleBackendErrors(data.errors); // Update the error state with backend errors
              
                } else{
                    const newErrorMap = { ...errors };
                    if (!newErrorMap[data.field].includes(data.message)) {
                        newErrorMap[data.field] = [...newErrorMap[data.field], data.message];
                    }
                    setErrors(newErrorMap);
                }
              } else {
                // Handle other possible errors (network issues, server problems, etc.)
                console.log("Something went wrong: ", error.message);
                setOtherError("Something went Wrong! Check your Internet connection.")
              }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Log in</Text>
            </View>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.paragraph}>Login to track your workout with good posture and get jacked</Text>
            <View style={styles.inputView}>
                <Text style={styles.textInputTitle}>Username or email</Text>
                <TextInput style={styles.input} placeholder='EMAIL OR USERNAME' value={username} onChangeText={(text) => setUsername(text)} autoCorrect={false}
                    autoCapitalize='none' />
                {errors.usernameOrEmail && errors.usernameOrEmail.length > 0 && errors.usernameOrEmail.map((err, idx) => (
                    <Text key={idx} style={styles.requiredText}>{err}</Text>
                ))}
                <Text style={styles.textInputTitle}>Password</Text>
                <TextInput style={styles.input} placeholder='PASSWORD' secureTextEntry value={password} onChangeText={setPassword} autoCorrect={false}
                    autoCapitalize='none' />
                {errors.password && errors.password.length > 0 && errors.password.map((err, idx) => (
                    <Text key={idx} style={styles.requiredText}>{err}</Text>
                ))}
                <Text style={styles.forgetText}>Forgot Password?</Text>
            </View>

            <View style={styles.buttonView}>
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <Pressable 
                        style={styles.button} 
                        onPressIn={handlePressIn} 
                        onPressOut={handlePressOut} 
                        onPress={handleSignIn}
                    >
                        <Text style={styles.buttonText}>Log In</Text>
                    </Pressable>
                </Animated.View>
                <Text style={styles.optionsText}>or sign up with</Text>
            </View>
            {otherError !== "" && <Text style={styles.requiredText}>{otherError}</Text>}

            <Text style={styles.footerText}>Don't have an account?<Text style={styles.signup} onPress={onSwitchToSignUp}>  Sign Up</Text></Text>
        </SafeAreaView>
    );
};

export default LoginForm;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingTop: 70,
        backgroundColor: "#232323",
        flex: 1,
    },
    image: {
        height: 160,
        width: 170
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        paddingTop: 60,
        color: "white"
    },
    paragraph: {
        fontSize: 14,
        textAlign: "center",
        paddingTop: 20,
        paddingBottom: 60,
        paddingHorizontal: 50,
        color: "white"
    },
    inputView: {
        gap: 15,
        width: "100%",
        paddingHorizontal: 40,
        paddingBottom: 20,
        marginBottom: 5,
        backgroundColor: "#B3A0FF",
    },
    textInputTitle: {
        color: "#232323",
        fontSize: 15,
        fontWeight: "600",
        paddingTop: 20,
        paddingBottom: 5,
        paddingLeft: 10,
    },
    requiredText:{
        fontsize: 10,
        color:"red"
    },
    forgetText:{
        fontSize: 13,
        fontWeight: "500",
        paddingTop: 10,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: 'right',
    },
    input: {
        fontSize: 17,
        height: 50,
        fontWeight: "500",
        paddingHorizontal: 20,
        backgroundColor: "white",
        borderWidth: 0,
        borderRadius: 15
    },
    button: {
        backgroundColor: "#373737",
        height: 50,
        width: 200,
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold"
    },
    buttonView: {
        paddingTop: 40,
        width: "100%",
        paddingHorizontal: 50,
        alignItems: 'center',
    },
    optionsText: {
        textAlign: "center",
        paddingVertical: 10,
        color: "gray",
        fontSize: 13,
        marginBottom: 6
    },
    footerText: {
        textAlign: "center",
        color: "gray",
    },
    signup: {
        color: "#E2F163",
        fontSize: 13
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        flex: 1,
        left: 20,
        top: 9,
    },
    headerTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#E2F163',
        flex: 1,
    },
});
