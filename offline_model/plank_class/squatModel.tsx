import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

const modelJson = require('./model.json');
const modelWeights = require('./group1-shard1of1.bin');

let model: tf.LayersModel | null = null;

export async function loadModel() {
  await tf.ready();
  if (!model) {
    try {
      console.log('Loading model...');
      model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
      console.log('Model loaded successfully');
    } catch (error) {
      console.error("Error loading model:", error);
      throw new Error("Model loading failed");
    }
  }
  return model;
}

export async function predict(inputTensor) {
  if (!model) {
    throw new Error("Model not loaded yet. Call loadModel() first.");
  }

  const reshapedTensor = inputTensor.reshape([1, 34]); 
  try {
    const prediction = model.predict(reshapedTensor);
    const predictionArray = await prediction.array(); 
    return predictionArray[0]; 
  } catch (error) {
    console.error("Error during prediction:", error);
    throw new Error("Prediction failed");
  }
}
