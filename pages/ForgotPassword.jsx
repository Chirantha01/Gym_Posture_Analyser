import React, { useState, useRef, useEffect } from 'react';
import { Alert, Animated, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({ email: [] });
    const [otherError, setOtherError] = useState("");
    const buttonScale = useRef(new Animated.Value(1)).current;
    const navigation = useNavigation();

    const handlePressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        setErrors({ email: [] });
        setOtherError("");
        navigation.navigate("ConfirmOtp");


        // try {
        //     console.log({ email });
        //     const response = await axios.post("http://192.168.1.148:4000/forgot-password", { email });

        //     if (response.data.success) {
        //         Alert.alert("Success", "An OTP has been sent to your email.");
        //         // Navigate to the OTP confirmation page
        //         navigation.navigate("ConfirmOtp"); 
        //     }
        // } catch (error) {
        //     if (error.response && error.response.status === 400) {
        //         const data = error.response.data;
        //         setErrors((prevErrors) => ({
        //             ...prevErrors,
        //             email: [data.message || "Invalid email address."]
        //         }));
        //     } else {
        //         console.log("Something went wrong: ", error.message);
        //         setOtherError("Something went wrong! Check your Internet connection.");
        //     }
        // }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Forgot Password</Text>
            </View>
            <Text style={styles.title}>Reset Your Password</Text>
            <Text style={styles.paragraph}>Please enter your email address to receive a password reset link.</Text>
            <View style={styles.inputView}>
                <Text style={styles.textInputTitle}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder='YOUR EMAIL'
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    autoCorrect={false}
                    autoCapitalize='none'
                />
                {errors.email.length > 0 && errors.email.map((err, idx) => (
                    <Text key={idx} style={styles.requiredText}>{err}</Text>
                ))}
            </View>

            <View style={styles.buttonView}>
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <Pressable
                        style={styles.button}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={handleForgotPassword}
                    >
                        <Text style={styles.buttonText}>Send Reset Link</Text>
                    </Pressable>
                </Animated.View>
            </View>
            {otherError !== "" && <Text style={styles.requiredText}>{otherError}</Text>}
            <Text style={styles.footerText}>
                Back to <Text style={styles.signup} onPress={() => navigation.goBack()}>Login</Text>
            </Text>
        </SafeAreaView>
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingTop: 70,
        backgroundColor: "#232323",
        flex: 1,
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
    requiredText: {
        fontSize: 10,
        color: "red"
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
    headerTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#E2F163',
        flex: 1,
    },
});
