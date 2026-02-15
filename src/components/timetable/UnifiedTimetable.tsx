import React, { useState, useRef, useMemo, useEffect } from "react";
import { useStore } from "../../store/useStore";
import { TimetableEntry } from "../../types";
import { UnifiedActivityForm } from "./UnifiedActivityForm";
import { format, addDays, subDays, startOfWeek, isSameDay, parse } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Check } from "lucide-react";
import { cn } from "../../utils/cn";
import { DndContext, DragEndEvent, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors, useDraggable, useDroppable } from "@dnd-kit/core";

// Draggable Item Component
const DraggableEntry = ({ entry, dayStr, onClick, onToggle, isCompleted }: { entry: TimetableEntry; dayStr: string; onClick: (e: React.MouseEvent) => void; onToggle: (e: React.MouseEvent) => void; isCompleted: boolean }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `${entry.id}-${dayStr}`,
        data: { entry, originalDate: dayStr },
    });

    if (isDragging) {
        return (
            <div ref={setNodeRef} className="opacity-30 text-[10px] p-1 rounded text-white truncate shadow-sm relative z-10 flex items-center justify-between gap-1 h-full min-h-[32px]" style={{ backgroundColor: entry.color }}>
                {entry.activity}
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={onClick}
            className={cn("text-[10px] p-1 rounded text-white truncate cursor-grab active:cursor-grabbing hover:opacity-90 shadow-sm relative z-10 flex items-center justify-between gap-1 group/task touch-none h-full min-h-[32px]", isCompleted && "opacity-75")}
            style={{ backgroundColor: entry.color }}
            title={`${entry.category}: ${entry.activity}`}
        >
            <span className={cn("truncate", isCompleted && "line-through pointer-events-none")}>{entry.activity}</span>
            <button onClick={onToggle} className={cn("w-3 h-3 rounded-full border border-white/50 flex items-center justify-center hover:bg-white/20 transition-colors opacity-0 group-hover/task:opacity-100", isCompleted && "bg-white/20 opacity-100")}>
                {isCompleted && <Check className="w-2 h-2 text-white" />}
            </button>
        </div>
    );
};

// Droppable Cell Component
const DroppableCell = ({ id, children, onClick, className }: { id: string; children: React.ReactNode; onClick: () => void; className?: string }) => {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className={cn(className, isOver && "bg-blue-50/50 dark:bg-blue-900/20 ring-2 ring-inset ring-blue-500/50 z-20", "h-full flex flex-col")} onClick={onClick}>
            {children}
        </div>
    );
};

const HOURS = Array.from({ length: 18 }, (_, i) => {
    const hour = i + 4; // Start at 4:00 AM, end at 9:00 PM (4 + 17 = 21)
    return `${hour.toString().padStart(2, "0")}:00`;
});

