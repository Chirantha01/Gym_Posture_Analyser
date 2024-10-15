import React from 'react';
import renderer from 'react-test-renderer';
import SignUp from '../pages/SignUp'; // Adjust the import path as needed

test('renders correctly', () => {
    const tree = renderer.create(<SignUp />).toJSON();
    expect(tree).toMatchSnapshot();
});