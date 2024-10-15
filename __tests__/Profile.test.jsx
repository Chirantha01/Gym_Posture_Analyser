import React from 'react';
import { render } from '@testing-library/react-native';
import Profile from './../Components/Profile/Profile'; // Adjust the import path as necessary

describe('Profile Component', () => {
  it('matches the snapshot', () => {
    const { toJSON } = render(<Profile />);
    expect(toJSON()).toMatchSnapshot();
  });
});