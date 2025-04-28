"use client";

import ReactECharts from 'echarts-for-react';

interface PerformanceData {
  date: string;
  performanceMetric: number;
  mainEmotion: number;
  outcome: 'win' | 'loss';
}

interface EmotionPerformanceChartProps {
  data: PerformanceData[];
  metricName: string;
  emotionName: string;
  sport: string;
}

export default function EmotionPerformanceChart({ 
  data, 
  metricName, 
  emotionName,
  sport
}: EmotionPerformanceChartProps) {
  const option = {
    title: {
      text: `${emotionName} vs ${metricName}`,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: [metricName, emotionName],
      bottom: 0
    },
    grid: {
      right: '20%'
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: [
      {
        type: 'value',
        name: metricName,
        position: 'left'
      },
      {
        type: 'value',
        name: emotionName,
        position: 'right',
        min: 0,
        max: 1
      }
    ],
    series: [
      {
        name: metricName,
        type: 'bar',
        data: data.map(d => ({
          value: d.performanceMetric,
          itemStyle: {
            color: d.outcome === 'win' ? '#10b981' : '#ef4444'
          }
        }))
      },
      {
        name: emotionName,
        type: 'line',
        yAxisIndex: 1,
        symbol: 'circle',
        symbolSize: 8,
        data: data.map(d => d.mainEmotion),
        lineStyle: {
          width: 3
        }
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