"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';

// The shape of the data that our chart expects
interface ChartData {
  date: string;
  price: number;
}

interface PriceChartProps {
  data: ChartData[];
}

// Helper to get theme-aware colors
const getCssVar = (name: string) => `hsl(var(${name}))`;

export default function PriceChart({ data }: PriceChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Memoize trend calculation and colors to prevent re-calculating on every render
  const { trend, strokeColor, gradientStart, gradientStop } = useMemo(() => {
    if (data.length < 2) {
      const neutralColor = getCssVar('--primary');
      return {
        trend: 'neutral',
        strokeColor: neutralColor,
        gradientStart: neutralColor,
        gradientStop: getCssVar('--background'),
      };
    }

    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    const isUp = lastPrice >= firstPrice;

    const positiveColor = '#16A34A'; // green-600
    const negativeColor = '#DC2626'; // red-600

    return {
      trend: isUp ? 'up' : 'down',
      strokeColor: isUp ? positiveColor : negativeColor,
      gradientStart: isUp ? positiveColor : negativeColor,
      gradientStop: getCssVar('--background'),
    };
  }, [data, isDark]);

  const axisColor = getCssVar('--muted-foreground');
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  const tooltipBg = getCssVar('--card');
  const tooltipBorder = getCssVar('--border');

  return (
    <div className="w-full h-[400px] bg-transparent">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 20, top: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gradientStart} stopOpacity={0.4} />
              <stop offset="95%" stopColor={gradientStop} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            axisLine={false}
            tickLine={false}
            padding={{ left: 10, right: 10 }}
            tick={{ fill: axisColor, fontSize: 12 }}
          />
          <YAxis
            orientation="right"
            domain={['dataMin', 'dataMax']}
            axisLine={false}
            tickLine={false}
            tickCount={5}
            tickFormatter={(num) => `₹${num.toFixed(0)}`}
            tick={{ fill: axisColor, fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '0.75rem', // rounded-lg
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // shadow-md
              color: getCssVar('--foreground'),
            }}
            labelFormatter={(label) =>
              new Date(label).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            }
            formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
            cursor={{ stroke: getCssVar('--primary'), strokeDasharray: '3 3' }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={2.5}
            fill="url(#priceGradient)"
            dot={false}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
