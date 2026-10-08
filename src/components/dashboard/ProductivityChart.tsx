import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useStore } from '../../store/useStore';
import { isToday } from '../../utils/dateUtils';
import { ChartData } from 'chart.js';

export const ProductivityChart: React.FC = () => {
  const tasks = useStore((state) => state.tasks);
  
  const todayTasks = tasks.filter(t => isToday(t.dueDate));
  const completed = todayTasks.filter(t => t.status === 'completed').length;
  const pending = todayTasks.length - completed;
  
  const data: ChartData<'doughnut'> = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completed, pending],
        backgroundColor: ['#10B981', '#F59E0B'],
        borderColor: ['#059669', '#D97706'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
            usePointStyle: true,
            padding: 20,
        }
      },
    },
    maintainAspectRatio: false,
  };

  if (todayTasks.length === 0) {
      return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 h-full min-h-[300px] flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white self-start">Productivity</h3>
              <p className="text-gray-500">No tasks for today yet.</p>
          </div>
      )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 h-full min-h-[300px]">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Productivity</h3>
      <div className="h-48 relative">
        <Doughnut data={data} options={options} />
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round((completed / todayTasks.length) * 100) || 0}%
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
