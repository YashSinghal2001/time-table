import React, { useState } from 'react';
import { TimetableEntry, Category } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { X } from 'lucide-react';

interface ActivityFormProps {
  timeSlot: string;
  date: string;
  onSubmit: (entry: TimetableEntry) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
  initialData?: TimetableEntry | null;
}

const categories: { value: Category; label: string; color: string }[] = [
  { value: 'work', label: 'Work', color: '#3B82F6' }, // Blue
  { value: 'study', label: 'Study', color: '#8B5CF6' }, // Purple
  { value: 'break', label: 'Break', color: '#10B981' }, // Green
  { value: 'personal', label: 'Personal', color: '#F59E0B' }, // Orange
];

export const ActivityForm: React.FC<ActivityFormProps> = ({ timeSlot, date, onSubmit, onDelete, onClose, initialData }) => {
  const [activity, setActivity] = useState(initialData?.activity || '');
  const [category, setCategory] = useState<Category>(initialData?.category || 'work');
  const [repeat, setRepeat] = useState<'daily' | 'weekly'>(
    (initialData?.repeat === 'daily' || initialData?.repeat === 'weekly') ? initialData.repeat : 'weekly'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedCategory = categories.find(c => c.value === category);
    
    const entry: TimetableEntry = {
      id: initialData?.id || uuidv4(),
      timeSlot,
      activity,
      category,
      color: selectedCategory?.color || '#3B82F6',
      date,
      repeat,
      completed: initialData?.completed || false,
      completedDates: initialData?.completedDates || []
    };
    
    onSubmit(entry);
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
          <div className="text-sm text-gray-500 dark:text-gray-400">
             Time: <span className="font-medium text-gray-900 dark:text-white">{timeSlot}</span>
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
            <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                            category === cat.value
                                ? 'ring-2 ring-offset-1 dark:ring-offset-gray-800'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        style={{ 
                            backgroundColor: category === cat.value ? cat.color : undefined,
                            borderColor: cat.color,
                            color: category === cat.value ? 'white' : cat.color
                        }}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
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
