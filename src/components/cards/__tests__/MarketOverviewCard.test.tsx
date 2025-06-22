import { render, screen, fireEvent } from '@testing-library/react';
import MarketOverviewCard from '../MarketOverviewCard';

describe('MarketOverviewCard', () => {
  const mockProps = {
    symbol: 'TCS.NS',
    price: 3500.75,
    change: 1.25,
    onClick: jest.fn(),
  };

  it('renders the stock information correctly', () => {
    render(<MarketOverviewCard {...mockProps} />);

    // Check if the symbol, price, and change are displayed
    expect(screen.getByText('TCS.NS')).toBeInTheDocument();
    // Use a regex to find the price, ignoring fragmentation and locale differences
    expect(screen.getByText(/3500.75/)).toBeInTheDocument();
    // Check for the percentage value, ignoring the '+' sign which is an icon
    expect(screen.getByText(/1.25%/)).toBeInTheDocument();
  });

  it('calls the onClick handler with the correct symbol when clicked', () => {
    render(<MarketOverviewCard {...mockProps} />);

    // Simulate a click on the card
    fireEvent.click(screen.getByText('TCS.NS'));

    // Check if the onClick handler was called with the correct symbol
    expect(mockProps.onClick).toHaveBeenCalledWith('TCS.NS');
    expect(mockProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('displays a negative change with the correct color and format', () => {
    const negativeChangeProps = { ...mockProps, change: -0.5 };
    render(<MarketOverviewCard {...negativeChangeProps} />);

    // Find the element by its text content
    const changeElement = screen.getByText(/-0.50%/);
    expect(changeElement).toBeInTheDocument();
    // The color class is on the span that holds the icon and text
    expect(changeElement).toHaveClass('text-red-600');
  });

  it('displays a positive change with the correct color and format', () => {
    render(<MarketOverviewCard {...mockProps} />);

    // Find the element by its text content, ignoring the '+' which is an icon
    const changeElement = screen.getByText(/1.25%/);
    expect(changeElement).toBeInTheDocument();
    // The color class is on the span that holds the icon and text
    expect(changeElement).toHaveClass('text-green-600');
  });
});
