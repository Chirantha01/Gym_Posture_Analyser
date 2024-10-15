// __mocks__/expo-screen-orientation.js
export const lockAsync = jest.fn();
export const unlockAsync = jest.fn();
export const getOrientationAsync = jest.fn().mockResolvedValue('PORTRAIT'); // Return a mock value
export const addOrientationChangeListener = jest.fn();
export const removeOrientationChangeListener = jest.fn();
