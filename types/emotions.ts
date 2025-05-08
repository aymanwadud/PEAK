export interface EmotionScore {
  name: string;
  score: number;
}

export interface SessionEmotionData {
  id: string;
  date: string;
  preSession: EmotionScore[];
  postSession: EmotionScore[];
  performanceMetrics: {
    name: string;
    metric: number;
  }[];
  outcome: 'win' | 'loss';
  recoveryData: {
    timeAfterSession: number;
    emotionScore: number;
    baseline: number;
  }[];
}