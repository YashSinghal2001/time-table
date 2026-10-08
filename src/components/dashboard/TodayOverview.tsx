import React from 'react';
import { useStore } from '../../store/useStore';
import { isToday, isFuture, parseISO } from 'date-fns';
import { CheckCircle, Circle } from 'lucide-react';

export const TodayOverview: React.FC = () => {
  const { tasks } = useStore();
  
  // Today's Tasks (All)
  const todaysTasks = tasks
    .filter(t => isToday(parseISO(t.dueDate)))
    .sort((a, b) => {
        // Sort by completion status (pending first), then priority
        if (a.status !== b.status) return a.status === 'pending' ? -1 : 1;
        const prioOrder = { high: 0, medium: 1, low: 2 };
        return prioOrder[a.priority] - prioOrder[b.priority];
    });

  // Upcoming Tasks (Future)
  const upcomingTasks = tasks
    .filter(t => isFuture(parseISO(t.dueDate)))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    // .slice(0, 3); // Removed slice to allow scrolling

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 h-full flex flex-col overflow-hidden" style={{ height: '100%', maxHeight: '100%' }}>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex-shrink-0">Today's Overview</h3>
      
      <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
        {/* Today's Tasks Column */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            <h4 className="text-xs font-semibold text-gray-400 mb-2 flex-shrink-0">TODAY'S TASKS</h4>
            {todaysTasks.length > 0 ? (
                <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar flex-1 min-h-0">
                    {todaysTasks.map(task => (
                        <div key={task.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-2 text-xs transition-colors flex-shrink-0"
                             style={{ borderLeftColor: task.priority === 'high' ? '#EF4444' : task.priority === 'medium' ? '#F59E0B' : '#10B981' }}>
                            {task.status === 'completed' ? 
                                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> : 
                                <Circle className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            }
                            <span className={`truncate flex-1 font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}>
                                {task.title}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-xs text-gray-400 italic">No tasks for today</div>
            )}
        </div>

        {/* Upcoming Tasks Column (Replaces Notes) */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
             <h4 className="text-xs font-semibold text-gray-400 mb-2 flex-shrink-0">UPCOMING TASKS</h4>
             {upcomingTasks.length > 0 ? (
                <div className="space-y-2 overflow-y-auto pr-1 custom-scrollbar flex-1 min-h-0">
                    {upcomingTasks.map(task => (
                        <div key={task.id} className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg text-xs flex-shrink-0">
                            <span className="text-gray-400 text-[10px] w-8 flex-shrink-0">
                                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                            <span className="truncate flex-1 font-medium text-gray-700 dark:text-gray-200">
                                {task.title}
                            </span>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                task.priority === 'high' ? 'bg-red-500' : 
                                task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`} />
                        </div>
                    ))}
                </div>
             ) : (
                <div className="text-xs text-gray-400 italic">No upcoming tasks</div>
             )}
        </div>
      </div>
    </div>
  );
};
