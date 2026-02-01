import { create } from 'zustand';
import { AppData, Task, TimetableEntry, PomodoroSession, AppSettings, Priority, Category, TaskStatus } from '../types';
import { loadData, saveTasks, saveTimetable, savePomodoroSessions, saveSettings, saveNotes } from '../utils/localStorage';

interface AppState extends AppData {
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  
  addTimetableEntry: (entry: TimetableEntry) => void;
  updateTimetableEntry: (id: string, updates: Partial<TimetableEntry>) => void;
  deleteTimetableEntry: (id: string) => void;
  toggleTimetableEntryCompletion: (id: string, date?: string) => void;
  
  addPomodoroSession: (session: PomodoroSession) => void;
  
  updateSettings: (updates: Partial<AppSettings>) => void;
  
  setNotes: (notes: string) => void;
}

const initialData = loadData();

// Ensure legacy tasks get migrated to weekly if they have no repeat status
const migratedData = {
  ...initialData,
  timetable: initialData.timetable.map(t => ({
    ...t,
    repeat: t.repeat && t.repeat !== 'none' ? t.repeat : 'weekly'
  }))
};

export const useStore = create<AppState>((set) => ({
  ...migratedData,
  
  addTask: (task) => set((state) => {
    const newTasks = [...state.tasks, task];
    saveTasks(newTasks);
    return { tasks: newTasks };
  }),
  
  updateTask: (id, updates) => set((state) => {
    const newTasks = state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
    saveTasks(newTasks);
    return { tasks: newTasks };
  }),
  
  deleteTask: (id) => set((state) => {
    const newTasks = state.tasks.filter((t) => t.id !== id);
    saveTasks(newTasks);
    return { tasks: newTasks };
  }),

  toggleTaskCompletion: (id) => set((state) => {
    const newTasks = state.tasks.map((t) => {
        if (t.id === id) {
            const isCompleted = t.status === 'pending';
            const newStatus: TaskStatus = isCompleted ? 'completed' : 'pending';
            return {
                ...t,
                status: newStatus,
                completedAt: isCompleted ? new Date().toISOString() : null
            };
        }
        return t;
    });
    saveTasks(newTasks);
    return { tasks: newTasks };
  }),
  
  addTimetableEntry: (entry) => set((state) => {
    const newTimetable = [...state.timetable, entry];
    saveTimetable(newTimetable);
    return { timetable: newTimetable };
  }),
  
  updateTimetableEntry: (id, updates) => set((state) => {
    const newTimetable = state.timetable.map((t) => (t.id === id ? { ...t, ...updates } : t));
    saveTimetable(newTimetable);
    return { timetable: newTimetable };
  }),
  
  deleteTimetableEntry: (id) => set((state) => {
    const newTimetable = state.timetable.filter((t) => t.id !== id);
    saveTimetable(newTimetable);
    return { timetable: newTimetable };
  }),

  toggleTimetableEntryCompletion: (id: string, date?: string) => set((state) => {
    const newTimetable = state.timetable.map((t) => {
        if (t.id === id) {
            // Handle recurring tasks if date is provided and repeat is set
            if (t.repeat && t.repeat !== 'none' && date) {
                const completedDates = t.completedDates || [];
                const isCompleted = completedDates.includes(date);
                return {
                    ...t,
                    completedDates: isCompleted 
                        ? completedDates.filter(d => d !== date)
                        : [...completedDates, date]
                };
            }
            // Handle single tasks or fallback
            return { ...t, completed: !t.completed };
        }
        return t;
    });
    saveTimetable(newTimetable);
    return { timetable: newTimetable };
  }),
  
  addPomodoroSession: (session) => set((state) => {
    const newSessions = [...state.pomodoroSessions, session];
    savePomodoroSessions(newSessions);
    return { pomodoroSessions: newSessions };
  }),
  
  updateSettings: (updates) => set((state) => {
    const newSettings = { ...state.settings, ...updates };
    saveSettings(newSettings);
    return { settings: newSettings };
  }),
  
  setNotes: (notes) => set(() => {
    saveNotes(notes);
    return { notes };
  }),
}));