export const UnifiedTimetable: React.FC = () => {
    const timetable = useStore((state) => state.timetable);
    const addTimetableEntry = useStore((state) => state.addTimetableEntry);
    const updateTimetableEntry = useStore((state) => state.updateTimetableEntry);
    const deleteTimetableEntry = useStore((state) => state.deleteTimetableEntry);
    const toggleTimetableEntryCompletion = useStore((state) => state.toggleTimetableEntryCompletion);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [selectedDayStr, setSelectedDayStr] = useState<string>("");
    const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [activeDragEntry, setActiveDragEntry] = useState<TimetableEntry | null>(null);

    // Update current time every minute for highlighting current hour
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    // Get current hour in HH:mm format
    const currentHourSlot = useMemo(() => {
        const hour = currentTime.getHours();
        return `${hour.toString().padStart(2, "0")}:00`;
    }, [currentTime]);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 8, // Require movement of 8px before drag starts to prevent accidental drags on click
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250, // Require hold of 250ms for touch devices
                tolerance: 5,
            },
        }),
    );

    const dateStr = format(selectedDate, "yyyy-MM-dd");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDragStart = (event: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { active } = event;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        setActiveDragEntry(active.data.current?.entry || null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragEntry(null);

        if (!over) return;

        // active.id is "entryID-originalDate"
        // over.id is "timeSlot|targetDate"

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const entry = active.data.current?.entry as TimetableEntry;
        const [targetTime, targetDate] = (over.id as string).split("|");

        if (entry && targetTime && targetDate) {
            // Update the entry
            const updatedEntry: TimetableEntry = {
                ...entry,
                timeSlot: targetTime,
                date: targetDate,
                // If moving a one-time task, date updates automatically
                // If moving a recurring task, we need to decide if we change the pattern
                // For now, let's assume dragging changes the "base" pattern
            };

            updateTimetableEntry(entry.id, updatedEntry);
        }
    };

    const displayHours = useMemo(() => {
        // Return hours in natural chronological order (morning to night)
        return HOURS;
    }, []);

    // Weekly View Data
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    const handleAdd = (time: string, date?: string) => {
        setSelectedTime(time);
        const targetDate = date || dateStr;
        setSelectedDayStr(targetDate);
        if (date && date !== dateStr) {
            setSelectedDate(new Date(date));
        }
        setEditingEntry(null);
        setIsFormOpen(true);
    };

    const calculateMaxHours = (startTime: string): number => {
        const startHour = parseInt(startTime.split(":")[0]);
        const endHour = 21; // 9 PM
        return Math.max(1, endHour - startHour + 1);
    };

    const getConflictingSlots = (startTime: string, duration: number, dayStr: string): string[] => {
        const startHour = parseInt(startTime.split(":")[0]);
        const conflicts: string[] = [];

        for (let i = 0; i < duration; i++) {
            const hour = startHour + i;
            if (hour > 21) break; // Don't check beyond 9 PM

            const timeSlot = `${hour.toString().padStart(2, "0")}:00`;
            // Check if there's an entry for this exact date and time slot
            const hasEntry = timetable.some((entry) => {
                return entry.timeSlot === timeSlot && entry.date === dayStr;
            });

            if (hasEntry) {
                conflicts.push(format(parse(timeSlot, "HH:mm", new Date()), "h:mm a"));
            }
        }

        return conflicts;
    };

    const handleMultiSubmit = (entries: TimetableEntry[]) => {
        entries.forEach((entry) => addTimetableEntry(entry));
        setIsFormOpen(false);
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

    const handlePrev = () => {
        setSelectedDate(subDays(selectedDate, 7));
    };

    const handleNext = () => {
        setSelectedDate(addDays(selectedDate, 7));
    };

    // Check if a time slot is the current hour on today
    const isCurrentHour = (day: Date, timeSlot: string) => {
        return isSameDay(day, currentTime) && timeSlot === currentHourSlot;
    };

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800">
                    <div className="flex items-center gap-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-blue-500" />
                            Timetable
                        </h3>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={handlePrev} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-500" />
                        </button>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 min-w-[140px] text-center">{`${format(weekStart, "MMM d")} - ${format(addDays(weekStart, 6), "MMM d")}`}</span>
                        <button onClick={handleNext} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-gray-800">
                    <div className="min-w-[800px] min-h-full flex flex-col">
                        {/* Weekly Grid Header */}
                        <div className="grid grid-cols-8 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10 shadow-sm flex-shrink-0">
                            <div className="p-2 border-r dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"></div>
                            {weekDays.map((day) => (
                                <div key={day.toString()} className={cn("p-2 text-center border-r dark:border-gray-700 last:border-r-0 bg-gray-50 dark:bg-gray-900/50", isSameDay(day, new Date()) && "bg-blue-50 dark:bg-blue-900/20")}>
                                    <div className="text-xs font-semibold text-gray-500 uppercase">{format(day, "EEE")}</div>
                                    <div className={cn("text-sm font-bold", isSameDay(day, new Date()) ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white")}>{format(day, "d")}</div>
                                </div>
                            ))}
                        </div>

                        {/* Weekly Grid Body */}
                        <div className="flex-1 flex flex-col divide-y dark:divide-gray-700">
                            {displayHours.map((time) => {
                                // Check if this is the current hour row
                                const isCurrentRow = weekDays.some((day) => isCurrentHour(day, time));

                                return (
                                    <div key={time} id={`time-slot-${time}`} className={cn("grid grid-cols-8 flex-shrink-0 group/row items-stretch transition-colors", isCurrentRow && "bg-blue-50/30 dark:bg-blue-900/10")}>
                                        {/* Time Column */}
                                        <div
                                            className={cn(
                                                "p-2 text-xs text-right border-r dark:border-gray-700 font-medium sticky left-0 flex items-center justify-end h-auto",
                                                isCurrentRow ? "text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-900/20" : "text-gray-500 bg-white dark:bg-gray-800",
                                            )}
                                        >
                                            {format(parse(time, "HH:mm", new Date()), "h:mm a")}
                                        </div>

                                        {/* Days Columns */}
                                        {weekDays.map((day) => {
                                            const dayStr = format(day, "yyyy-MM-dd");
                                            const isCurrent = isCurrentHour(day, time);

                                            // Filter entries by exact date and time slot
                                            const entries = timetable.filter((e) => {
                                                return e.timeSlot === time && e.date === dayStr;
                                            });

                                            return (
                                                <DroppableCell
                                                    key={dayStr}
                                                    id={`${time}|${dayStr}`}
                                                    className={cn(
                                                        "border-r dark:border-gray-700 last:border-r-0 p-1 relative group transition-colors flex-1",
                                                        isCurrent && "bg-blue-50/50 dark:bg-blue-900/20 ring-1 ring-inset ring-blue-200 dark:ring-blue-800",
                                                        !isCurrent && "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                                                    )}
                                                    onClick={() => handleAdd(time, dayStr)}
                                                >
                                                    <div className="flex flex-col gap-1 h-full relative flex-1">
                                                        {entries.length === 0 && (
                                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <div className="bg-blue-500/10 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400 p-1 rounded-full">
                                                                    <Plus className="w-4 h-4" />
                                                                </div>
                                                            </div>
                                                        )}
                                                        {entries.map((entry) => {
                                                            // All entries now use the completed field directly (no legacy logic)
                                                            const isCompleted = entry.completed;

                                                            return (
                                                                <DraggableEntry
                                                                    key={`${entry.id}-${dayStr}`}
                                                                    entry={entry}
                                                                    dayStr={dayStr}
                                                                    isCompleted={!!isCompleted}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEdit(entry);
                                                                    }}
                                                                    onToggle={(e) => {
                                                                        e.stopPropagation();
                                                                        // All entries are independent, no date parameter needed
                                                                        toggleTimetableEntryCompletion(entry.id);
                                                                    }}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                </DroppableCell>
                                            );
                                        })}
                                    </div>
                                );
                            })}

                            {/* Filler Area to extend grid lines to bottom */}
                            <div className="flex-1 grid grid-cols-8 min-h-0 bg-white dark:bg-gray-800">
                                {/* Time Column Filler */}
                                <div className="border-r dark:border-gray-700 sticky left-0 bg-white dark:bg-gray-800"></div>
                                {/* Days Filler */}
                                {weekDays.map((day) => (
                                    <div key={`filler-${day.toString()}`} className="border-r dark:border-gray-700 last:border-r-0"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {isFormOpen && (
                    <UnifiedActivityForm
                        timeSlot={selectedTime}
                        date={selectedDayStr || format(selectedDate, "yyyy-MM-dd")}
                        initialData={editingEntry}
                        onSubmit={handleSave}
                        onDelete={handleDelete}
                        onClose={() => setIsFormOpen(false)}
                        onMultiSubmit={handleMultiSubmit}
                        maxHours={calculateMaxHours(selectedTime)}
                        getConflicts={(duration) => getConflictingSlots(selectedTime, duration, selectedDayStr)}
                    />
                )}

                <DragOverlay>
                    {activeDragEntry ? (
                        <div className="text-[10px] p-1 rounded text-white truncate shadow-lg relative z-50 flex items-center justify-between gap-1 opacity-90 cursor-grabbing" style={{ backgroundColor: activeDragEntry.color, width: "100px" }}>
                            <span className="truncate">{activeDragEntry.activity}</span>
                        </div>
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
};
