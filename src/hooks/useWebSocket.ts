import { useEffect, useRef, useState, useCallback } from 'react';
import { WSMessage } from '@/types';

interface UseWebSocketOptions {
  onMessage: (message: WSMessage) => void;
}

export default function useWebSocket(url: string, { onMessage }: UseWebSocketOptions) {
  const ws = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  // Memoize the callback to ensure it's stable and doesn't cause re-renders.
  const memoizedOnMessage = useCallback(onMessage, []);

  useEffect(() => {
    ws.current = new WebSocket(url);
    ws.current.onopen = () => setConnected(true);
    ws.current.onclose = () => setConnected(false);
    ws.current.onerror = console.error;

    ws.current.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        memoizedOnMessage(json);
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    // Cleanup function to close the connection
    return () => {
      ws.current?.close();
    };
  }, [url, memoizedOnMessage]);

  return { connected };
}
