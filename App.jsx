import React, {useState,useEffect} from 'react';
import { View, Text, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import Model from './pages/Model';
import Profile from "./Components/Profile/Profile"
import Home from './pages/Home';
import Workout from './pages/Workout'
import { NavigationContainer } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoadingScreen from './pages/loading';
import Carousel from './Components/Image-Carousel/ImageCarouselScreen';
import Graph from './pages/Graph';
import Progress from './pages/WorkoutHistory';

const Tab = createBottomTabNavigator();

const PoseApp = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() =>{
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return(
    <NavigationContainer>
      <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon:({focused , color , size}) => {
          let iconName;

          if (route.name=== 'Home'){iconName = focused ? 'home' : 'home';}
          else if(route.name === 'Profile'){iconName = focused ? 'person' : 'person-outline';}
          else if(route.name === 'Workout'){iconName = focused ? 'sports-mma' : 'sports-mma';}
          else if(route.name === 'Progress'){iconName = focused ? 'history' : 'history';}
          else if(route.name === 'Camera'){iconName = focused ? 'camera-alt' : 'camera-alt';}

          return <MaterialIcons name={iconName} size = {focused ? 35 : 30} color = {color}/>;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarLabel: () => null,
      })}
      >
        <Tab.Screen name='Home' component={Home}/>
        <Tab.Screen name='Workout' component={Workout}/>
        <Tab.Screen name='Camera' component={Model}/>
        <Tab.Screen name='Progress' component={Progress}/>
        <Tab.Screen name='Profile' component={Profile}/>

      </Tab.Navigator>
    </NavigationContainer>
  );
};


export default PoseApp;
