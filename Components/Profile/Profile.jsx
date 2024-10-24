import { StyleSheet, Text, View, Image, ScrollView, Pressable, Animated , Alert} from "react-native";
import React, { useRef } from "react";
import ImagePlaceholder from '../../assets/image-placeholder.jpg';

export default function Profile({onLogOut}) {
  const name = "John Doe";
  const email = "johnDoe@email.com";
  const birthDay = "01/01/2001";
  const age = 20;
  const height = 180;
  const weight = 70;


  // Refs for each setting animation
  const editProfileScale = useRef(new Animated.Value(1)).current;
  const changePasswordScale = useRef(new Animated.Value(1)).current;
  const logoutScale = useRef(new Animated.Value(1)).current;

  // Function to handle animations
  const animatePressIn = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 0.95, // Shrink to 95% of original size
      useNativeDriver: true,
    }).start();
  };

  const animatePressOut = (scaleValue) => {
    Animated.spring(scaleValue, {
      toValue: 1, // Return to original size
      friction: 3, // Control the bounce effect
      useNativeDriver: true,
    }).start();
  };

  
  const handleLogoutPress = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout Cancelled"),
          style: "cancel",
        },
        {
          text: "Yes, Log Out",
          onPress: () => {onLogOut()}, // This will trigger your logout logic
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image source={ImagePlaceholder} style={styles.profileImage} />
        </View>
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.birthdayTitle}>
            Birthday: <Text style={styles.birthdayText}>{birthDay}</Text>
          </Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Weight</Text>
          <Text style={styles.infoText}>{weight} kg</Text>
        </View>

        {/* Vertical line */}
        <View style={styles.verticalLine} />
        
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Age</Text>
          <Text style={styles.infoText}>{age}</Text>
        </View>
        
        {/* Vertical line */}
        <View style={styles.verticalLine} />
        
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Height</Text>
          <Text style={styles.infoText}>{height} cm</Text>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        {/* Pressable Setting Options with animation */}
        <AnimatedPressable
          scaleValue={editProfileScale}
          onPress={() => console.log("Edit Profile Pressed")}
          iconSource={require("../../assets/profileIcons/Component_39.png")}
          text="Edit my Profile"
        />

        <AnimatedPressable
          scaleValue={changePasswordScale}
          onPress={() => console.log("Change Password Pressed")}
          iconSource={require("../../assets/profileIcons/Component_41.png")}
          text="Change my Password"
        />

        <AnimatedPressable
          scaleValue={logoutScale}
          onPress={handleLogoutPress}
          iconSource={require("../../assets/profileIcons/Component_44.png")}
          text="Logout"
        />
      </View>
    </ScrollView>
  );
}

// Custom component for Animated Pressable
const AnimatedPressable = ({ scaleValue, onPress, iconSource, text }) => {
  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Pressable
        onPressIn={() => animatePressIn(scaleValue)}
        onPressOut={() => animatePressOut(scaleValue)}
        onPress={onPress}
        style={styles.settings}
      >
        <Image source={iconSource} style={styles.profileIcon} />
        <Text style={styles.settingText}>{text}</Text>
      </Pressable>
    </Animated.View>
  );
};

// Functions for animation (Move these outside of the Profile function)
const animatePressIn = (scaleValue) => {
  Animated.spring(scaleValue, {
    toValue: 0.95,
    useNativeDriver: true,
  }).start();
};

const animatePressOut = (scaleValue) => {
  Animated.spring(scaleValue, {
    toValue: 1,
    friction: 3,
    useNativeDriver: true,
  }).start();
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#232323",
  },
  topContainer: {
    backgroundColor: "#B3A0ff",
    height: 320,
    flex: 1,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 50,
    position: "relative",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "left",
    color: "white",
    flex: 1,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
  },
  profileImage: {
    width: 125,
    height: 125,
    borderRadius: 100,
  },
  name: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  email: {
    fontSize: 15,
    textAlign: "center",
    color: "white",
  },
  birthdayTitle: {
    fontSize: 15,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  birthdayText: {
    fontSize: 15,
    textAlign: "center",
    color: "white",
    fontWeight: "normal",
  },
  infoContainer: {
    marginTop: -30,
    backgroundColor: "#896CFE",
    height: 60,
    width: "60%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  infoBlock: {
    flexDirection: "column",  // Stack label and value vertically
    alignItems: "center",  // Center the label and value horizontally
    paddingHorizontal: 20,
  },
  infoLabel: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  infoText: {
    color: "white",
    fontSize: 12,
    marginTop: 4, // Space between the label and number
  },
  verticalLine: {
    height: "70%",  // Adjust the height to suit your design
    width: 1,
    backgroundColor: "white",  // Line color
  },
  bottomContainer: {
    marginTop: 20,
  },
  settings: {
    flexDirection: "row",
    paddingLeft: 20,
    paddingTop: 20,
    alignItems: "center",
  },
  profileIcon: {
    width: 30,
    height: 30,
  },
  settingText: {
    paddingTop: 7,
    fontSize: 18,
    fontWeight: "400",
    color: "white",
    paddingLeft: 20,
  },
});
