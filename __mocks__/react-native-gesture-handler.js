// __mocks__/react-native-gesture-handler.js
export const State = {
    UNDETERMINED: 0,
    BEGAN: 1,
    ACTIVE: 2,
    END: 3,
    FAILED: 4,
    CANCELED: 5,
  };
  
  export const PanGestureHandler = jest.fn(({ children }) => children);
  export const TapGestureHandler = jest.fn(({ children }) => children);
  export const FlingGestureHandler = jest.fn(({ children }) => children);
  export const LongPressGestureHandler = jest.fn(({ children }) => children);
  export const ScrollView = jest.fn(({ children }) => children);
  