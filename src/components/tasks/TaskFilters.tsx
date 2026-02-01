import React from 'react';
import { cn } from '../../utils/cn';

interface TaskFiltersProps {
  filter: 'all' | 'today' | 'pending' | 'completed';
  setFilter: (filter: 'all' | 'today' | 'pending' | 'completed') => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ filter, setFilter }) => {
  const filters = [
    { id: 'all', label: 'All Tasks' },
    { id: 'today', label: 'Today' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
  ] as const;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {filters.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setFilter(id)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
            filter === id
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
