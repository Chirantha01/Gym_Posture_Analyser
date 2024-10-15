import React, {useState,useEffect} from 'react';
import Plank_Model from './../pages/Models/Model_plank';
import Bicep_Model from './../pages/Models/Model_bicep_curl';
import Squat_Model from './../pages/Models/Model_squat';
import PushUp_Model from './../pages/Models/Model_push_up';
import LatPullDown_Model from './../pages/Models/Model_lat_pull_down';
import Profile from "./../Components/Profile/Profile"
import Home from './../pages/Home';
import Workout from './../pages/Workout'
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoadingScreen from './../pages/loading';
import Progress from './../pages/WorkoutHistory';
import LogInForm from './../pages/SignIn';
import SignUpScreen from './../pages/SignUp';
import axios from "axios";
import { Camera } from 'expo-camera';
import { render } from '@testing-library/react-native';
import App from '../App';

test('renders correctly', () => {
  const { toJSON } = render(<App />);
  expect(toJSON()).toMatchSnapshot();
});