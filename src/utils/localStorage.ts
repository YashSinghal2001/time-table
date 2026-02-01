import { AppData, Task, TimetableEntry, AppSettings } from '../types';

const STORAGE_KEY = 'productivity_app_data';

const defaultSettings: AppSettings = {
  theme: 'light',
  notifications: true,
};

const defaultData: AppData = {
  tasks: [],
  timetable: [],
  settings: defaultSettings,
  notes: '',
};

export const loadData = (): AppData => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData === null) {
      return defaultData;
    }
    const data = JSON.parse(serializedData);
    // Merge with default settings to ensure new settings are added if missing
    return {
        ...defaultData,
        ...data,
        settings: { ...defaultSettings, ...data.settings }
    };
  } catch (err) {
    console.error('Could not load data from local storage', err);
    return defaultData;
  }
};

export const saveData = (data: AppData): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serializedData);
  } catch (err) {
    console.error('Could not save data to local storage', err);
  }
};

// Helper functions for specific updates
export const saveTasks = (tasks: Task[]) => {
  const data = loadData();
  data.tasks = tasks;
  saveData(data);
};

export const saveTimetable = (timetable: TimetableEntry[]) => {
  const data = loadData();
  data.timetable = timetable;
  saveData(data);
};

export const saveSettings = (settings: AppSettings) => {
  const data = loadData();
  data.settings = settings;
  saveData(data);
};

export const saveNotes = (notes: string) => {
  const data = loadData();
  data.notes = notes;
  saveData(data);
};
