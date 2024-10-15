// __mocks__/tensorflow.js
const tf = {
    ready: jest.fn(() => Promise.resolve()),
    loadLayersModel: jest.fn(),
    tensor2d: jest.fn(),
    // Mock other TensorFlow methods you use if necessary
  };
  
  module.exports = tf;
  