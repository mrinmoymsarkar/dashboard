"use client";

import { useCallback, useState } from 'react';
import useWebSocket from '@/hooks/useWebSocket';
import useHistoricalData from '@/hooks/useHistoricalData';
import MarketOverviewCard from '@/components/cards/MarketOverviewCard';
import PriceChart from '@/components/charts/PriceChart';
import TimeRangeSelector from '@/components/controls/TimeRangeSelector';
import StockSearch from '@/components/controls/StockSearch';
import { ThemeToggle } from '@/components/ThemeToggle';
import { StockData, WSMessage } from '@/types';

export default function Home() {
  // State to hold the latest stock information for all symbols
  const [stocks, setStocks] = useState<Record<string, StockData>>({});
  // State to determine which stock's chart is displayed
  const [activeSymbol, setActiveSymbol] = useState<string>('');

  // Define the callback for handling incoming WebSocket messages.
  // We use useCallback to ensure this function has a stable identity.
  const handleMessage = useCallback((message: WSMessage) => {
    const { symbol, data } = message;
    if (symbol && data && typeof (data as StockData).regularMarketPrice === 'number') {
      setStocks(prevStocks => ({
        ...prevStocks,
        [symbol]: data as StockData,
      }));

      // Set the first received symbol as the active one for the chart
      // Use a functional update for setActiveSymbol to avoid dependency
      setActiveSymbol(prevActive => prevActive || symbol);
    }
  }, []); // Empty dependency array means this function is created once.

  // Connect to the WebSocket server and provide the callback
  const { connected } = useWebSocket('ws://localhost:4000', { onMessage: handleMessage });
  
  const [range, setRange] = useState('1mo');
  const { data: chartData, loading: chartLoading, error: chartError } = useHistoricalData(activeSymbol, range);

  return (
    <div className="bg-background min-h-screen text-foreground">
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">
              Indian Stock Market Dashboard
            </h1>
            <ThemeToggle />
          </div>
          <div className="flex-1 flex justify-center px-8">
            <StockSearch onSymbolSelect={setActiveSymbol} />
          </div>
          <div className="text-sm font-medium">
            <span>WebSocket: </span>
            <span className={connected ? 'text-green-600' : 'text-red-600'}>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.keys(stocks).length > 0 ? (
              Object.entries(stocks).map(([symbol, stockData]) => (
                <MarketOverviewCard
                  key={symbol}
                  symbol={symbol}
                  price={stockData.regularMarketPrice}
                  change={stockData.regularMarketChangePercent}
                  onClick={setActiveSymbol}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-10">Waiting for market data...</p>
            )}
          </div>

          <h2 className="text-2xl font-semibold self-start mt-4">
            {activeSymbol ? `Chart: ${activeSymbol}` : 'Chart'}
          </h2>

          <div className="w-full bg-card p-4 rounded-lg shadow">
            <div className="flex justify-end mb-4">
              <TimeRangeSelector selectedRange={range} onSelectRange={setRange} />
            </div>
            {chartLoading && <div className="h-[350px] flex items-center justify-center"><p>Loading chart...</p></div>}
            {chartError && <div className="h-[350px] flex items-center justify-center"><p className="text-red-500">{chartError}</p></div>}
            {!chartLoading && !chartError && chartData.length > 0 && (
              <PriceChart data={chartData} />
            )}
            {!activeSymbol && !chartLoading && (
              <div className="h-[350px] flex items-center justify-center"><p className="text-muted-foreground">Search for a stock or select one from above to see its chart.</p></div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

