import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import yahooFinance from 'yahoo-finance2';
import { getQuote } from './src/services/yahooFinance';

const PORT = process.env.WS_PORT ? Number(process.env.WS_PORT) : 4000;

// Initialize the yahoo-finance2 library.
// This is crucial because the library needs to fetch cookies and a crumb
// to communicate with Yahoo's API, and this can fail occasionally.
// By doing it once on startup, we make the server more robust.
async function initializeYahooFinance() {
  try {
    console.log('Initializing yahoo-finance2...');
    // We use a common, liquid stock like AAPL for a reliable initialization check.
    await yahooFinance.quote('AAPL');
    console.log('yahoo-finance2 initialized successfully.');
  } catch (error) {
    console.error('Fatal: Failed to initialize yahoo-finance2. The server will exit.', error);
    // If we can't initialize, the server is useless, so we exit.
    process.exit(1);
  }
}

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

// Broadcasts data to all connected clients.
function broadcast(data: unknown) {
  const json = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  });
}

// List of key Indian stocks and indices to track.
const symbols = [
  'TCS.NS', 'INFY.NS', 'WIPRO.NS', 'HCLTECH.NS',
  'HDFCBANK.NS', 'ICICIBANK.NS', 'SBIN.NS', 'KOTAKBANK.NS',
  'RELIANCE.NS', 'ONGC.NS', 'NTPC.NS',
  'ITC.NS', 'HINDUNILVR.NS', 'NESTLEIND.NS',
  'SUNPHARMA.NS', 'DRREDDY.NS', 'CIPLA.NS',
  '^NSEI', // Nifty 50
  '^BSESN' // Sensex
];

// Helper to add a delay between API calls to avoid rate-limiting.
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetches quotes for all symbols and broadcasts them.
async function fetchAndBroadcastAll() {
  console.log("Starting new fetch cycle for all symbols...");
  for (const symbol of symbols) {
    try {
      const quote = await getQuote(symbol);
      if (quote && quote.regularMarketPrice) {
        const message = {
          symbol: symbol,
          data: {
            regularMarketPrice: quote.regularMarketPrice,
            regularMarketChangePercent: quote.regularMarketChangePercent,
          },
          ts: Date.now(),
        };
        broadcast(message);
        console.log(`Broadcasted data for ${symbol}`);
      } else {
        console.warn(`No data returned for ${symbol}`);
      }
    } catch (error) {
      console.error(`Failed to fetch quote for ${symbol}:`, error);
    }
    // A small delay is crucial to prevent being rate-limited by the Yahoo API.
    await sleep(250);
  }
  console.log("Fetch cycle complete.");
}

// Main server startup sequence.
async function main() {
  await initializeYahooFinance();

  // Start the global fetch loop.
  fetchAndBroadcastAll(); // Fetch immediately on start.
  setInterval(fetchAndBroadcastAll, 60000); // Then repeat every 60 seconds.

  server.listen(PORT, () => {
    console.log(`WebSocket server listening on ws://localhost:${PORT}`);
  });
}

main();

