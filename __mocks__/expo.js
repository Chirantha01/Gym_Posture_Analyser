// __mocks__/expo.js
const mockExpo = {
    Camera: jest.fn(({ children }) => <>{children}</>),
    requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
    // Add additional mock methods for other Expo modules as needed
  };
  
  export default mockExpo;