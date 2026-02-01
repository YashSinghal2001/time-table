import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { cn } from '../utils/cn';

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

export const PomodoroTimer: React.FC = () => {
  const { pomodoroSessions, addPomodoroSession, settings } = useStore();
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(FOCUS_MINUTES * 60);
  const [isActive, setIsActive] = useState(false);
  
  // Use settings if available, otherwise default
  const focusTime = (settings?.pomodoroFocus || FOCUS_MINUTES) * 60;
  const breakTime = (settings?.pomodoroBreak || BREAK_MINUTES) * 60;

  useEffect(() => {
      setTimeLeft(mode === 'focus' ? focusTime : breakTime);
  }, [mode, focusTime, breakTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    // Play a simple beep sound if possible, or just log
    try {
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play().catch(e => console.log('Audio play failed', e));
    } catch (e) {
        console.error("Audio error", e);
    }

    if (mode === 'focus') {
      addPomodoroSession({
        id: uuidv4(),
        date: format(new Date(), 'yyyy-MM-dd'),
        focusMinutes: settings?.pomodoroFocus || FOCUS_MINUTES,
        breakMinutes: 0,
        completed: true,
        completedAt: new Date().toISOString(),
      });
      setMode('break');
    } else {
      setMode('focus');
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? focusTime : breakTime);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalTime = mode === 'focus' ? focusTime : breakTime;
  const progress = 100 - (timeLeft / totalTime) * 100;

  const todaySessions = pomodoroSessions.filter(
      s => s.date === format(new Date(), 'yyyy-MM-dd') && s.completed
  ).length;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pomodoro Timer</h1>
        <p className="text-gray-500 dark:text-gray-400">
            {mode === 'focus' ? 'Stay focused on your task' : 'Take a short break'}
        </p>
      </div>

      <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
        {/* Circular Progress */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-gray-200 dark:stroke-gray-700 fill-none"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            className={cn(
                "fill-none transition-all duration-1000 ease-linear",
                mode === 'focus' ? "stroke-blue-500" : "stroke-green-500"
            )}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={283}
            strokeDashoffset={283 * (1 - progress / 100)}
          />
        </svg>
        
        <div className="absolute flex flex-col items-center">
            {mode === 'focus' ? (
                <Brain className="w-8 h-8 text-blue-500 mb-2" />
            ) : (
                <Coffee className="w-8 h-8 text-green-500 mb-2" />
            )}
            <div className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white font-mono tabular-nums">
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-lg font-medium text-gray-500 uppercase tracking-widest mt-2">
                {mode}
            </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          className="flex items-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-full text-lg font-semibold hover:bg-blue-600 transition-transform active:scale-95 shadow-lg"
        >
          {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 px-8 py-4 rounded-xl shadow-sm border dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold text-center mb-1">
            Today's Sessions
        </div>
        <div className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            {todaySessions}
        </div>
      </div>
    </div>
  );
};
