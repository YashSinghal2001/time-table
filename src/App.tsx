import React, { useEffect } from "react";
import { TimeDisplay } from "./components/dashboard/TimeDisplay";
import { WeeklyTasksCompleted } from "./components/dashboard/WeeklyTasksCompleted";
import { UnifiedTimetable } from "./components/timetable/UnifiedTimetable";
import { QuickTasks } from "./components/dashboard/QuickTasks";
import { registerCharts } from "./utils/chartConfig";

function App() {
    useEffect(() => {
        registerCharts();
        // Enforce dark mode on mount
        document.documentElement.classList.add("dark");
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-3 font-sans transition-colors duration-200 overflow-hidden flex flex-col gap-3">
            {/* Top Header Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 h-[20vh] min-h-[150px] flex-shrink-0">
                {/* Left Section: Weekly Tasks Completed */}
                <div className="lg:col-span-3 h-full">
                    <WeeklyTasksCompleted />
                </div>

                {/* Right Section: Time & Date (Flip Clock) */}
                <div className="h-full flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent opacity-50" />
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <TimeDisplay />
                    </div>
                </div>
            </div>

            {/* Second Row Layout (2 Sections) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 flex-1 min-h-0">
                {/* Left Section: Timetable (Spans 3 columns ~ 75%) */}
                <div className="lg:col-span-3 h-full min-h-0">
                    <UnifiedTimetable />
                </div>

                {/* Right Section: Productivity Tools (Spans 1 column ~ 25%) */}
                <div className="flex flex-col gap-3 h-full min-h-0">
                    {/* 1. Tasks / Quick Tasks (First) */}
                    <div className="flex-1 min-h-0">
                        <QuickTasks />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
