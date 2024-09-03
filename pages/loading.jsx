import React from 'react';
import { View, Text, Dimensions, ActivityIndicator, StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Ensures the image covers the whole background
    },
    indicator: {
        position: 'absolute',
        top: '50%', // Adjust to position below the text
    },
});

const LoadingScreen = () => {
    return (
        <View style={styles.loadingContainer}>
            <Image
                source={require('./../assets/Loading_Screen/loading.jpg')} // Replace with your image path
                style={styles.backgroundImage}
            />
            <ActivityIndicator size="large" color="#0000ff" style={styles.indicator} />
        </View>
    );
};

export default LoadingScreen;
