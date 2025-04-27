import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Necessário para testar componentes com react-router-dom
import App from './App';

test('renders Driver Login title', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  const titleElement = screen.getByText(/Driver Login/i);
  expect(titleElement).toBeInTheDocument();
});