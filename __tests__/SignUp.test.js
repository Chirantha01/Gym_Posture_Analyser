import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SignUpScreen from '../pages/SignUp'; // Update the path accordingly

describe('SignUpScreen UI Tests', () => {
  const onSignUpMock = jest.fn();
  const onSwitchToSignInMock = jest.fn();
  const onGoBackMock = jest.fn();

  test('renders SignUpScreen correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <SignUpScreen 
        onSignUp={onSignUpMock}
        onSwitchToSignIn={onSwitchToSignInMock}
        onGoBack={onGoBackMock}
      />
    );

    expect(getByText("Create Account")).toBeTruthy();
    expect(getByText("Let's Start !")).toBeTruthy();
    expect(getByPlaceholderText('USERNAME')).toBeTruthy();
    expect(getByPlaceholderText('E-MAIL')).toBeTruthy();
    expect(getByPlaceholderText('PASSWORD')).toBeTruthy();
    expect(getByPlaceholderText('BIRTH DAY')).toBeTruthy();
    expect(getByPlaceholderText('HEIGHT')).toBeTruthy();
    expect(getByPlaceholderText('WEIGHT')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });

  test('navigates back when back button is pressed', () => {
    const { getByText } = render(
      <SignUpScreen 
        onSignUp={onSignUpMock}
        onSwitchToSignIn={onSwitchToSignInMock}
        onGoBack={onGoBackMock}
      />
    );

    fireEvent.press(getByText('Create Account')); // Adjust if back button has a different text or element
    expect(onGoBackMock).toHaveBeenCalledTimes(1);
  });

  test('displays date picker when focusing on birth day input', () => {
    const { getByPlaceholderText, queryByTestId } = render(
      <SignUpScreen 
        onSignUp={onSignUpMock}
        onSwitchToSignIn={onSwitchToSignInMock}
        onGoBack={onGoBackMock}
      />
    );

    const birthDayInput = getByPlaceholderText('BIRTH DAY');
    
    // Simulate the focus event
    fireEvent(birthDayInput, 'focus'); // Use the event directly

    // Assuming you have a way to show the date picker, check for its visibility
    // If you have added a testID to the DateTimePicker component, check its presence
    expect(queryByTestId('date-picker')).toBeTruthy(); // Assuming you set a testID on the DateTimePicker
  });

  test('button scales on press', () => {
    const { getByText } = render(
      <SignUpScreen 
        onSignUp={onSignUpMock}
        onSwitchToSignIn={onSwitchToSignInMock}
        onGoBack={onGoBackMock}
      />
    );

    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);

    // Here you might need to check the scaling, if the state changes
    // This is a placeholder example; adapt it to your actual animation testing
    describe('SignUpScreen UI Tests', () => {
        const onSignUpMock = jest.fn();
        const onSwitchToSignInMock = jest.fn();
        const onGoBackMock = jest.fn();

        test('renders SignUpScreen correctly', () => {
            const { getByText, getByPlaceholderText } = render(
                <SignUpScreen 
                    onSignUp={onSignUpMock}
                    onSwitchToSignIn={onSwitchToSignInMock}
                    onGoBack={onGoBackMock}
                />
            );

            expect(getByText("Create Account")).toBeTruthy();
            expect(getByText("Let's Start !")).toBeTruthy();
            expect(getByPlaceholderText('USERNAME')).toBeTruthy();
            expect(getByPlaceholderText('E-MAIL')).toBeTruthy();
            expect(getByPlaceholderText('PASSWORD')).toBeTruthy();
            expect(getByPlaceholderText('BIRTH DAY')).toBeTruthy();
            expect(getByPlaceholderText('HEIGHT')).toBeTruthy();
            expect(getByPlaceholderText('WEIGHT')).toBeTruthy();
            expect(getByText('Sign Up')).toBeTruthy();
        });

        test('navigates back when back button is pressed', () => {
            const { getByText } = render(
                <SignUpScreen 
                    onSignUp={onSignUpMock}
                    onSwitchToSignIn={onSwitchToSignInMock}
                    onGoBack={onGoBackMock}
                />
            );

            fireEvent.press(getByText('Create Account')); // Adjust if back button has a different text or element
            expect(onGoBackMock).toHaveBeenCalledTimes(1);
        });

        test('displays date picker when focusing on birth day input', () => {
            const { getByPlaceholderText, queryByTestId } = render(
                <SignUpScreen 
                    onSignUp={onSignUpMock}
                    onSwitchToSignIn={onSwitchToSignInMock}
                    onGoBack={onGoBackMock}
                />
            );

            const birthDayInput = getByPlaceholderText('BIRTH DAY');
            
            // Simulate the focus event
            fireEvent(birthDayInput, 'focus'); // Use the event directly

            // Assuming you have a way to show the date picker, check for its visibility
            // If you have added a testID to the DateTimePicker component, check its presence
            expect(queryByTestId('date-picker')).toBeTruthy(); // Assuming you set a testID on the DateTimePicker
        });

        test('button scales on press', () => {
            const { getByText } = render(
                <SignUpScreen 
                    onSignUp={onSignUpMock}
                    onSwitchToSignIn={onSwitchToSignInMock}
                    onGoBack={onGoBackMock}
                />
            );

            const signUpButton = getByText('Sign Up');
            fireEvent.press(signUpButton);

            // Here you might need to check the scaling, if the state changes
            // This is a placeholder example; adapt it to your actual animation testing
            expect(signUpButton).toHaveStyle({ transform: [{ scale: 0.95 }] }); // Example of checking scale
        });

        test('calls onSignUp when sign up button is pressed', () => {
            const { getByText, getByPlaceholderText } = render(
                <SignUpScreen 
                    onSignUp={onSignUpMock}
                    onSwitchToSignIn={onSwitchToSignInMock}
                    onGoBack={onGoBackMock}
                />
            );

            fireEvent.changeText(getByPlaceholderText('USERNAME'), 'testuser');
            fireEvent.changeText(getByPlaceholderText('E-MAIL'), 'test@example.com');
            fireEvent.changeText(getByPlaceholderText('PASSWORD'), 'password123');
            fireEvent.changeText(getByPlaceholderText('BIRTH DAY'), '01/01/2000');
            fireEvent.changeText(getByPlaceholderText('HEIGHT'), '180');
            fireEvent.changeText(getByPlaceholderText('WEIGHT'), '75');

            fireEvent.press(getByText('Sign Up'));
            expect(onSignUpMock).toHaveBeenCalledTimes(1);
        });

        test('switches to sign in screen when sign in button is pressed', () => {
            const { getByText } = render(
                <SignUpScreen 
                    onSignUp={onSignUpMock}
                    onSwitchToSignIn={onSwitchToSignInMock}
                    onGoBack={onGoBackMock}
                />
            );

            fireEvent.press(getByText('Already have an account? Sign In'));
            expect(onSwitchToSignInMock).toHaveBeenCalledTimes(1);
        });

        test('displays error message when required fields are empty', () => {
            const { getByText } = render(
                <SignUpScreen 
                    onSignUp={onSignUpMock}
                    onSwitchToSignIn={onSwitchToSignInMock}
                    onGoBack={onGoBackMock}
                />
            );

            fireEvent.press(getByText('Sign Up'));
            expect(getByText('All fields are required')).toBeTruthy();
        });
    });
    });
    }
    );
