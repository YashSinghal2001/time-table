import React, { useState, useEffect } from "react";
import { useStore } from "../../store/useStore";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { Play, Pause, RotateCcw, Brain, Coffee } from "lucide-react";
import { cn } from "../../utils/cn";

const FOCUS_MINUTES = 60;
const BREAK_MINUTES = 5;

export const MiniPomodoro: React.FC = () => {
    const { pomodoroSessions, addPomodoroSession, settings } = useStore();
    const [mode, setMode] = useState<"focus" | "break">("focus");
    const focusTime = 60 * 60; // Force 60 minutes default
    const breakTime = (settings?.pomodoroBreak || BREAK_MINUTES) * 60;

    // Initialize with 60 minutes directly
    const [timeLeft, setTimeLeft] = useState(60 * 60);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // Only update if not active to allow resetting
        if (!isActive) {
            setTimeLeft(mode === "focus" ? focusTime : breakTime);
        }
    }, [mode, focusTime, breakTime, isActive]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            handleComplete();
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft]);

    const handleComplete = () => {
        try {
            const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
            audio.play().catch((e) => console.log("Audio play failed", e));
        } catch (e) {
            console.error("Audio error", e);
        }

        if (mode === "focus") {
            addPomodoroSession({
                id: uuidv4(),
                date: format(new Date(), "yyyy-MM-dd"),
                focusMinutes: 60,
                breakMinutes: 0,
                completed: true,
                completedAt: new Date().toISOString(),
            });
            setMode("break");
        } else {
            setMode("focus");
        }
    };

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === "focus" ? focusTime : breakTime);
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const totalTime = mode === "focus" ? focusTime : breakTime;
    const progress = 100 - (timeLeft / totalTime) * 100;

    const todaySessions = pomodoroSessions.filter((s) => s.date === format(new Date(), "yyyy-MM-dd") && s.completed).length;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-2 right-3 text-xs font-semibold text-gray-400">SESSIONS: {todaySessions}</div>

            <div className="relative w-40 h-40 flex items-center justify-center my-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" className="stroke-gray-100 dark:stroke-gray-700 fill-none" strokeWidth="8" />
                    <circle cx="50" cy="50" r="45" className={cn("fill-none transition-all duration-1000 ease-linear", mode === "focus" ? "stroke-blue-500" : "stroke-green-500")} strokeWidth="8" strokeLinecap="round" strokeDasharray={283} strokeDashoffset={283 * (1 - progress / 100)} />
                </svg>
                <div className="absolute flex flex-col items-center">
                    {mode === "focus" ? <Brain className="w-5 h-5 text-blue-500 mb-1" /> : <Coffee className="w-5 h-5 text-green-500 mb-1" />}
                    <div className="text-3xl font-bold text-gray-900 dark:text-white font-mono tabular-nums">
                        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{mode}</div>
                </div>
            </div>

            <div className="flex gap-3 mt-2 w-full px-4">
                <button onClick={toggleTimer} className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
                    {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isActive ? "PAUSE" : "START"}
                </button>
                <button onClick={resetTimer} className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
