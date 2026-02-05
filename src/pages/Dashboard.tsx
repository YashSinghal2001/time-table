import React from 'react';
import { CalendarView } from '../components/dashboard/CalendarView';
import { TaskSummary } from '../components/dashboard/TaskSummary';
import { ProductivityChart } from '../components/dashboard/ProductivityChart';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarView />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <TaskSummary />
          <ProductivityChart />
        </div>
      </div>
    </div>
  );
};
