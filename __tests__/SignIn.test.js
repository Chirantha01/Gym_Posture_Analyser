import React from 'react';
import renderer from 'react-test-renderer';
import SignIn from '../pages/SignIn'; // Adjust the import path as needed

test('renders correctly', () => {
    const tree = renderer.create(<SignIn />).toJSON();
    expect(tree).toMatchSnapshot();
});