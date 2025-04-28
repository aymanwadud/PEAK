export interface EmotionScore {
  name: string;
  score: number;
}

export interface GameEmotionData {
  id: string;
  date: string;
  preGame: EmotionScore[];
  postGame: EmotionScore[];
  performanceMetrics: {
    metric: number;
    name: string;
  }[];
  outcome: 'win' | 'loss';
  recoveryData: {
    timeAfterGame: number;
    emotionScore: number;
    baseline: number;
  }[];
}