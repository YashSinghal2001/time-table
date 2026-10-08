import React, { useState } from 'react';
import { format, startOfWeek, endOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { cn } from '../../utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const [view, setView] = useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = React.useMemo(() => {
    if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    } else {
      const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
      const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    }
  }, [view, currentDate]);

  const prev = () => {
    setCurrentDate(d => addDays(d, view === 'week' ? -7 : -30)); 
  };
  
  const next = () => {
    setCurrentDate(d => addDays(d, view === 'week' ? 7 : 30));
  };

  const prevMonth = () => {
      const d = new Date(currentDate);
      d.setMonth(d.getMonth() - 1);
      setCurrentDate(d);
  }
  const nextMonth = () => {
      const d = new Date(currentDate);
      d.setMonth(d.getMonth() + 1);
      setCurrentDate(d);
  }

  const handlePrev = view === 'week' ? prev : prevMonth;
  const handleNext = view === 'week' ? next : nextMonth;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
           <button onClick={() => setView(v => v === 'week' ? 'month' : 'week')} className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 transition-colors">
            {view === 'week' ? 'Show Month' : 'Show Week'}
          </button>
          <div className="flex gap-1">
            <button onClick={handlePrev} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleNext} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className={cn("grid gap-2", "grid-cols-7")}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
            <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">{d}</div>
        ))}
        {days.map((day, i) => (
          <div
            key={i}
            className={cn(
              "aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all cursor-pointer",
              !isSameMonth(day, currentDate) && view === 'month' ? "text-gray-300 dark:text-gray-600" : "text-gray-700 dark:text-gray-200",
              isToday(day) ? "bg-blue-500 text-white font-bold shadow-md transform scale-105" : "hover:bg-gray-50 dark:hover:bg-gray-700/50",
              isSameDay(day, currentDate) && !isToday(day) ? "ring-2 ring-blue-500/50" : ""
            )}
            onClick={() => setCurrentDate(day)}
          >
            <span>{format(day, 'd')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
