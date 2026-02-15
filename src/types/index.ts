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
    completed?: boolean;
    repeat?: "daily" | "weekly"; // Deprecated: Only for backward compatibility with legacy data
    completedDates?: string[]; // Deprecated: Only for backward compatibility with legacy data
}

export interface AppSettings {
  theme: Theme;
  notifications: boolean;
}

export interface AppData {
  tasks: Task[];
  timetable: TimetableEntry[];
  settings: AppSettings;
  notes: string;
}

export interface AppState extends AppData {}
