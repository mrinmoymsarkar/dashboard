import { useEffect, useRef, useState, useCallback } from 'react';
import { WSMessage } from '@/types';

interface UseWebSocketOptions {
  onMessage: (message: WSMessage) => void;
  fallbackToPolling?: boolean;
  pollingInterval?: number;
}

export default function useWebSocket(url: string, { 
  onMessage, 
  fallbackToPolling = true, 
  pollingInterval = 30000 
}: UseWebSocketOptions) {
  const ws = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize the callback to ensure it's stable and doesn't cause re-renders.
  const memoizedOnMessage = useCallback(onMessage, []);

  // Polling function for fallback
  const startPolling = useCallback(async () => {
    if (!fallbackToPolling) return;
    
    setIsPolling(true);
    console.log('Starting polling fallback...');
    
    const poll = async () => {
      try {
        // Fetch data from API instead of WebSocket
        const response = await fetch('/api/stocks/realtime');
        if (response.ok) {
          const data = await response.json();
          if (data.stocks) {
            Object.entries(data.stocks).forEach(([symbol, stockData]: [string, any]) => {
              memoizedOnMessage({
                symbol,
                data: stockData,
                ts: Date.now()
              });
            });
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    // Initial poll
    await poll();
    
    // Set up interval
    pollingRef.current = setInterval(poll, pollingInterval);
  }, [fallbackToPolling, pollingInterval, memoizedOnMessage]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setIsPolling(false);
  }, []);

  useEffect(() => {
    // Try WebSocket first
    try {
      ws.current = new WebSocket(url);
      ws.current.onopen = () => {
        setConnected(true);
        stopPolling(); // Stop polling if WebSocket connects
      };
      ws.current.onclose = () => {
        setConnected(false);
        // Start polling if WebSocket fails and fallback is enabled
        if (fallbackToPolling) {
          startPolling();
        }
      };
      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnected(false);
        // Start polling if WebSocket fails and fallback is enabled
        if (fallbackToPolling) {
          startPolling();
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const json = JSON.parse(event.data);
          memoizedOnMessage(json);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      // Start polling if WebSocket creation fails
      if (fallbackToPolling) {
        startPolling();
      }
    }

    // Cleanup function to close the connection and stop polling
    return () => {
      ws.current?.close();
      stopPolling();
    };
  }, [url, memoizedOnMessage, fallbackToPolling, startPolling, stopPolling]);

  return { connected: connected || isPolling, isPolling };
}
