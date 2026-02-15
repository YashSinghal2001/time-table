import React, { useState } from 'react';
import { X, Clock, AlertCircle } from 'lucide-react';

interface DurationModalProps {
  onConfirm: (hours: number) => void;
  onCancel: () => void;
  maxHours: number;
  getConflicts: (duration: number) => string[];
}

export const DurationModal: React.FC<DurationModalProps> = ({ 
  onConfirm, 
  onCancel, 
  maxHours,
  getConflicts
}) => {
  const [hours, setHours] = useState(1);
  const conflictingSlots = getConflicts(hours);
  const hasConflicts = conflictingSlots.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(hours);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Task Duration
          </h2>
          <button 
            onClick={onCancel} 
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              How many hours will this task take?
            </label>
            
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: Math.min(8, maxHours) }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setHours(num)}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold border-2 transition-all ${
                    hours === num
                      ? 'bg-blue-500 border-blue-500 text-white shadow-md scale-105'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                >
                  {num}h
                </button>
              ))}
            </div>

            {maxHours < 8 && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Only {maxHours} hour{maxHours > 1 ? 's' : ''} available until 10 PM
              </p>
            )}
          </div>

          {hasConflicts && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
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
          
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg font-medium shadow-sm hover:shadow transition-all"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
