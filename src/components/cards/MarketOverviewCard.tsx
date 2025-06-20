import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MarketOverviewCardProps {
  symbol: string;
  price: number;
  change: number;
  onClick?: (symbol: string) => void;
}

export default function MarketOverviewCard({ symbol, price, change, onClick }: MarketOverviewCardProps) {
  const up = change >= 0;
  return (
    <div
      onClick={() => onClick && onClick(symbol)}
      className={`p-4 bg-card text-foreground shadow rounded-lg flex flex-col gap-2 w-full transition-all hover:shadow-md hover:scale-105 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <span className="text-xs text-muted-foreground">{symbol}</span>
      <span className="text-xl font-semibold">₹{price.toFixed(2)}</span>
      <span
        className={`flex items-center text-sm font-medium ${up ? 'text-green-600' : 'text-red-600'}`}
      >
        {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change.toFixed(2)}%
      </span>
    </div>
  );
}
