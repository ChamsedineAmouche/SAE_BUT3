import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Pour des matchers Jest supplémentaires
import App from './App';

test('renders the welcome message', () => {
  render(<App />);
  const heading = screen.getByText(/Welcome to My App/i);
  expect(heading).toBeInTheDocument();
});
