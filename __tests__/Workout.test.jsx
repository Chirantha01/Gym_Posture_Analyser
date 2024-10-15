// Workout.test.jsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Workout from '../pages/Workout'; // Adjust the import based on your project structure

// Mock the useNavigation hook
const mockNavigate = jest.fn(); // Create a mock function for navigation

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        navigate: mockNavigate, // Return the mock function
    }),
}));

const renderWithNavigation = (component) => {
    return render(
        <NavigationContainer>
            {component}
        </NavigationContainer>
    );
};

test('renders Workout correctly', () => {
    const { getByText, getByPlaceholderText } = renderWithNavigation(<Workout />);

    // Check if the initial texts are rendered
    expect(getByText(/Select your workout,/i)).toBeTruthy();
    expect(getByText(/We will help you correct your posture.../i)).toBeTruthy();

    // Check if the search input is rendered
    const searchInput = getByPlaceholderText(/Search Workouts.../i);
    expect(searchInput).toBeTruthy();
});

test('searches for workouts correctly', () => {
    const { getByPlaceholderText, getByText, queryByText } = renderWithNavigation(<Workout />);

    const searchInput = getByPlaceholderText(/Search Workouts.../i);

    // Check if all workouts are initially displayed
    expect(getByText(/Bicep Curls/i)).toBeTruthy(); // Check if Bicep Curls is rendered
    expect(getByText(/Squats/i)).toBeTruthy(); // Check if Squats is rendered

    // Search for 'Squats'
    fireEvent.changeText(searchInput, 'Squats');

    // Check if the filtered workout appears
    expect(getByText(/Squats/i)).toBeTruthy(); // Squats should still be visible
    expect(queryByText(/Bicep Curls/i)).toBeNull(); // Bicep Curls should not be displayed

    // Clear the search
    fireEvent.changeText(searchInput, '');

    // Check if all workouts are displayed again
    expect(getByText(/Bicep Curls/i)).toBeTruthy(); // Ensure Bicep Curls is visible again
    expect(getByText(/Squats/i)).toBeTruthy(); // Ensure Squats is still visible
});

test('navigates to workout detail on card press', () => {
    const { getByText } = renderWithNavigation(<Workout />);
    
    // Simulate pressing the "Bicep Curls" workout card
    const bicepCard = getByText(/Bicep Curls/i);
    fireEvent.press(bicepCard);
    
    // Check if the navigation function was called
    expect(mockNavigate).toHaveBeenCalledWith('Model_bicep'); // Ensure navigate was called with the correct argument
});

test('matches snapshot', () => {
    const { toJSON } = renderWithNavigation(<Workout />);
    expect(toJSON()).toMatchSnapshot(); // Snapshot testing
});
