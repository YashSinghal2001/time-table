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
    
    // DEPRECATED FIELDS - Only for backward compatibility with legacy data
    // New entries should NOT include these fields
    // The 'repeat' field is only used during creation to determine how many entries to create
    // After creation, each day's task is independent with its own unique ID
    repeat?: "daily" | "weekly";
    completedDates?: string[];
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
