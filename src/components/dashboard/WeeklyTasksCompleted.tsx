import React from 'react';
import { useStore } from '../../store/useStore';
import { startOfWeek, addDays, format, isSameDay, parse } from 'date-fns';

export const WeeklyTasksCompleted: React.FC = () => {
  const timetable = useStore((state) => state.timetable);
  
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 h-full flex flex-col justify-center">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Weekly Tasks Completed</h3>
      
      <div className="flex justify-between items-end px-1">
        {weekDays.map((day) => {
            const dayStr = format(day, 'yyyy-MM-dd');
            
            // Filter all tasks relevant for this day (One Time, Daily, Weekly)
            const dayTasks = timetable.filter(t => {
                if (t.repeat === 'daily') return true;
                if (t.repeat === 'weekly') {
                    const entryDate = parse(t.date, 'yyyy-MM-dd', new Date());
                    return day.getDay() === entryDate.getDay();
                }
                // One Time
                return t.date === dayStr;
            });

            const completedCount = dayTasks.filter(t => {
                if (t.repeat && t.repeat !== 'none') {
                    return t.completedDates?.includes(dayStr);
                }
                return t.completed;
            }).length;

            const totalCount = dayTasks.length;
            const isToday = isSameDay(day, today);
            
            // Calculate height percentage for a simple bar effect (max 100% = 10 tasks for visual scale)
            // Or just show counters. User asked for "small progress bars or counters".
            // Let's do a vertical bar + counter.
            
            const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
            
            return (
                <div key={dayStr} className="flex flex-col items-center gap-1 group">
                    <div className="text-[10px] font-bold text-gray-700 dark:text-gray-300">
                        {completedCount}/{totalCount}
                    </div>
                    
                    {/* Mini Progress Bar Container */}
                    <div className="w-1.5 h-12 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex flex-col justify-end relative">
                        <div 
                            className={`w-full rounded-full transition-all duration-500 ${isToday ? 'bg-blue-500' : 'bg-green-500'}`}
                            style={{ height: `${percentage}%` }}
                        />
                    </div>
                    
                    <div className={`text-[10px] font-medium uppercase ${isToday ? 'text-blue-500' : 'text-gray-400'}`}>
                        {format(day, 'EEE')}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};
