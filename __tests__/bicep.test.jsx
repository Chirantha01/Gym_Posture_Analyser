import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Bicep_Model from '../pages/Models/Model_bicep_curl'; // Adjust the import based on your project structure
import PoseDetectionCamera from '../Components/cameraComponent';
import * as tf from '@tensorflow/tfjs';


describe('Bicep_Model Component', () => {
    it('shows loading indicator while the model is loading', () => {
        const { getByText } = render(<Bicep_Model />);
        expect(getByText(/Loading model.../i)).toBeTruthy();
    });

    it('displays correct posture message and counts reps', async () => {
        const { getByText } = render(<Bicep_Model />);
        
        // Wait for the model to load
        await waitFor(() => expect(getByText(/Loading model.../i)).not.toBeTruthy());
        
        // Wait for the simulated detection to call onLandmarksDetected
        await waitFor(() => expect(getByText(/Good Posture/i)).toBeTruthy());

        // Check initial rep count
        expect(getByText(/Reps:/i)).toBeTruthy();
        expect(getByText(/Reps: 0/i)).toBeTruthy();

        // Simulate correct posture detection again for counting reps
        await waitFor(() => {
            fireEvent.changeText(getByText(/Reps:/i), 'correct_low');
        });
        
        // Check if rep count increments
        await waitFor(() => expect(getByText(/Reps: 1/i)).toBeTruthy());
    });

    it('shows incorrect posture message', async () => {
        const { getByText } = render(<Bicep_Model />);
        
        // Wait for the model to load
        await waitFor(() => expect(getByText(/Loading model.../i)).not.toBeTruthy());
        
        // Simulate a call to onLandmarksDetected with incorrect posture
        jest.clearAllMocks();
        jest.spyOn(global.Math, 'random').mockReturnValue(0.2); // Mock random to simulate incorrect pose
        fireEvent.changeText(getByText(/Reps:/i), 'incorrect_forward');
        
        // Check for incorrect posture message
        expect(getByText(/Keep your elbows tucked to torso/i)).toBeTruthy();
    });
});
