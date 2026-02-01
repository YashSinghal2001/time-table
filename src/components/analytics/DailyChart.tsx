import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useStore } from '../../store/useStore';
import { getWeekDays, formatDate } from '../../utils/dateUtils';
import { ChartData } from 'chart.js';

export const DailyChart: React.FC = () => {
  const tasks = useStore((state) => state.tasks);
  const weekDays = getWeekDays();

  const data: ChartData<'bar'> = {
    labels: weekDays.map(d => formatDate(d, 'EEE')),
    datasets: [
      {
        label: 'Completed Tasks',
        data: weekDays.map(day => {
            const dateStr = formatDate(day);
            return tasks.filter(t => 
                t.status === 'completed' && 
                t.completedAt && 
                formatDate(t.completedAt).startsWith(dateStr)
            ).length;
        }),
        backgroundColor: '#3B82F6',
        borderRadius: 4,
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
                  stepSize: 1,
              }
          }
      }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Daily Performance (This Week)</h3>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
