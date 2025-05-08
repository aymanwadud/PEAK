"use client";

import ReactECharts from 'echarts-for-react';
import { EmotionScore } from '@/types/emotions';

interface EmotionRadarChartProps {
  preSessionEmotions: EmotionScore[];
  postSessionEmotions: EmotionScore[];
  title: string;
}

export default function EmotionRadarChart({ preSessionEmotions, postSessionEmotions, title }: EmotionRadarChartProps) {
  // Use Array.from to handle Set iteration
  const allEmotions = Array.from(new Set(
    [...preSessionEmotions, ...postSessionEmotions].map(e => e.name)
  ));
  
  const option = {
    title: {
      text: `Emotional State Analysis: ${title}`,
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      data: ['Pre-Session', 'Post-Session'],
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
              const found = preSessionEmotions.find(e => e.name === emotion);
              return found ? found.score : 0;
            }),
            name: 'Pre-Session',
            areaStyle: {
              opacity: 0.3
            }
          },
          {
            value: allEmotions.map(emotion => {
              const found = postSessionEmotions.find(e => e.name === emotion);
              return found ? found.score : 0;
            }),
            name: 'Post-Session',
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