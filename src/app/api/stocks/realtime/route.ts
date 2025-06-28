import { NextResponse } from 'next/server';
import { getQuote } from '@/services/yahooFinance';

// List of key Indian stocks and indices to track
const symbols = [
  'TCS.NS', 'INFY.NS', 'WIPRO.NS', 'HCLTECH.NS',
  'HDFCBANK.NS', 'ICICIBANK.NS', 'SBIN.NS', 'KOTAKBANK.NS',
  'RELIANCE.NS', 'ONGC.NS', 'NTPC.NS',
  'ITC.NS', 'HINDUNILVR.NS', 'NESTLEIND.NS',
  'SUNPHARMA.NS', 'DRREDDY.NS', 'CIPLA.NS',
  '^NSEI', // Nifty 50
  '^BSESN' // Sensex
];

export async function GET() {
  try {
    // Fetch quotes for all symbols in parallel
    const promises = symbols.map(async (symbol) => {
      try {
        const quote = await getQuote(symbol);
        return { symbol, quote, status: 'fulfilled' as const };
      } catch (error) {
        return { symbol, error, status: 'rejected' as const };
      }
    });

    const results = await Promise.all(promises);
    const stocks: Record<string, any> = {};

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const { quote } = result;
        if (quote && quote.regularMarketPrice) {
          stocks[result.symbol] = {
            regularMarketPrice: quote.regularMarketPrice,
            regularMarketChangePercent: quote.regularMarketChangePercent,
          };
        }
      } else {
        console.error(`Failed to fetch quote for ${result.symbol}:`, result.error);
      }
    });

    return NextResponse.json({ 
      stocks,
      timestamp: Date.now(),
      source: 'api-polling'
    });
  } catch (error) {
    console.error('Real-time API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch real-time data' },
      { status: 500 }
    );
  }
} 