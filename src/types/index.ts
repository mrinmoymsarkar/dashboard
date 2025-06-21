export interface StockData {
  regularMarketPrice: number;
  regularMarketChangePercent: number;
}

export interface WSMessage {
  symbol: string;
  data: StockData;
  ts: number;
}
