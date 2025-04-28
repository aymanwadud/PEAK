"use client";

import { Button } from "./ui/button";

export type TimePeriod = 'week' | 'month' | 'season' | 'year';

interface TimeFilterProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

const TIME_PERIODS: Record<TimePeriod, string> = {
  'week': 'Past Week',
  'month': 'Past Month',
  'season': 'This Season',
  'year': 'Past Year'
};

export default function TimeFilter({ selectedPeriod, onPeriodChange }: TimeFilterProps) {
  return (
    <div className="flex items-center gap-2">
      {(Object.entries(TIME_PERIODS) as [TimePeriod, string][]).map(([period, label]) => (
        <Button
          key={period}
          variant={selectedPeriod === period ? "secondary" : "ghost"}
          onClick={() => onPeriodChange(period)}
          className="text-sm"
        >
          {label}
        </Button>
      ))}
    </div>
  );
}