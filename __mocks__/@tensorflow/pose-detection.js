// __mocks__/@tensorflow-models/pose-detection.js
export const createDetector = jest.fn().mockResolvedValue({
    estimatePoses: jest.fn().mockResolvedValue([]), // Return an empty array of poses as a mock
  });
  