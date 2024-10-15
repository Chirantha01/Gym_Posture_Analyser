import React from 'react';
import { render } from '@testing-library/react-native';
import WorkoutHistory from './../pages/WorkoutHistory'; // Adjust the import path as necessary

describe('WorkoutHistory Component', () => {
  it('matches the snapshot', () => {
    const { toJSON } = render(<WorkoutHistory />);
    expect(toJSON()).toMatchSnapshot();
  });
});