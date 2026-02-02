import React, { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import { TimetableEntry } from "../types";
import { TimeSlot } from "../components/timetable/TimeSlot";
import { ActivityForm } from "../components/timetable/ActivityForm";
import { format } from "date-fns";

const HOURS = Array.from({ length: 18 }, (_, i) => {
    const hour = i + 6; // Start at 6:00
    return `${hour.toString().padStart(2, "0")}:00`;
});

export const Timetable: React.FC = () => {
    const timetable = useStore((state) => state.timetable);
    const addTimetableEntry = useStore((state) => state.addTimetableEntry);
    const updateTimetableEntry = useStore((state) => state.updateTimetableEntry);
    const deleteTimetableEntry = useStore((state) => state.deleteTimetableEntry);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
    const [currentHour, setCurrentHour] = useState<string>("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hour = now.getHours();
            setCurrentHour(`${hour.toString().padStart(2, "0")}:00`);
        };

        updateTime();
        const interval = setInterval(updateTime, 60000); // Check every 60 seconds

        return () => clearInterval(interval);
    }, []);

    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const isToday = dateStr === format(new Date(), "yyyy-MM-dd");
    const todayEntries = timetable.filter((entry) => entry.date === dateStr);

    const handleAdd = (time: string) => {
        setSelectedTime(time);
        setEditingEntry(null);
        setIsFormOpen(true);
    };

    const handleEdit = (entry: TimetableEntry) => {
        setSelectedTime(entry.timeSlot);
        setEditingEntry(entry);
        setIsFormOpen(true);
    };

    const handleSave = (entry: TimetableEntry) => {
        if (editingEntry) {
            updateTimetableEntry(entry.id, entry);
        } else {
            addTimetableEntry(entry);
        }
        setIsFormOpen(false);
    };

    const handleDelete = (id: string) => {
        deleteTimetableEntry(id);
        setIsFormOpen(false);
    };

    const handleDrop = (timeSlot: string, entryId: string) => {
        updateTimetableEntry(entryId, { timeSlot });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Timetable</h1>
                <div className="text-gray-500 dark:text-gray-400">{format(selectedDate, "EEEE, MMMM do")}</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="flex border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div className="w-16 md:w-20 p-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider border-r dark:border-gray-700">Time</div>
                    <div className="flex-1 p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Activities</div>
                </div>

                <div className="divide-y dark:divide-gray-800">
                    {HOURS.map((time) => (
                        <TimeSlot key={time} time={time} entries={todayEntries.filter((e) => e.timeSlot === time)} onAdd={handleAdd} onEdit={handleEdit} onDrop={handleDrop} isCurrent={isToday && time === currentHour} />
                    ))}
                </div>
            </div>

            {isFormOpen && <ActivityForm timeSlot={selectedTime} date={dateStr} initialData={editingEntry} onSubmit={handleSave} onDelete={handleDelete} onClose={() => setIsFormOpen(false)} />}
        </div>
    );
};
