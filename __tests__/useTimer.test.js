// useTimer.test.js
import React from 'react';
import { render, act } from '@testing-library/react-native';
import useTimer from './../pages/testComponents/useTimer';
import { Text } from 'react-native';

const TestComponent = ({ isActive }) => {
    const time = useTimer(isActive);
    return <Text>{time}</Text>;
};

describe('useTimer', () => {
    beforeEach(() => {
        jest.useFakeTimers(); // Activate fake timers before each test
    });

    afterEach(() => {
        jest.clearAllTimers(); // Clear all timers after each test to avoid cross-test interference
    });

    it('should start the timer when active', () => {
        const { getByText } = render(<TestComponent isActive={true} />);

        act(() => {
            // Advance time by 1 second
            jest.advanceTimersByTime(1000);
        });
        expect(getByText('1')).toBeTruthy(); // Check if time is 1s

        act(() => {
            // Advance time by 3 more seconds
            jest.advanceTimersByTime(3000);
        });
        expect(getByText('4')).toBeTruthy(); // Check if time is 4s
    }, 10000); // Increased timeout

    it('should stop the timer when inactive', () => {
        const { getByText, rerender } = render(<TestComponent isActive={true} />);

        act(() => {
            // Advance time by 2 seconds
            jest.advanceTimersByTime(2000);
        });
        expect(getByText('2')).toBeTruthy(); // Check if time is 2s

        // Rerender with isActive set to false to stop the timer
        rerender(<TestComponent isActive={false} />);

        act(() => {
            // Advance time by 3 more seconds (but the timer should have stopped)
            jest.advanceTimersByTime(3000);
        });
        expect(getByText('2')).toBeTruthy(); // Should remain 2s since the timer is stopped
    }, 10000); // Increased timeout
});