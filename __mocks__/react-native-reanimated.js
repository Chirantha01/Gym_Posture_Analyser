// __mocks__/react-native-reanimated.js
import React from 'react';

export const View = ({ children }) => <>{children}</>;
export const Text = ({ children }) => <>{children}</>;
export const useSharedValue = jest.fn();
export const useAnimatedScrollHandler = jest.fn();
export const useAnimatedRef = jest.fn();
export const withTiming = jest.fn();
export const Easing = { linear: jest.fn() };
export const interpolate = jest.fn();
// Add other functions or exports as needed
