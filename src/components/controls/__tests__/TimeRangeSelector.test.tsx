import { render, screen, fireEvent } from '@testing-library/react';
import TimeRangeSelector from '../TimeRangeSelector';

describe('TimeRangeSelector', () => {
  const ranges = ['1mo', '6mo', '1y', '5y'];
  const mockOnSelectRange = jest.fn();

  beforeEach(() => {
    // Reset the mock function before each test
    mockOnSelectRange.mockClear();
  });

  it('renders all time range buttons', () => {
    render(<TimeRangeSelector selectedRange="1mo" onSelectRange={mockOnSelectRange} />);
    ranges.forEach(range => {
      // The component fully uppercases the display text
      const buttonText = range.toUpperCase();
      expect(screen.getByRole('button', { name: buttonText })).toBeInTheDocument();
    });
  });

  it('highlights the currently selected range', () => {
    const selectedRange = '1y';
    render(<TimeRangeSelector selectedRange={selectedRange} onSelectRange={mockOnSelectRange} />);

    const selectedButton = screen.getByRole('button', { name: '1Y' });
    // Check for the classes that indicate an active state
    expect(selectedButton).toHaveClass('bg-card text-foreground');
  });

  it('does not apply active styles to unselected ranges', () => {
    const selectedRange = '1y';
    render(<TimeRangeSelector selectedRange={selectedRange} onSelectRange={mockOnSelectRange} />);

    const unselectedButton = screen.getByRole('button', { name: '6MO' });
    expect(unselectedButton).not.toHaveClass('bg-card text-foreground');
    expect(unselectedButton).toHaveClass('text-muted-foreground hover:bg-muted');
  });

  it('calls onSelectRange with the correct value when a button is clicked', () => {
    render(<TimeRangeSelector selectedRange="1mo" onSelectRange={mockOnSelectRange} />);

    const sixMonthButton = screen.getByRole('button', { name: '6MO' });
    fireEvent.click(sixMonthButton);

    expect(mockOnSelectRange).toHaveBeenCalledWith('6mo');
    expect(mockOnSelectRange).toHaveBeenCalledTimes(1);
  });
});
