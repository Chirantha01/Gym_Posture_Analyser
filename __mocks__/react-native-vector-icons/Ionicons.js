// __mocks__/react-native-vector-icons/Ionicons.js
import React from 'react';
import { Text } from 'react-native';

// Mocking Ionicons component
const Icon = (props) => <Text {...props}>{props.name}</Text>;

export default Icon;
