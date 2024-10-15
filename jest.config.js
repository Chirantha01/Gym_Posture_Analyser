module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@testing-library|@expo|vector-icons|react-native-gifted-charts|@react-native-community|expo-image-picker)/)',
  ],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest', // Transform JavaScript/JSX/TS/TSX using Babel
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    // '^expo-camera$': '<rootDir>/__mocks__/expo-camera.js',
    '^expo-screen-orientation$': '<rootDir>/__mocks__/expo-screen-orientation.js',
    '^expo-linear-gradient$': '<rootDir>/__mocks__/expo-linear-gradient.js',
    '^expo-font$': '<rootDir>/__mocks__/expo-font.js',
    '^@tensorflow/(.*)$': '<rootDir>/__mocks__/@tensorflow/$1.js',
    '^@tensorflow/tfjs-react-native$': '<rootDir>/__mocks__/@tensorflow/tfjs-react-native.js',
    '^@tensorflow/tfjs$': '<rootDir>/__mocks__/tensorflow.js',
    '^tensorflow/tfjs-react-native$': '<rootDir>/__mocks__/tensorflow.js',
    '^@tensorflow-models/(.*)$': '<rootDir>/__mocks__/@tensorflow-models/$1.js',
    '^react-native-vector-icons/(.*)$': '<rootDir>/__mocks__/react-native-vector-icons/$1.js',
    '^react-native-vector-icons/(.*)$': '<rootDir>/__mocks__/react-native-vector-icons/$1.js',
    '^@tensorflow-models/(.*)$': '<rootDir>/__mocks__/@tensorflow/$1.js',
    '\\.(bin)$': '<rootDir>/__mocks__/plank_weights.bin.js',
    '^react-native-reanimated$': '<rootDir>/__mocks__/react-native-reanimated.js',
    '^@react-native-async-storage/async-storage$': '<rootDir>/__mocks__/@react-native-async-storage/async-storage.js',
    '^react-native-gesture-handler$': '<rootDir>/__mocks__/react-native-gesture-handler.js', // Mock for gesture handler
    '^react-native-gifted-charts$': '<rootDir>/__mocks__/react-native-gifted-charts.js',
    '^react-native-vector-icons/Ionicons$': '<rootDir>/__mocks__/react-native-vector-icons/Ionicons.js',
    '\\.(ttf|otf)$': '<rootDir>/__mocks__/fileMock.js', 
    '^@react-native-community/datetimepicker$': '<rootDir>/__mocks__/@react-native-community/datetimepicker.js',
    '^expo-image-picker$': '<rootDir>/__mocks__/expo-image-picker.js',
    'react-native-vector-icons/(.*)': '<rootDir>/__mocks__/react-native-vector-icons.js',
    '^../../offline_model/bicep_curl_class/Model_Loader_Bicep_Curl$': '<rootDir>/__mocks__/bicep_curl_class/Model_Loader_Bicep_Curl.js',
  },
};
