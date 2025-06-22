import { renderHook, act, waitFor } from '@testing-library/react';
import useWebSocket from '../useWebSocket';
import WS from 'jest-websocket-mock';
import { WSMessage } from '@/types';

const TEST_URL = 'ws://localhost:4000';

describe('useWebSocket', () => {
  let server: WS;

  beforeEach(() => {
    server = new WS(TEST_URL);
  });

  afterEach(() => {
    WS.clean();
  });

  it('should establish a connection and receive correctly structured messages', async () => {
    const mockOnMessage = jest.fn();
    renderHook(() => useWebSocket(TEST_URL, { onMessage: mockOnMessage }));

    await server.connected;

    const testMessage: WSMessage = {
      symbol: 'TCS.NS',
      data: {
        regularMarketPrice: 3500,
        regularMarketChangePercent: 1.5,
      },
      ts: Date.now(),
    };

    act(() => {
      server.send(JSON.stringify(testMessage));
    });

    expect(mockOnMessage).toHaveBeenCalledWith(testMessage);
    expect(mockOnMessage).toHaveBeenCalledTimes(1);
  });

  it('should update connection status correctly', async () => {
    const { result } = renderHook(() => useWebSocket(TEST_URL, { onMessage: jest.fn() }));

    expect(result.current.connected).toBe(false);

    await server.connected;
    await waitFor(() => expect(result.current.connected).toBe(true));

    act(() => server.close());
    await waitFor(() => expect(result.current.connected).toBe(false));
  });

  it('should clean up the connection on unmount', async () => {
    const { unmount } = renderHook(() => useWebSocket(TEST_URL, { onMessage: jest.fn() }));
    await server.connected;
    unmount();
    await expect(server.closed).resolves.toBeUndefined();
  });
});
