import React, { useState, useMemo } from 'react';
import { TimetableEntry, Category } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { X, Clock, AlertCircle } from 'lucide-react';
import { format, parse, addHours } from 'date-fns';

interface UnifiedActivityFormProps {
  timeSlot: string;
  date: string;
  onSubmit: (entry: TimetableEntry) => void;
  onMultiSubmit: (entries: TimetableEntry[]) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
  initialData?: TimetableEntry | null;
  maxHours: number;
  getConflicts: (duration: number) => string[];
}

const categories: { value: Category; label: string; color: string }[] = [
  { value: 'work', label: 'Work', color: '#3B82F6' },
  { value: 'study', label: 'Study', color: '#8B5CF6' },
  { value: 'break', label: 'Break', color: '#10B981' },
  { value: 'personal', label: 'Personal', color: '#F59E0B' },
];

export const UnifiedActivityForm: React.FC<UnifiedActivityFormProps> = ({ 
  timeSlot, 
  date, 
  onSubmit, 
  onMultiSubmit,
  onDelete, 
  onClose, 
  initialData,
  maxHours,
  getConflicts
}) => {
  const [activity, setActivity] = useState(initialData?.activity || '');
  const [category, setCategory] = useState<Category>(initialData?.category || 'work');
  const [repeat, setRepeat] = useState<'daily' | 'weekly'>(
    (initialData?.repeat === 'daily' || initialData?.repeat === 'weekly') ? initialData.repeat : 'daily'
  );
  const [duration, setDuration] = useState(1);

  // Calculate time range based on duration
  const timeRange = useMemo(() => {
    const startTime = parse(timeSlot, 'HH:mm', new Date());
    const endTime = addHours(startTime, duration);
    return {
      start: format(startTime, 'h:mm a'),
      end: format(endTime, 'h:mm a')
    };
  }, [timeSlot, duration]);

  // Get conflicts for current duration
  const conflictingSlots = useMemo(() => {
    if (initialData) return []; // No conflict check when editing
    return getConflicts(duration);
  }, [duration, getConflicts, initialData]);

  const hasConflicts = conflictingSlots.length > 0;

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
    if (duration > 1) {
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {initialData ? 'Edit Activity' : 'New Activity'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Start Time (Readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Time
            </label>
            <div className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700/50 dark:border-gray-600 dark:text-white bg-gray-50 text-gray-900 font-medium">
              {format(parse(timeSlot, 'HH:mm', new Date()), 'h:mm a')}
            </div>
          </div>

          {/* Duration Selector (only for new entries) */}
          {!initialData && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: Math.min(8, maxHours) }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setDuration(num)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                      duration === num
                        ? 'bg-blue-500 border-blue-500 text-white shadow-md scale-105'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                  >
                    {num}h
                  </button>
                ))}
              </div>

              {/* Time Range Display */}
              {duration > 0 && (
                <div className="mt-2 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">
                    Time Range: {timeRange.start} – {timeRange.end}
                  </span>
                </div>
              )}

              {/* Max Hours Warning */}
              {maxHours < 8 && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Only {maxHours} hour{maxHours > 1 ? 's' : ''} available until 10 PM
                </p>
              )}

              {/* Conflicts Warning */}
              {hasConflicts && (
                <div className="mt-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-amber-800 dark:text-amber-200">
                      <p className="font-semibold mb-1">Warning: Conflicting slots detected</p>
                      <p className="text-amber-700 dark:text-amber-300">
                        The following time slots already have tasks: {conflictingSlots.join(', ')}
                      </p>
                      <p className="mt-1 text-amber-600 dark:text-amber-400">
                        Proceeding will skip occupied slots.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Activity Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Activity Name
            </label>
            <input
              type="text"
              required
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="What are you doing?"
              autoFocus
            />
          </div>
          
          {/* Repeat Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Repeat
            </label>
            <select
              value={repeat}
              onChange={(e) => setRepeat(e.target.value as 'daily' | 'weekly')}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          
          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
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
          
          {/* Action Buttons */}
          <div className="pt-4 flex justify-between gap-2">
            {initialData && onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(initialData.id)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            ) : <div></div>}
           
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg font-medium shadow-sm hover:shadow transition-all"
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
