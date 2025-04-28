"use client";

import { Button } from "./ui/button";

export type Sport = 'tennis' | 'baseball-pitcher' | 'baseball-batter';

interface SportConfig {
  name: string;
  metrics: string[];
  keyEmotions: string[];
}

export const SPORT_CONFIGS: Record<Sport, SportConfig> = {
  'tennis': {
    name: 'Tennis',
    metrics: ['First Serve %', 'Winners', 'Unforced Errors'],
    keyEmotions: ['Confidence', 'Focus', 'Anxiety']
  },
  'baseball-pitcher': {
    name: 'Baseball (Pitcher)',
    metrics: ['Strike %', 'Velocity', 'ERA'],
    keyEmotions: ['Confidence', 'Focus', 'Composure']
  },
  'baseball-batter': {
    name: 'Baseball (Batter)',
    metrics: ['Batting Avg', 'Exit Velocity', 'Contact %'],
    keyEmotions: ['Confidence', 'Focus', 'Pressure']
  }
};

interface SportSelectorProps {
  selectedSport: Sport;
  onSportChange: (sport: Sport) => void;
}

export default function SportSelector({ selectedSport, onSportChange }: SportSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      {(Object.keys(SPORT_CONFIGS) as Sport[]).map((sport) => (
        <Button
          key={sport}
          variant={selectedSport === sport ? "secondary" : "ghost"}
          onClick={() => onSportChange(sport)}
          className="text-sm"
        >
          {SPORT_CONFIGS[sport].name}
        </Button>
      ))}
    </div>
  );
}