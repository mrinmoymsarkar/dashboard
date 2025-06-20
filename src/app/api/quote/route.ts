import { NextResponse } from 'next/server';
import { getQuote, getHistorical, getSummary } from '@/services/yahooFinance';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const type = searchParams.get('type') || 'quote';

  if (!symbol) {
    return NextResponse.json(
      { error: 'Query param "symbol" is required' },
      { status: 400 }
    );
  }

  try {
    switch (type) {
      case 'historical': {
        const range = searchParams.get('range') || '1mo';
        const result = await getHistorical(symbol, range);
        // The chart method returns an object with a 'quotes' array
        return NextResponse.json({ data: result.quotes });
      }
      case 'summary': {
        const data = await getSummary(symbol);
        return NextResponse.json({ data });
      }
      default: {
        const data = await getQuote(symbol);
        return NextResponse.json({ data });
      }
    }
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
