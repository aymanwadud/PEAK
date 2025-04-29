export interface GameSchedule {
  id: string;
  date: string;
  time: string;
  opponent?: string;
  venue?: string;
  notes?: string;
}

export type GameSession = 'pre-game' | 'post-game';

export interface GameMetrics {
  id: string;
  gameId: string;
  metrics: {
    name: string;
    value: number;
  }[];
  outcome: 'win' | 'loss';
  notes?: string;
}