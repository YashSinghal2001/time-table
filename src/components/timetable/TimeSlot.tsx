import React from 'react';
import { useStore } from '../../store/useStore';
import { TimetableEntry } from '../../types';
import { cn } from '../../utils/cn';
import { Plus } from 'lucide-react';

interface TimeSlotProps {
  time: string;
  entries: TimetableEntry[];
  onAdd: (time: string) => void;
  onEdit: (entry: TimetableEntry) => void;
  onDrop: (time: string, entryId: string) => void;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({ time, entries, onAdd, onEdit, onDrop }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const entryId = e.dataTransfer.getData('text/plain');
    onDrop(time, entryId);
  };

  return (
    <div 
        className="flex border-b dark:border-gray-800 min-h-[80px]"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
    >
      <div className="w-16 md:w-20 p-2 text-right text-xs md:text-sm text-gray-500 border-r dark:border-gray-800 font-medium">
        {time}
      </div>
      <div className="flex-1 p-1 relative group">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
             <button 
                onClick={() => onAdd(time)}
                className="bg-blue-500 text-white rounded-full p-1 shadow-sm pointer-events-auto hover:bg-blue-600 transform scale-75"
             >
                 <Plus className="w-4 h-4" />
             </button>
        </div>
        
        <div className="flex flex-wrap gap-2 h-full">
            {entries.map(entry => (
                <div
                    key={entry.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', entry.id)}
                    onClick={() => onEdit(entry)}
                    className={cn(
                        "rounded px-2 py-1 text-xs md:text-sm text-white cursor-grab active:cursor-grabbing shadow-sm flex-1 min-w-[120px] truncate transition-transform hover:scale-[1.02]",
                    )}
                    style={{ backgroundColor: entry.color }}
                >
                    <span className="font-bold mr-1">{entry.category}:</span>
                    {entry.activity}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
