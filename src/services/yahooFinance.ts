import yahooFinance from 'yahoo-finance2';

/**
 * Wraps yahoo-finance2 calls to provide strongly-typed helpers.
 */
export async function getQuote(symbol: string) {
  return yahooFinance.quote(symbol);
}

export async function getHistorical(symbol: string, range: string = '1mo') {
  const period1 = new Date();
  switch (range) {
    case '1d':
      period1.setDate(period1.getDate() - 1);
      break;
    case '5d':
      period1.setDate(period1.getDate() - 5);
      break;
    case '1mo':
      period1.setMonth(period1.getMonth() - 1);
      break;
    case '6mo':
      period1.setMonth(period1.getMonth() - 6);
      break;
    case '1y':
      period1.setFullYear(period1.getFullYear() - 1);
      break;
    case '5y':
      period1.setFullYear(period1.getFullYear() - 5);
      break;
    default:
      period1.setMonth(period1.getMonth() - 1); // Default to 1 month
  }

  const options = {
    period1: period1.toISOString().split('T')[0], // YYYY-MM-DD
    interval: '1d' as const,
  };

  // The chart method is the recommended way to get historical data.
  return yahooFinance.chart(symbol, options);
}

export async function getSummary(symbol: string) {
  // Select a handful of common modules – adjust as needed.
  return yahooFinance.quoteSummary(symbol, {
    modules: ['price', 'summaryDetail', 'defaultKeyStatistics'],
  });
}

export async function search(query: string) {
  return yahooFinance.search(query);
}
