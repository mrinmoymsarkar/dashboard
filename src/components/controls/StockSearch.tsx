"use client";

import { useState, useEffect, useRef } from 'react';
import useDebounce from '@/hooks/useDebounce';
import { Search } from 'lucide-react';

// The shape of a single search result from our API
interface SearchResult {
  symbol: string;
  longname: string;
  exchange: string;
}

interface StockSearchProps {
  onSymbolSelect: (symbol: string) => void;
}

export default function StockSearch({ onSymbolSelect }: StockSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300); // 300ms delay

  useEffect(() => {
    if (debouncedQuery) {
      setLoading(true);
      fetch(`/api/search?q=${debouncedQuery}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setResults([]);
          } else {
            setResults(data.data);
          }
          setIsOpen(true);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  const handleSelect = (symbol: string) => {
    onSymbolSelect(symbol);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  return (
    <div className="relative w-full max-w-xs" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Search for a stock (e.g., INFY.NS)"
          className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading && <div className="p-3 text-muted-foreground">Searching...</div>}
          {!loading && results.length === 0 && debouncedQuery && (
            <div className="p-3 text-muted-foreground">No results found.</div>
          )}
          {!loading && results.length > 0 && (
            <ul>
              {results.map((result) => (
                <li
                  key={result.symbol}
                  onClick={() => handleSelect(result.symbol)}
                  className="px-4 py-2 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                >
                  <div className="font-semibold text-foreground">{result.symbol}</div>
                  <div className="text-sm text-muted-foreground truncate">{result.longname}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
