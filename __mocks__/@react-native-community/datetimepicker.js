// __mocks__/@react-native-community/datetimepicker.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const DateTimePicker = ({ value, onChange }) => {
  return (
    <View>
      <Text>{value ? value.toString() : 'No date selected'}</Text>
      <Button title="Change Date" onPress={() => onChange(null, new Date())} />
    </View>
  );
};

export default DateTimePicker;