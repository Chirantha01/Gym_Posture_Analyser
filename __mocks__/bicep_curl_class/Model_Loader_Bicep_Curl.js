// __mocks__/bicep_curl_class/Model_Loader_Bicep_Curl.js

const loadModel = jest.fn(() => Promise.resolve());

const predict = jest.fn((inputTensor) => {
  // Mock behavior: Return a simulated prediction
  // For example, a list of probabilities where the maximum is at index 0 (correct_low)
  return Promise.resolve([0.9, 0.05, 0.03, 0.02]); // Simulated model output
});

module.exports = { loadModel, predict };
