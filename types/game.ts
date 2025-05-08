export interface Schedule {
  id: string;
  date: string;
  time: string;
  opponent?: string;
  venue?: string;
  notes?: string;
}

export type SessionType = 'pre-session' | 'post-session';

export interface Metrics {
  id: string;
  sessionId: string;
  metrics: {
    name: string;
    value: number;
  }[];
  outcome: 'win' | 'loss';
  notes?: string;
}