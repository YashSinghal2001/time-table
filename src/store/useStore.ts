import { create } from "zustand";
import { AppData, Task, TimetableEntry, AppSettings, TaskStatus, Category } from "../types";
import { loadData, saveTasks, saveTimetable, saveSettings, saveNotes, saveInitializedWeeks } from "../utils/localStorage";
import { format, parseISO, startOfWeek, addDays, differenceInCalendarDays } from "date-fns";
import { v4 as uuidv4 } from "uuid";

interface AppState extends AppData {
    addTask: (task: Task) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    toggleTaskCompletion: (id: string) => void;

    addTimetableEntry: (entry: TimetableEntry) => void;
    updateTimetableEntry: (id: string, updates: Partial<TimetableEntry>) => void;
    deleteTimetableEntry: (id: string) => void;
    toggleTimetableEntryCompletion: (id: string) => void;

    initializeWeek: (weekStartDate: string) => void;

    updateSettings: (updates: Partial<AppSettings>) => void;

    setNotes: (notes: string) => void;
}

const initialData = loadData();

export const useStore = create<AppState>((set, get) => ({
    ...initialData,

    addTask: (task) =>
        set((state) => {
            const newTasks = [...state.tasks, task];
            saveTasks(newTasks);
            return { tasks: newTasks };
        }),

    updateTask: (id, updates) =>
        set((state) => {
            const newTasks = state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
            saveTasks(newTasks);
            return { tasks: newTasks };
        }),

    deleteTask: (id) =>
        set((state) => {
            const newTasks = state.tasks.filter((t) => t.id !== id);
            saveTasks(newTasks);
            return { tasks: newTasks };
        }),

    toggleTaskCompletion: (id) =>
        set((state) => {
            const newTasks = state.tasks.map((t) => {
                if (t.id === id) {
                    const isCompleted = t.status === "pending";
                    const newStatus: TaskStatus = isCompleted ? "completed" : "pending";
                    return {
                        ...t,
                        status: newStatus,
                        completedAt: isCompleted ? new Date().toISOString() : null,
                    };
                }
                return t;
            });
            saveTasks(newTasks);
            return { tasks: newTasks };
        }),

    addTimetableEntry: (entry) =>
        set((state) => {
            const newTimetable = [...state.timetable, entry];
            saveTimetable(newTimetable);
            return { timetable: newTimetable };
        }),

    updateTimetableEntry: (id, updates) =>
        set((state) => {
            const newTimetable = state.timetable.map((t) => (t.id === id ? { ...t, ...updates } : t));
            saveTimetable(newTimetable);
            return { timetable: newTimetable };
        }),

    deleteTimetableEntry: (id) =>
        set((state) => {
            const newTimetable = state.timetable.filter((t) => t.id !== id);
            saveTimetable(newTimetable);
            return { timetable: newTimetable };
        }),

    toggleTimetableEntryCompletion: (id: string) =>
        set((state) => {
            const newTimetable = state.timetable.map((t) => {
                if (t.id === id) {
                    // All entries are independent with their own completion status
                    return { ...t, completed: !t.completed };
                }
                return t;
            });
            saveTimetable(newTimetable);
            return { timetable: newTimetable };
        }),

    initializeWeek: (weekStartDate: string) => {
        const state = get();
        // If already initialized, do nothing
        if (state.initializedWeeks.includes(weekStartDate)) {
            return;
        }

        // Check if there are already entries for this week (safety check)
        const hasEntries = state.timetable.some((t) => {
            const entryWeekStart = format(startOfWeek(parseISO(t.date), { weekStartsOn: 1 }), "yyyy-MM-dd");
            return entryWeekStart === weekStartDate;
        });

        if (hasEntries) {
            // Mark as initialized and return
            const newInitializedWeeks = [...state.initializedWeeks, weekStartDate];
            saveInitializedWeeks(newInitializedWeeks);
            set({ initializedWeeks: newInitializedWeeks });
            return;
        }

        // Find the most recent previous week with data
        // 1. Group existing entries by week
        const weeksWithData = new Set<string>();
        state.timetable.forEach((t) => {
            const weekStart = format(startOfWeek(parseISO(t.date), { weekStartsOn: 1 }), "yyyy-MM-dd");
            weeksWithData.add(weekStart);
        });

        // 2. Sort weeks descending and find first one before current week
        const sortedWeeks = Array.from(weeksWithData).sort().reverse();
        const previousWeek = sortedWeeks.find((w) => w < weekStartDate);

        let newEntries: TimetableEntry[] = [];

        if (previousWeek) {
            // Copy from previous week
            const previousEntries = state.timetable.filter((t) => {
                const weekStart = format(startOfWeek(parseISO(t.date), { weekStartsOn: 1 }), "yyyy-MM-dd");
                return weekStart === previousWeek;
            });

            newEntries = previousEntries.map((entry) => {
                const oldDate = parseISO(entry.date);
                const oldWeekStart = parseISO(previousWeek);
                const dayOffset = differenceInCalendarDays(oldDate, oldWeekStart);
                const newDate = addDays(parseISO(weekStartDate), dayOffset);

                return {
                    ...entry,
                    id: uuidv4(),
                    date: format(newDate, "yyyy-MM-dd"),
                    weekId: weekStartDate,
                    completed: false, // Reset completion status
                };
            });
        } else {
            // Use default template if no history exists
            // Create a basic M-F 9-5 structure as a starting point
            const weekStart = parseISO(weekStartDate);
            const days = [0, 1, 2, 3, 4]; // Mon-Fri (offset from start which is Mon)
            const defaultActivities = [
                { timeSlot: "09:00", activity: "Deep Work", category: "work" as Category, color: "bg-blue-500" },
                { timeSlot: "12:00", activity: "Lunch Break", category: "break" as Category, color: "bg-green-500" },
                { timeSlot: "14:00", activity: "Meetings/Email", category: "work" as Category, color: "bg-purple-500" },
            ];

            days.forEach((dayOffset) => {
                const date = addDays(weekStart, dayOffset);
                defaultActivities.forEach((activity) => {
                    newEntries.push({
                        id: uuidv4(),
                        date: format(date, "yyyy-MM-dd"),
                        weekId: weekStartDate,
                        timeSlot: activity.timeSlot,
                        activity: activity.activity,
                        category: activity.category,
                        color: activity.color,
                        completed: false,
                    });
                });
            });
        }

        if (newEntries.length > 0) {
            const newTimetable = [...state.timetable, ...newEntries];
            const newInitializedWeeks = [...state.initializedWeeks, weekStartDate];

            saveTimetable(newTimetable);
            saveInitializedWeeks(newInitializedWeeks);

            set({
                timetable: newTimetable,
                initializedWeeks: newInitializedWeeks,
            });
        } else {
            // Even if we didn't add entries (e.g. empty previous week), mark as initialized
            const newInitializedWeeks = [...state.initializedWeeks, weekStartDate];
            saveInitializedWeeks(newInitializedWeeks);
            set({ initializedWeeks: newInitializedWeeks });
        }
    },

    updateSettings: (updates) =>
        set((state) => {
            const newSettings = { ...state.settings, ...updates };
            saveSettings(newSettings);
            return { settings: newSettings };
        }),

    setNotes: (notes) =>
        set(() => {
            saveNotes(notes);
            return { notes };
        }),
}));
