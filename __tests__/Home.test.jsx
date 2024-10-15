// Home.test.jsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../pages/Home'; // Adjust the import based on your project structure

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

test('renders Home correctly', () => {
    const { getByText, toJSON } = renderWithNavigation(<Home />);

    // Check if the welcome message is rendered
    expect(getByText(/Hi, User/i)).toBeTruthy();
    expect(getByText(/It's time to challenge your limits/i)).toBeTruthy();
    expect(getByText(/Start my Workout/i)).toBeTruthy();

    // Snapshot testing
    expect(toJSON()).toMatchSnapshot();
});

test('navigates to Workout on article press', () => {
    const { getByText } = renderWithNavigation(<Home />);
    
    // Simulate pressing the "Start my Workout" button
    const workoutButton = getByText(/Start my Workout/i);
    fireEvent.press(workoutButton);
    
    // Check if the navigation function was called
    expect(mockNavigate).toHaveBeenCalledWith('Workout'); // Ensure navigate was called with the correct argument
});
