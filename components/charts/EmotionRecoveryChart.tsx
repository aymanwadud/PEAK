"use client";

import ReactECharts from 'echarts-for-react';

interface RecoveryDataPoint {
  timeAfterSession: number; // hours after session
  emotionScore: number;
  baseline: number;
}

interface EmotionRecoveryChartProps {
  data: RecoveryDataPoint[];
  emotionName: string;
  result: 'win' | 'loss';
  date: string;
}

export default function EmotionRecoveryChart({
  data,
  emotionName,
  result,
  date
}: EmotionRecoveryChartProps) {
  const option = {
    title: {
      text: `${emotionName} Recovery After ${result === 'win' ? 'Win' : 'Loss'} (${date})`,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params: any) {
        const hours = params[0].axisValue;
        const emotion = params[0].data;
        const baseline = params[1].data;
        return `Hours after session: ${hours}<br/>
                ${emotionName}: ${emotion.toFixed(2)}<br/>
                Baseline: ${baseline.toFixed(2)}`;
      }
    },
    xAxis: {
      type: 'category',
      name: 'Hours After Session',
      data: data.map(d => d.timeAfterSession),
      axisLabel: {
        formatter: '{value}h'
      }
    },
    yAxis: {
      type: 'value',
      name: emotionName,
      min: 0,
      max: 1
    },
    series: [
      {
        name: emotionName,
        type: 'line',
        smooth: true,
        data: data.map(d => d.emotionScore),
        itemStyle: {
          color: result === 'win' ? '#10b981' : '#ef4444'
        },
        markPoint: {
          data: [
            { type: 'min', name: 'Lowest Point' },
            { type: 'max', name: 'Peak' }
          ]
        },
        areaStyle: {
          opacity: 0.3
        }
      },
      {
        name: 'Baseline',
        type: 'line',
        data: data.map(d => d.baseline),
        lineStyle: {
          type: 'dashed'
        },
        itemStyle: {
          color: '#94a3b8'
        }
      }
    ],
    legend: {
      data: [emotionName, 'Baseline'],
      bottom: 0
    }
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