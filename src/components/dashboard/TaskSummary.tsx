import React from 'react';
import { useStore } from '../../store/useStore';
import { isToday } from '../../utils/dateUtils';
import { CheckCircle2, Circle } from 'lucide-react';

export const TaskSummary: React.FC = () => {
  const tasks = useStore((state) => state.tasks);
  
  const todayTasks = tasks.filter(t => isToday(t.dueDate));
  const completed = todayTasks.filter(t => t.status === 'completed').length;
  const pending = todayTasks.length - completed;
  const progress = todayTasks.length > 0 ? Math.round((completed / todayTasks.length) * 100) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Today's Overview</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Completed</span>
          </div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">{completed}</div>
        </div>
        
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
            <Circle className="w-5 h-5" />
            <span className="font-medium">Pending</span>
          </div>
          <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{pending}</div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
            />
        </div>
      </div>
    </div>
  );
};
