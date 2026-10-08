import React from 'react';
import { DailyChart } from '../components/analytics/DailyChart';
import { TaskDistribution } from '../components/analytics/TaskDistribution';

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Productivity Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyChart />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
              <TaskDistribution />
          </div>
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm flex items-center justify-center">
              <p className="text-gray-500">More insights coming soon...</p>
          </div>
      </div>
    </div>
  );
};
