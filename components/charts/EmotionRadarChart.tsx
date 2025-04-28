"use client";

import ReactECharts from 'echarts-for-react';
import { EmotionScore } from '@/types/emotions';

interface EmotionRadarChartProps {
  preGameEmotions: EmotionScore[];
  postGameEmotions: EmotionScore[];
  gameTitle: string;
}

export default function EmotionRadarChart({ preGameEmotions, postGameEmotions, gameTitle }: EmotionRadarChartProps) {
  // Use Array.from to handle Set iteration
  const allEmotions = Array.from(new Set(
    [...preGameEmotions, ...postGameEmotions].map(e => e.name)
  ));
  
  const option = {
    title: {
      text: `Emotional State Analysis: ${gameTitle}`,
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      data: ['Pre-Game', 'Post-Game'],
      bottom: 0
    },
    radar: {
      indicator: allEmotions.map(name => ({ name, max: 1 })),
      center: ['50%', '50%'],
      radius: '60%'
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: allEmotions.map(emotion => {
              const found = preGameEmotions.find(e => e.name === emotion);
              return found ? found.score : 0;
            }),
            name: 'Pre-Game',
            areaStyle: {
              opacity: 0.3
            }
          },
          {
            value: allEmotions.map(emotion => {
              const found = postGameEmotions.find(e => e.name === emotion);
              return found ? found.score : 0;
            }),
            name: 'Post-Game',
            areaStyle: {
              opacity: 0.3
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <ReactECharts 
        option={option}
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
}