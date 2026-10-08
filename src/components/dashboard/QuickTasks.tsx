import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO } from 'date-fns';
import { Plus, Check, Trash2, Calendar as CalendarIcon } from 'lucide-react';

export const QuickTasks: React.FC = () => {
  const { tasks, addTask, toggleTaskCompletion, deleteTask } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Show all pending/recent tasks, not just today's
  // Or at least show tasks that are relevant (today + overdue + future?)
  // For Quick Tasks, showing "Today's" or "All Pending" is usually best.
  // Given the previous code filtered by `todayStr`, I'll keep it broader now or stick to the user intent.
  // User didn't specify filter logic, just "add Due Date support".
  // But if I add a task with a future date, it should probably appear.
  // Let's sort by date instead of filtering strictly for today to make the due date feature useful.
  
  const displayTasks = tasks
    .sort((a, b) => {
        // Sort by completion (pending first)
        if (a.status !== b.status) return a.status === 'pending' ? -1 : 1;
        // Then by date
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      id: uuidv4(),
      title: newTaskTitle,
      description: '',
      priority: 'medium',
      status: 'pending',
      dueDate: dueDate || format(new Date(), 'yyyy-MM-dd'), // Default to today if empty
      createdAt: new Date().toISOString(),
      completedAt: null
    });
    setNewTaskTitle('');
    setDueDate('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex flex-col h-full">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Tasks</h3>
      
      <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-4">
        <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex-shrink-0"
            >
              <Plus className="w-5 h-5" />
            </button>
        </div>
        
        {/* Optional Due Date Input - Clean & Native */}
        <div className="relative">
            <input 
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none min-h-[32px]"
                style={{ colorScheme: 'light dark' }}
            />
        </div>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {displayTasks.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-4">No tasks found</div>
        ) : (
            displayTasks.map(task => (
                <div key={task.id} className="group flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                    <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                            task.status === 'completed' 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 dark:border-gray-500 hover:border-green-500'
                        }`}
                    >
                        {task.status === 'completed' && <Check className="w-3 h-3" />}
                    </button>
                    <div className="flex-1 min-w-0">
                        <div className={`text-sm truncate ${
                            task.status === 'completed' 
                            ? 'text-gray-400 line-through' 
                            : 'text-gray-700 dark:text-gray-200'
                        }`}>
                            {task.title}
                        </div>
                        <div className="text-[10px] text-gray-400 flex items-center mt-0.5">
                            <CalendarIcon className="w-2.5 h-2.5 mr-1" />
                            {task.dueDate ? format(parseISO(task.dueDate), 'MMM d, yyyy') : 'No Due Date'}
                        </div>
                    </div>
                    <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity self-center"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ))
        )}
      </div>
    </div>
  );
};
