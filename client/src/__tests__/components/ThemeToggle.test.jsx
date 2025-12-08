import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure consistent starting state
    localStorage.clear();
  });

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

  it('should display correct icon based on theme', async () => {
    // Ensure we start with light theme
    localStorage.setItem('theme', 'light');
    
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const toggleButton = screen.getByRole('button');
    
    // Initially light mode, should show moon icon (to switch to dark)
    expect(screen.getByText('🌙')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();

    fireEvent.click(toggleButton);

    // Wait for state update after toggle to dark mode
    await waitFor(() => {
      expect(screen.getByText('☀️')).toBeInTheDocument();
      expect(screen.getByText('Light')).toBeInTheDocument();
    });
  });
});

