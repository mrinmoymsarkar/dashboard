"use client";

import { useEffect, useState } from 'react';

// The shape of a single data point for our chart
interface ChartData {
  date: string;
  price: number;
}

// The shape of the raw data returned from our API
interface HistoricalDataPoint {
  date: string;
  close: number;
}

export default function useHistoricalData(symbol: string, range: string = '1mo') {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/quote?symbol=${symbol}&type=historical&range=${range}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch historical data for ${symbol}`);
        }
        const result = await response.json();
        
        const formattedData = result.data.map((item: HistoricalDataPoint) => ({
          date: item.date,
          price: item.close,
        }));

        setData(formattedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setData([]); // Clear data on error
      } finally {
        setLoading(false);
      }
    }

    if (symbol) {
      fetchData();
    } else {
      // If no symbol is provided, don't show loading state and clear data.
      setLoading(false);
      setData([]);
      setError(null);
    }
  }, [symbol, range]); // Re-fetch if the symbol or range changes

  return { data, loading, error };
}
