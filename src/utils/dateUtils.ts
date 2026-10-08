import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

export const formatDate = (date: Date | string, formatStr: string = 'yyyy-MM-dd'): string => {
  if (typeof date === 'string') {
    return format(parseISO(date), formatStr);
  }
  return format(date, formatStr);
};

export const getWeekDays = (date: Date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
};

export const isToday = (date: Date | string): boolean => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isSameDay(d, new Date());
}
