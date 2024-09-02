import React, { useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Animated, Pressable } from 'react-native';

const HomeCard = () => {
    // Initialize animated value for scaling
    const scaleValue = useRef(new Animated.Value(1)).current;

    // Function to handle press in animation (scaling down)
    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.95, // Slightly reduce the size
            useNativeDriver: true,
        }).start();
    };

    // Function to handle press out animation (scaling up)
    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1, // Return to original size
            useNativeDriver: true,
        }).start();
    };

    // Optional: Function to handle the press event
    const handlePress = () => {
        // Implement what should happen on press
        console.log('Card Pressed');
    };

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
        >
            <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleValue }] }]}>
                <Image style={styles.imageStyle} source={require('./../assets/user.jpg')} />
                <View style={styles.textContainer}>
                    <Text style={styles.textStyle}>Hello, User!</Text>
                </View>
            </Animated.View>
        </Pressable>
    );
};

const deviceWidth = Math.round (Dimensions.get('window').width)

const styles = StyleSheet.create({
    cardContainer : {
        width: deviceWidth-25,
        height: 200,
        backgroundColor: '#a29bfe',
        borderRadius: 20,
        shadowColor:'#000',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.75,
        shadowRadius: 5,
        elevation: 9,
        position: 'relative', // Allows positioning of the text container
        overflow: 'hidden',
    },
    imageStyle : {
        height: 200,
        width: deviceWidth - 25,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    textContainer: {
        position: 'absolute', // Positions the text on top of the image
        top: 50, // Adjust based on where you want the text
        left: 20, // Adjust based on where you want the text
    },
    textStyle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textShadowColor: '#000', // Text shadow color
        textShadowOffset: { width: 2, height: 2 }, // Shadow offset
        textShadowRadius: 3, // Shadow blur radius
    }
});

export default HomeCard;