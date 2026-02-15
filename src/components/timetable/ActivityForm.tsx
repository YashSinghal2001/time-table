import React, { useState } from 'react';
import { TimetableEntry, Category } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { X, Clock } from 'lucide-react';
import { format, parse } from 'date-fns';

interface ActivityFormProps {
  timeSlot: string;
  date: string;
  onSubmit: (entry: TimetableEntry) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
  initialData?: TimetableEntry | null;
  duration?: number;
  onMultiSubmit?: (entries: TimetableEntry[]) => void;
}

const categories: { value: Category; label: string; color: string }[] = [
  { value: 'work', label: 'Work', color: '#3B82F6' }, // Blue
  { value: 'study', label: 'Study', color: '#8B5CF6' }, // Purple
  { value: 'break', label: 'Break', color: '#10B981' }, // Green
  { value: 'personal', label: 'Personal', color: '#F59E0B' }, // Orange
];

export const ActivityForm: React.FC<ActivityFormProps> = ({ 
  timeSlot, 
  date, 
  onSubmit, 
  onDelete, 
  onClose, 
  initialData,
  duration = 1,
  onMultiSubmit
}) => {
  const [activity, setActivity] = useState(initialData?.activity || '');
  const [category, setCategory] = useState<Category>(initialData?.category || 'work');
  const [repeat, setRepeat] = useState<'daily' | 'weekly'>(
    (initialData?.repeat === 'daily' || initialData?.repeat === 'weekly') ? initialData.repeat : 'weekly'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedCategory = categories.find(c => c.value === category);
    
    // If editing existing entry, just update it
    if (initialData) {
      const entry: TimetableEntry = {
        id: initialData.id,
        timeSlot,
        activity,
        category,
        color: selectedCategory?.color || '#3B82F6',
        date,
        repeat,
        completed: initialData.completed || false,
        completedDates: initialData.completedDates || []
      };
      onSubmit(entry);
      return;
    }

    // For new entries with duration > 1, create multiple entries
    if (duration > 1 && onMultiSubmit) {
      const entries: TimetableEntry[] = [];
      const startHour = parseInt(timeSlot.split(':')[0]);
      
      for (let i = 0; i < duration; i++) {
        const hour = startHour + i;
        if (hour > 22) break; // Don't go beyond 10 PM
        
        const slotTime = `${hour.toString().padStart(2, '0')}:00`;
        
        entries.push({
          id: uuidv4(),
          timeSlot: slotTime,
          activity,
          category,
          color: selectedCategory?.color || '#3B82F6',
          date,
          repeat,
          completed: false,
          completedDates: []
        });
      }
      
      onMultiSubmit(entries);
    } else {
      // Single entry
      const entry: TimetableEntry = {
        id: uuidv4(),
        timeSlot,
        activity,
        category,
        color: selectedCategory?.color || '#3B82F6',
        date,
        repeat,
        completed: false,
        completedDates: []
      };
      onSubmit(entry);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {initialData ? 'Edit Activity' : 'New Activity'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <div>
              Time: <span className="font-medium text-gray-900 dark:text-white">
                {format(parse(timeSlot, 'HH:mm', new Date()), 'h:mm a')}
              </span>
            </div>
            {!initialData && duration > 1 && (
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <Clock className="w-3 h-3" />
                <span className="font-medium">
                  {duration} hour{duration > 1 ? 's' : ''} duration
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Activity</label>
            <input
              type="text"
              required
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="What are you doing?"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Repeat</label>
            <select
              value={repeat}
              onChange={(e) => setRepeat(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="pt-4 flex justify-between gap-2">
            {initialData && onDelete ? (
                 <button
                 type="button"
                 onClick={() => onDelete(initialData.id)}
                 className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium"
               >
                 Delete
               </button>
            ) : <div></div>}
           
           <div className="flex gap-2">
                <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                Cancel
                </button>
                <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg font-medium"
                >
                Save
                </button>
           </div>
          </div>
        </form>
      </div>
    </div>
  );
};
