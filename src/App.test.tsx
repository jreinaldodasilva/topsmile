import React from 'react';
import { screen } from '@testing-library/react';
import App from './App';
import { render } from './tests/utils/test-utils';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Loading.../i);
  expect(linkElement).toBeInTheDocument();
});
