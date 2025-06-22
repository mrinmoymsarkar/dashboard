import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StockSearch from '../StockSearch';

// Mock the local debounce hook to return the value immediately for tests
jest.mock('@/hooks/useDebounce', () => (value: any) => value);

// Mock global fetch
global.fetch = jest.fn();

describe('StockSearch', () => {
  const mockOnSymbolSelect = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    (global.fetch as jest.Mock).mockClear();
    mockOnSymbolSelect.mockClear();
  });

  it('renders the input field', () => {
    render(<StockSearch onSymbolSelect={mockOnSymbolSelect} />);
    expect(screen.getByPlaceholderText(/Search for a stock/i)).toBeInTheDocument();
  });

  it('fetches and displays search results when user types a query', async () => {
    const mockResults = {
      data: [{ symbol: 'RELIANCE.NS', longname: 'Reliance Industries' }],
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResults),
    });

    render(<StockSearch onSymbolSelect={mockOnSymbolSelect} />);
    const input = screen.getByPlaceholderText(/Search for a stock/i);

    fireEvent.change(input, { target: { value: 'RELIANCE' } });

    // Check that fetch was called
    expect(global.fetch).toHaveBeenCalledWith('/api/search?q=RELIANCE');

    // Wait for results to appear
    expect(await screen.findByText('Reliance Industries')).toBeInTheDocument();
    expect(screen.getByText('RELIANCE.NS')).toBeInTheDocument();
  });

  it('displays "No results found" for an empty response', async () => {
    const mockResults = { data: [] };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResults),
    });

    render(<StockSearch onSymbolSelect={mockOnSymbolSelect} />);
    const input = screen.getByPlaceholderText(/Search for a stock/i);

    fireEvent.change(input, { target: { value: 'XYZ' } });

    expect(await screen.findByText('No results found.')).toBeInTheDocument();
  });

  it('calls onSymbolSelect and closes dropdown when a result is clicked', async () => {
    const mockResults = {
      data: [{ symbol: 'TCS.NS', longname: 'Tata Consultancy' }],
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResults),
    });

    render(<StockSearch onSymbolSelect={mockOnSymbolSelect} />);
    const input = screen.getByPlaceholderText(/Search for a stock/i);
    fireEvent.change(input, { target: { value: 'TCS' } });

    // Wait for the result and click it
    const resultItem = await screen.findByText('Tata Consultancy');
    fireEvent.click(resultItem);

    // Check that the handler was called
    expect(mockOnSymbolSelect).toHaveBeenCalledWith('TCS.NS');
    expect(mockOnSymbolSelect).toHaveBeenCalledTimes(1);

    // Check that the dropdown is closed (the result text is gone)
    await waitFor(() => {
      expect(screen.queryByText('Tata Consultancy')).not.toBeInTheDocument();
    });
  });
});
