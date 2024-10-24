import React, { useState, useRef } from 'react';
import { Animated, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import axios from 'axios';

const ConfirmOtp = ({ route, navigation }) => {
    // const { email } = route.params; // Get email from the previous screen
    const email = "mockEmail@email.com";
    const [otp, setOtp] = useState("");
    const [errors, setErrors] = useState([]);
    const buttonScale = useRef(new Animated.Value(1)).current;

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

    const handleConfirmOtp = async (event) => {
        event.preventDefault();
        setErrors([]);
        
        try {
            const response = await axios.post("http://192.168.1.148:4000/confirm-otp", { email, otp });

            if (response.data.success) {
                Alert.alert("Success", "OTP verified successfully! You can now reset your password.");
                navigation.navigate("ResetPassword", { email }); // Navigate to reset password screen
            } else {
                setErrors(["Invalid OTP. Please try again."]);
            }
        } catch (error) {
            console.log("Something went wrong: ", error.message);
            setErrors(["Something went wrong! Please try again later."]);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Confirm OTP</Text>
            </View>
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.paragraph}>We have sent a 6-digit OTP to {email}. Please enter it below.</Text>
            <View style={styles.inputView}>
                <Text style={styles.textInputTitle}>OTP</Text>
                <TextInput
                    style={styles.input}
                    placeholder='ENTER OTP'
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType='numeric'
                    maxLength={6} // Limit to 6 digits
                />
                {errors.length > 0 && errors.map((err, idx) => (
                    <Text key={idx} style={styles.requiredText}>{err}</Text>
                ))}
            </View>

            <View style={styles.buttonView}>
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <Pressable
                        style={styles.button}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={handleConfirmOtp}
                    >
                        <Text style={styles.buttonText}>Verify OTP</Text>
                    </Pressable>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};

export default ConfirmOtp;

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
