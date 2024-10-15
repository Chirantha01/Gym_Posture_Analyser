module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    transformIgnorePatterns: [
      'node_modules/(?!(@react-native|@react-native-community|expo-image-picker|react-native-gifted-charts)/)',
    ],
    transform: {
      '^.+\\.[jt]sx?$': 'babel-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
      '^expo-image-picker$': '<rootDir>/__mocks__/expo-image-picker.js',
      // Add other mocks as necessary
    },
  };
  