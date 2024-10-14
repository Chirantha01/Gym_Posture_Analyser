import React, { useEffect , useState , useCallback } from "react";
import { View, Text, SafeAreaView, StyleSheet, Dimensions, ScrollView, TouchableOpacity, ImageBackground } from "react-native";
import Carousel from '../Components/Image-Carousel/ImageCarouselScreen';
import { useNavigation , useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Workout from './Workout'
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const [username , setUsername] = useState("")
  console.log("Home screen loaded...");

  const ScreenWidth = Dimensions.get('window').width;

  const navigation = useNavigation();
  const handleArticlePress = (articleName) => {
    navigation.navigate(articleName);
  };

  useEffect(()=>{
    console.log(username);
  }, [username])

  const fetchHome = async(token) =>{
    const res = await axios.get("http://192.168.1.148:4000/home",{headers:{'authorization': `Bearer ${token}`}});
    const data = res.data;
    console.log(data);
    if (data.userName){
      return data.userName;
    }
    else{
      return null;
    }
  }

  useFocusEffect(
    useCallback(() => {
      const fetchUsername = async () => {
        try {
          const token = await AsyncStorage.getItem("jwtToken");
          if (token) {
            const user = await fetchHome(token);
            if (user) {
              setUsername(user);  // Set the username after fetching
            }
          } else {
            console.log("Token not found.");
          }
        } catch (error) {
          console.log("Error fetching Token", error);
        }
      };

      fetchUsername();  // Fetch username when the screen is focused
    }, []) // Empty dependency array to ensure this runs every time the screen is focused
  );

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <Text style={styles.salutation}>Hi, {username}</Text>
        <Text style={styles.sub_salutation}>It's time to challenge your limits</Text>
        <View>
          <Carousel />

        </View>

        {/* Cube-like Containers for Articles */}
        <View style={styles.articleContainer}>
          <TouchableOpacity style={styles.cube} onPress={() => handleArticlePress('Workout')}>
            <ImageBackground
              source={require('../assets/home_screen/thumb_1.jpg')}  // Replace with your image URL
              style={styles.imageBackground}
              imageStyle={{ borderRadius: 10 }}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
                style={styles.gradient}
              />
              <Text style={styles.cubeText}>Start my Workout</Text>
              <Text style={styles.cubeDiscription}>Workout with posture detection for a better posture</Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cube} onPress={() => handleArticlePress('Article 2')}>
            <ImageBackground
              source={require('../assets/home_screen/thumb_2.jpg')}  // Replace with your image URL
              style={styles.imageBackground}
              imageStyle={{ borderRadius: 10 }}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
                style={styles.gradient}
              />
              <Text style={styles.cubeText}>Check my Stats</Text>
              <Text style={styles.cubeDiscription}>Comprehensive summerization of your progress</Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cube} onPress={() => handleArticlePress('Article 2')}>
            <ImageBackground
              source={require('../assets/home_screen/thumb_3.jpg')}  // Replace with your image URL
              style={styles.imageBackground}
              imageStyle={{ borderRadius: 10 }}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
                style={styles.gradient}
              />
              <Text style={styles.cubeText}>Check my Profile</Text>
              <Text style={styles.cubeDiscription}>Edit your profile details</Text>
            </ImageBackground>
          </TouchableOpacity>

          {/* Add more cubes as needed */}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    backgroundColor: "#232323",
    flex: 1,
  },
  salutation: {
    color: "#896CFE",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 0,
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  sub_salutation: {
    color: "white",
    fontSize: 15,
    fontWeight: "semi-bold",
    marginBottom: 20,
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  articleContainer: {
    flexDirection: 'column',  // Display items vertically
    alignItems: 'center',  // Center align items
    marginTop: 20,
  },
  cube: {
    width: '90%',  // Take up 90% of the screen width
    height: Dimensions.get('window').width * 0.4,  // Aspect ratio to keep it like a 'cube'
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',  // To ensure content stays within cube bounds
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',  // Aligns the title to the bottom
  },
  gradient: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    height: '80%',  // Adjust height for the gradient to cover the bottom half
  },
  cubeText: {
    color: "#E2F163",
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 20,  // Adjust positioning if needed
    marginBottom: 0,
  },
  cubeDiscription : {
    color: "white",
    fontSize: 15,
    fontWeight: '400',
    marginLeft: 20,  // Adjust positioning if needed
    marginRight: 20,
    marginBottom: 15,
  },
});
