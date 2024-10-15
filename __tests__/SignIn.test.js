import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginForm from '../pages/SignIn';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

describe('LoginForm', () => {
  const mockOnSignIn = jest.fn();
  const mockOnSwitchToSignUp = jest.fn();
  const mockOnGoBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginForm onSignIn={mockOnSignIn} onSwitchToSignUp={mockOnSwitchToSignUp} onGoBack={mockOnGoBack} />
    );

    expect(getByText(/Log in/i)).toBeTruthy();
    expect(getByText(/Welcome/i)).toBeTruthy();
    expect(getByPlaceholderText(/EMAIL OR USERNAME/i)).toBeTruthy();
    expect(getByPlaceholderText(/PASSWORD/i)).toBeTruthy();
    expect(getByText(/Forgot Password?/i)).toBeTruthy();
  });

  it('updates username and password fields on input change', () => {
    const { getByPlaceholderText } = render(
      <LoginForm onSignIn={mockOnSignIn} onSwitchToSignUp={mockOnSwitchToSignUp} onGoBack={mockOnGoBack} />
    );

    const usernameInput = getByPlaceholderText(/EMAIL OR USERNAME/i);
    const passwordInput = getByPlaceholderText(/PASSWORD/i);

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password123');

    expect(usernameInput.props.value).toBe('testuser');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('displays backend validation errors when form submission fails', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          errors: [
            { field: 'usernameOrEmail', message: 'Username is required' },
            { field: 'password', message: 'Password is required' },
          ],
        },
      },
    });

    const { getByText, getByPlaceholderText, getByRole } = render(
      <LoginForm onSignIn={mockOnSignIn} onSwitchToSignUp={mockOnSwitchToSignUp} onGoBack={mockOnGoBack} />
    );

    const usernameInput = getByPlaceholderText(/EMAIL OR USERNAME/i);
    const passwordInput = getByPlaceholderText(/PASSWORD/i);
    const loginButton = getByRole('button', { name: /Log In/i });

    fireEvent.changeText(usernameInput, '');
    fireEvent.changeText(passwordInput, '');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('Username is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  it('submits form and saves token to AsyncStorage on success', async () => {
    axios.post.mockResolvedValueOnce({
      data: { token: 'mockToken123' },
    });

    const { getByText, getByPlaceholderText, getByRole } = render(
      <LoginForm onSignIn={mockOnSignIn} onSwitchToSignUp={mockOnSwitchToSignUp} onGoBack={mockOnGoBack} />
    );

    const usernameInput = getByPlaceholderText(/EMAIL OR USERNAME/i);
    const passwordInput = getByPlaceholderText(/PASSWORD/i);
    const loginButton = getByRole('button', { name: /Log In/i });

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('jwtToken', 'mockToken123');
      expect(mockOnSignIn).toHaveBeenCalled();
    });
  });

  test('triggers animation on button press', () => {
    const { getByRole } = render(<LoginForm />);
    
    const loginButton = getByRole('button', { name: /Log In/i });

    // Simulate a press on the button
    fireEvent.press(loginButton);

    // Here you can add assertions related to your animation if necessary
    // For example, if you have state to track animation, you could check that state here
    // You might need to mock or spy on your animation logic as well
    });
});
