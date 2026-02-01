export type Priority = "high" | "medium" | "low";
export type TaskStatus = "pending" | "completed";
export type Category = "work" | "study" | "break" | "personal";
export type Theme = "light" | "dark";

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: TaskStatus;
    dueDate: string; // ISO date string YYYY-MM-DD
    createdAt: string; // ISO timestamp
    completedAt: string | null; // ISO timestamp
}

export interface TimetableEntry {
    id: string;
    timeSlot: string; // "09:00"
    activity: string;
    category: Category;
    color: string;
    date: string; // YYYY-MM-DD
    completed?: boolean; // Legacy/Single instance status
    repeat?: "daily" | "weekly";
    completedDates?: string[]; // For recurring tasks
}

export interface PomodoroSession {
    id: string;
    date: string; // YYYY-MM-DD
    focusMinutes: number;
    breakMinutes: number;
    completed: boolean;
    completedAt: string; // ISO timestamp
}

export interface AppSettings {
    theme: Theme;
    notifications: boolean;
    pomodoroFocus: number;
    pomodoroBreak: number;
}

export interface AppData {
    tasks: Task[];
    timetable: TimetableEntry[];
    pomodoroSessions: PomodoroSession[];
    settings: AppSettings;
    notes: string;
}

export interface AppState extends AppData {}
