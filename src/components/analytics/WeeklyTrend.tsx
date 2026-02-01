import React from 'react';
import { Line } from 'react-chartjs-2';
import { useStore } from '../../store/useStore';
import { getWeekDays, formatDate } from '../../utils/dateUtils';
import { ChartData } from 'chart.js';

export const WeeklyTrend: React.FC = () => {
  const { pomodoroSessions } = useStore();
  const weekDays = getWeekDays();

  const data: ChartData<'line'> = {
    labels: weekDays.map(d => formatDate(d, 'EEE')),
    datasets: [
      {
        label: 'Focus Minutes',
        data: weekDays.map(day => {
            const dateStr = formatDate(day);
            return pomodoroSessions
                .filter(s => s.date === dateStr && s.completed)
                .reduce((acc, curr) => acc + curr.focusMinutes, 0);
        }),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
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
          }
      }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Focus Time Trend (Minutes)</h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
