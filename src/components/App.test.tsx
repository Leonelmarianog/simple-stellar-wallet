import { render, screen } from '@testing-library/react';
import App from './App';

test('renders test message', () => {
  render(<App />);
  const testMessage = screen.getByText(/Hello World/i);
  expect(testMessage).toBeInTheDocument();
});
