import React from 'react';
import { Line } from 'react-chartjs-2';
import { useStore } from '../../store/useStore';
import { getWeekDays, formatDate } from '../../utils/dateUtils';
import { ChartData } from 'chart.js';

export const WeeklyTrend: React.FC = () => {
  const { tasks } = useStore();
  const weekDays = getWeekDays();

  const data: ChartData<'line'> = {
    labels: weekDays.map(d => formatDate(d, 'EEE')),
    datasets: [
      {
        label: 'Completed Tasks',
        data: weekDays.map(day => {
            const dateStr = formatDate(day);
            // Count tasks completed on this specific day
            // Note: This relies on completedAt timestamp. 
            // If completedAt is missing, we might fallback to dueDate if status is completed, 
            // but accurate trends need completedAt.
            return tasks.filter(t => 
                t.status === 'completed' && 
                t.completedAt && 
                t.completedAt.startsWith(dateStr)
            ).length;
        }),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

   const options = {
      plugins: {
          legend: {
              display: false,
          }
      },
      scales: {
          y: {
              beginAtZero: true,
              ticks: {
                  stepSize: 1
              }
          }
      }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Tasks Completed Trend</h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
