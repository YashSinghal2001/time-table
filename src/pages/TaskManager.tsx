import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Task } from '../types';
import { TaskItem } from '../components/tasks/TaskItem';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { Plus } from 'lucide-react';
import { isToday } from '../utils/dateUtils';

export const TaskManager: React.FC = () => {
  const tasks = useStore((state) => state.tasks);
  const addTask = useStore((state) => state.addTask);
  const updateTask = useStore((state) => state.updateTask);
  
  const [filter, setFilter] = useState<'all' | 'today' | 'pending' | 'completed'>('today');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'today') return isToday(task.dueDate);
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  }).sort((a, b) => {
      // Sort by status (pending first) then by due date
      if (a.status !== b.status) return a.status === 'pending' ? -1 : 1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const handleCreate = (task: Task) => {
    addTask(task);
    setIsFormOpen(false);
  };

  const handleUpdate = (task: Task) => {
    updateTask(task.id, task);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task</span>
        </button>
      </div>

      <TaskFilters filter={filter} setFilter={setFilter} />

      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={setEditingTask}
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No tasks found for this filter.</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <TaskForm
          onSubmit={handleCreate}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          initialData={editingTask}
          onSubmit={handleUpdate}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};
