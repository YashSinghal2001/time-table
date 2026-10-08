import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useStore } from '../../store/useStore';
import { isToday } from '../../utils/dateUtils';
import { ChartData, Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const DailyPerformance: React.FC = () => {
  const tasks = useStore((state) => state.tasks);
  
  const todayTasks = tasks.filter(t => isToday(t.dueDate));
  const completed = todayTasks.filter(t => t.status === 'completed').length;
  const pending = todayTasks.length - completed;
  
  const data: ChartData<'doughnut'> = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completed, pending],
        backgroundColor: ['#10B981', '#E5E7EB'],
        borderColor: ['#059669', '#D1D5DB'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '75%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 h-full flex flex-row items-center justify-between gap-3">
      <div className="flex flex-col justify-center">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Daily Performance</h3>
          <div className="mt-1">
             <span className="text-3xl font-bold text-gray-900 dark:text-white">{completed}</span>
             <span className="text-sm text-gray-400 ml-1">/ {todayTasks.length} tasks</span>
          </div>
          <div className="text-xs text-green-500 font-medium mt-1">
            {todayTasks.length > 0 ? Math.round((completed / todayTasks.length) * 100) : 0}% Completed
          </div>
      </div>
      
      <div className="h-20 w-20 relative flex-shrink-0">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};
