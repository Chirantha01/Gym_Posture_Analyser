import React, {useState,useEffect} from 'react';
import { View, Text, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import HomeCard from './Components/Cards';
import Plank_Model from './pages/Models/Model_plank';
import Bicep_Model from './pages/Models/Model_bicep_curl';
import Squat_Model from './pages/Models/Model_squat';
import PushUp_Model from './pages/Models/Model_push_up';
import LatPullDown_Model from './pages/Models/Model_lat_pull_down';
import Profile from "./Components/Profile/Profile"
import Home from './pages/Home';
import Workout from './pages/Workout'
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoadingScreen from './pages/loading';
import Carousel from './Components/Image-Carousel/ImageCarouselScreen';
import Graph from './pages/Graph';
import Progress from './pages/WorkoutHistory';
import LogInForm from './pages/SignIn';
import SignUpScreen from './pages/SignUp';
import axios from "axios";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const PoseApp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated , setIsAuthenticated] = useState(false);
  const [isNewUser , setIsNewUser] = useState(false);

  useEffect(() =>{
    const timer = setTimeout(() => {
      setIsLoading(false);
      AsyncStorage.getItem("jwtToken")
        .then(async (token) => {
          if (token){
            
            console.log("Token found" , token);
            tokenStatus = await checkTokenValidity(token);
            console.log("tokenStatus :  ", tokenStatus)
            if (tokenStatus === true){
              console.log("Already authenticated")
              setIsAuthenticated(true);
              console.log("Token Accepted");
            }
            else{
              console.log("Token Declined...");
            }
          }
          else{
            console.log("Token not Found.");
          }
        })
        .catch(error =>{
          console.log("Error fetching Token" , error);
        });
      
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const checkTokenValidity = async (token) =>{
    console.log("sending a post request to validate the token");
    const res = await axios.post("http://192.168.1.148:4000/startup",{},{headers:{'authorization': `Bearer ${token}`}});
    console.log("resonse came for the post request");
    console.log("response: " , res.data);
    if (res.data.token_Status === true){
      console.log("token success : True");
      return true;
    }
    else{
      console.log("token success : False");
      return false;
    }
  }

  const onSignIn =() =>{

    setIsAuthenticated(true);
  }

  const onSignUp = () =>{
    setIsAuthenticated(true);
  }

  const onSwitchToSignUp = () =>{
    setIsNewUser(true);
  }

  const onSwitchToSignIn = () =>{
    setIsNewUser(false);
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if(!isAuthenticated){
    return isNewUser? (
      <SignUpScreen onSignUp={onSignUp} onSwitchToSignIn={onSwitchToSignIn}/>
    ):(
      <LogInForm onSignIn={onSignIn} onSwitchToSignUp={onSwitchToSignUp}/>
    );
  }

return (
  <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{hearderShown : false }} // Main screen title
        />
        <Stack.Screen
          name="Model_plank"
          component={Plank_Model} // Plank model component
          options={{ headerTitle: 'Plank_Model', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="Model_bicep"
          component={Bicep_Model} // Bicep Curl model component
          options={{ headerTitle: 'Bicep_Model', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="Model_squat"
          component={Squat_Model} // Squat model component
          options={{ headerTitle: 'Squat_Model', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="Model_push_up"
          component={PushUp_Model} // Pushup model component
          options={{ headerTitle: 'Push_Up_Model', headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="Model_lat_pull_down"
          component={LatPullDown_Model} // Lat pull down model component
          options={{ headerTitle: 'Lat_Pull_Down_Model', headerTitleAlign: 'center' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
);
};

const TabNavigator = () => {
return (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === 'Workout') {
          iconName = focused ? 'sports-mma' : 'sports-mma';
        } else if (route.name === 'Progress') {
          iconName = focused ? 'history' : 'history';
        } else if (route.name === 'Camera') {
          iconName = focused ? 'camera-alt' : 'camera-alt';
        }

        return <MaterialIcons name={iconName} size={focused ? 35 : 30} color={color} />;
      },
      tabBarActiveTintColor: 'black',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
      tabBarLabel: () => null,
    })}
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Workout" component={Workout} />
    <Tab.Screen name="Camera" component={Plank_Model} />
    <Tab.Screen name="Progress" component={Progress} />
    <Tab.Screen name="Profile" component={Profile} />
  </Tab.Navigator>
);
};


export default PoseApp;
