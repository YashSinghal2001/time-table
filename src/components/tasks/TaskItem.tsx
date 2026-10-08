import React from 'react';
import { Task } from '../../types';
import { useStore } from '../../store/useStore';
import { format, parseISO } from 'date-fns';
import { cn } from '../../utils/cn';
import { CheckSquare, Square, Trash2, Edit2, Calendar as CalendarIcon } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const priorityColors = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const toggleTaskCompletion = useStore((state) => state.toggleTaskCompletion);
  const deleteTask = useStore((state) => state.deleteTask);

  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border-l-4 transition-all hover:shadow-md",
      task.status === 'completed' ? "border-green-500 opacity-75" : "border-blue-500"
    )}>
      <div className="flex items-start justify-between gap-4">
        <button
          onClick={() => toggleTaskCompletion(task.id)}
          className="mt-1 text-gray-400 hover:text-blue-500 transition-colors"
        >
          {task.status === 'completed' ? (
            <CheckSquare className="w-6 h-6 text-green-500" />
          ) : (
            <Square className="w-6 h-6" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              "font-semibold text-lg truncate",
              task.status === 'completed' ? "text-gray-500 line-through" : "text-gray-900 dark:text-white"
            )}>
              {task.title}
            </h3>
            <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium capitalize", priorityColors[task.priority])}>
              {task.priority}
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {task.description}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{format(parseISO(task.dueDate), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
