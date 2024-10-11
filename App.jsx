import React, {useState,useEffect} from 'react';
import { View, Text, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import HomeCard from './Components/Cards';
import Model from './pages/Models/Model_plank';
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
        .then(token => {
          if (token){
            
            console.log("Token found" , token);
            tokenStatus = checkTokenValidity(token);
            if (tokenStatus === true){
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
      
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const checkTokenValidity = async (token) =>{
    console.log("sending a post request to validate the token");
    const res = await axios.post("http://192.168.1.148:4000/validate",{token:token});
    console.log("resonse came for the post request");
    if (res.success === true){
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
          name="Model"
          component={Model} // Plank model component
          options={{ headerTitle: 'Model', headerTitleAlign: 'center' }}
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
    <Tab.Screen name="Camera" component={Model} />
    <Tab.Screen name="Progress" component={Progress} />
    <Tab.Screen name="Profile" component={Profile} />
  </Tab.Navigator>
);
};


export default PoseApp;
