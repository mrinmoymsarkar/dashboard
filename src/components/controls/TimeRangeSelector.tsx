"use client";

interface TimeRangeSelectorProps {
  selectedRange: string;
  onSelectRange: (range: string) => void;
}

const ranges = ['1mo', '6mo', '1y', '5y'];

export default function TimeRangeSelector({ selectedRange, onSelectRange }: TimeRangeSelectorProps) {
  return (
    <div className="flex justify-center gap-2 bg-muted p-1 rounded-lg">
      {ranges.map((range) => (
        <button
          key={range}
          onClick={() => onSelectRange(range)}
          className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
            selectedRange === range
              ? 'bg-card text-foreground shadow'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          {range.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
