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
    timeSlot: string; // "09:00" format (HH:mm)
    activity: string;
    category: Category;
    color: string;
    date: string; // YYYY-MM-DD format
    weekId?: string; // YYYY-MM-DD of the start of the week
    completed?: boolean;
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
  initializedWeeks: string[]; // Track which weeks have been auto-initialized
}
