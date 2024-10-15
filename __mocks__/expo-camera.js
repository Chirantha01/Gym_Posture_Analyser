// __mocks__/expo-camera.js
import React from 'react';

export const Camera = jest.fn(({ children }) => <>{children}</>);
export const requestPermissionsAsync = jest.fn().mockResolvedValue({ status: 'granted' });