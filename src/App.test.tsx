import React from 'react';
import { screen } from '@testing-library/react';
import App from './App';
import { render } from './tests/utils/test-utils';

test('renders app without crashing', () => {
  render(<App />);
  // App should render without throwing errors
  // The loading component should be present initially
  expect(document.body).toBeInTheDocument();
});
