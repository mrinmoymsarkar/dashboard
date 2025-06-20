import { useEffect, useRef, useState } from 'react';

export interface WSMessage {
  symbol: string;
  data: unknown;
  ts: number;
}

export default function useWebSocket(url: string) {
  const ws = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState<WSMessage | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    ws.current = new WebSocket(url);
    ws.current.onopen = () => setConnected(true);
    ws.current.onclose = () => setConnected(false);
    ws.current.onerror = console.error;
    ws.current.onmessage = (ev) => {
      try {
        const json = JSON.parse(ev.data);
        setMessage(json);
      } catch (err) {
        console.error(err);
      }
    };
    return () => ws.current?.close();
  }, [url]);

  return { message, connected };
}
