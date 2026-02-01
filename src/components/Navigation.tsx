import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, Timer, BarChart2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/timetable', icon: Calendar, label: 'Timetable' },
  { to: '/pomodoro', icon: Timer, label: 'Pomodoro' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
];

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:relative md:border-t-0 md:border-r md:w-64 md:h-screen md:flex md:flex-col md:p-4 dark:bg-gray-900 dark:border-gray-800 z-50">
      <div className="hidden md:flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
          P
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">ProdApp</span>
      </div>
      
      <div className="flex justify-around md:flex-col md:gap-2 flex-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col md:flex-row items-center md:gap-3 p-2 md:px-4 md:py-3 rounded-lg transition-colors text-xs md:text-sm font-medium",
                isActive
                  ? "text-blue-600 bg-blue-50 md:bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
              )
            }
          >
            <Icon className="w-6 h-6 md:w-5 md:h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      <div className="hidden md:flex items-center justify-between px-2 mt-auto pt-4 border-t dark:border-gray-800">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Theme</span>
          <ThemeToggle />
      </div>
    </nav>
  );
};
