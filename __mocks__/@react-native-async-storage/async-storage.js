// __mocks__/@react-native-async-storage/async-storage.js
const AsyncStorageMock = {
    setItem: jest.fn((key, value) => Promise.resolve()),
    getItem: jest.fn((key) => Promise.resolve(null)), // You can change the return value for testing
    removeItem: jest.fn((key) => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
    multiSet: jest.fn((keyValuePairs) => Promise.resolve()),
    multiGet: jest.fn((keys) => Promise.resolve(keys.map(key => [key, null]))), // Mocking multiGet to return null values
    multiRemove: jest.fn((keys) => Promise.resolve()),
};

export default AsyncStorageMock;
