import React from 'react';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b dark:border-gray-800 z-40 flex items-center justify-between px-4">
       <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
          P
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">ProdApp</span>
      </div>
      <ThemeToggle />
    </header>
  );
};
