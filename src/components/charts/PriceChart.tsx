"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useTheme } from 'next-themes';

// The shape of the data that our chart expects
interface ChartData {
  date: string;
  price: number;
}

interface PriceChartProps {
  data: ChartData[];
}

export default function PriceChart({ data }: PriceChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const axisColor = isDark ? 'hsl(var(--muted-foreground))' : '#4B5563'; // gray-600
  const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
  const strokeColor = isDark ? 'hsl(var(--primary))' : '#10B981';
  const tooltipBg = isDark ? 'rgba(30,41,59,0.9)' : 'rgba(255,255,255,0.9)';
  const tooltipBorder = isDark ? 'hsl(var(--border))' : '#e2e8f0';

  return (
    <div className="w-full h-[400px] bg-card rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="date"
            tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            axisLine={false}
            tickLine={false}
            padding={{ left: 10, right: 10 }}
            tick={{ fill: axisColor, fontSize: 12 }}
          />
          <YAxis
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
              borderRadius: '0.5rem',
              backdropFilter: 'blur(5px)',
              color: 'hsl(var(--foreground))',
            }}
            labelFormatter={(label) =>
              new Date(label).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            }
            formatter={(value: number) => [value.toFixed(2), 'Price']}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
