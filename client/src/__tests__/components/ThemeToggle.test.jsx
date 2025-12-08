import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';

describe('ThemeToggle Component', () => {
  it('should render theme toggle button', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  it('should toggle theme when clicked', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const toggleButton = screen.getByRole('button');
    const initialIcon = screen.getByText(/🌙|☀️/);

    fireEvent.click(toggleButton);

    // Theme should change
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('should display correct icon based on theme', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const toggleButton = screen.getByRole('button');
    
    // Initially light mode, should show moon icon
    expect(screen.getByText('🌙')).toBeInTheDocument();

    fireEvent.click(toggleButton);

    // After toggle, should show sun icon
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });
});

