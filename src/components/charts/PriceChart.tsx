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

// The shape of the data that our chart expects
interface ChartData {
  date: string;
  price: number;
}

interface PriceChartProps {
  data: ChartData[];
}

export default function PriceChart({ data }: PriceChartProps) {
  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis
            dataKey="date"
            tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            axisLine={false}
            tickLine={false}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis
            domain={['dataMin', 'dataMax']}
            axisLine={false}
            tickLine={false}
            tickCount={5}
            tickFormatter={(num) => `₹${num.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              backdropFilter: 'blur(5px)',
            }}
            labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            formatter={(value: number) => [value.toFixed(2), 'Price']}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#10B981" // Green for positive
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
