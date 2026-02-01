import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useStore } from '../../store/useStore';
import { ChartData } from 'chart.js';

export const TaskDistribution: React.FC = () => {
  const tasks = useStore((state) => state.tasks);
  
  const high = tasks.filter(t => t.priority === 'high').length;
  const medium = tasks.filter(t => t.priority === 'medium').length;
  const low = tasks.filter(t => t.priority === 'low').length;

  const data: ChartData<'doughnut'> = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [high, medium, low],
        backgroundColor: ['#EF4444', '#F59E0B', '#10B981'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom' as const,
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm h-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Task Priority Distribution</h3>
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};
