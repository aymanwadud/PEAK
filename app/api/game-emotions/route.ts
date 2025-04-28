import { NextResponse } from 'next/server';
import type { GameEmotionData } from '@/types/emotions';

// This is mock data for demonstration. Replace with actual database calls.
const mockGameData: GameEmotionData[] = [
  {
    id: '1',
    date: '2025-04-28',
    preGame: [
      { name: 'Confidence', score: 0.75 },
      { name: 'Anxiety', score: 0.45 },
      { name: 'Focus', score: 0.82 }
    ],
    postGame: [
      { name: 'Confidence', score: 0.85 },
      { name: 'Anxiety', score: 0.25 },
      { name: 'Focus', score: 0.78 }
    ],
    performanceMetrics: [
      { name: 'First Serve %', metric: 65 }
    ],
    outcome: 'win',
    recoveryData: [
      { timeAfterGame: 0, emotionScore: 0.85, baseline: 0.7 },
      { timeAfterGame: 2, emotionScore: 0.82, baseline: 0.7 },
      { timeAfterGame: 4, emotionScore: 0.78, baseline: 0.7 },
      { timeAfterGame: 8, emotionScore: 0.72, baseline: 0.7 },
      { timeAfterGame: 24, emotionScore: 0.7, baseline: 0.7 }
    ]
  },
  {
    id: '2',
    date: '2025-04-27',
    preGame: [
      { name: 'Confidence', score: 0.82 },
      { name: 'Anxiety', score: 0.35 },
      { name: 'Focus', score: 0.88 }
    ],
    postGame: [
      { name: 'Confidence', score: 0.65 },
      { name: 'Anxiety', score: 0.55 },
      { name: 'Focus', score: 0.72 }
    ],
    performanceMetrics: [
      { name: 'First Serve %', metric: 58 }
    ],
    outcome: 'loss',
    recoveryData: [
      { timeAfterGame: 0, emotionScore: 0.65, baseline: 0.7 },
      { timeAfterGame: 2, emotionScore: 0.68, baseline: 0.7 },
      { timeAfterGame: 4, emotionScore: 0.72, baseline: 0.7 },
      { timeAfterGame: 8, emotionScore: 0.71, baseline: 0.7 },
      { timeAfterGame: 24, emotionScore: 0.7, baseline: 0.7 }
    ]
  }
];

export async function GET() {
  // In a real application, fetch this data from a database
  return NextResponse.json(mockGameData);
}