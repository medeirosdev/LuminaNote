/**
 * @fileoverview Calendar view component for task visualization
 * 
 * Displays tasks on a monthly calendar grid based on their due dates.
 * Provides month navigation and task interaction.
 * 
 * @module components/tasks/CalendarView
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { CalendarDay } from './CalendarDay';
import type { Task } from '../../types';

interface CalendarViewProps {
    tasks: Task[];
    onTaskToggle: (id: string) => void;
    onAddTask?: (dueDate: string) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Gets all days to display in a month grid (including padding days from adjacent months)
 */
function getCalendarDays(year: number, month: number): Date[] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // Add padding days from previous month
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
        days.push(new Date(year, month, -i));
    }

    // Add all days of current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
        days.push(new Date(year, month, d));
    }

    // Add padding days from next month to complete the grid
    const endPadding = 42 - days.length; // 6 rows x 7 days
    for (let i = 1; i <= endPadding; i++) {
        days.push(new Date(year, month + 1, i));
    }

    return days;
}

/**
 * Formats a date as YYYY-MM-DD for comparison
 */
function formatDateKey(date: Date): string {
    return date.toISOString().split('T')[0];
}

export function CalendarView({
    tasks,
    onTaskToggle,
    onAddTask,
}: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const calendarDays = useMemo(() => getCalendarDays(year, month), [year, month]);

    // Group tasks by their due date
    const tasksByDate = useMemo(() => {
        const map = new Map<string, Task[]>();
        tasks.forEach(task => {
            if (task.dueDate) {
                const key = task.dueDate.split('T')[0];
                const existing = map.get(key) || [];
                map.set(key, [...existing, task]);
            }
        });
        return map;
    }, [tasks]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const handleAddTask = (date: Date) => {
        onAddTask?.(date.toISOString().split('T')[0]);
    };

    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zen-card rounded-zen-lg border border-zen-border shadow-zen-sm overflow-hidden"
        >
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-zen-border">
                <div className="flex items-center gap-3">
                    <CalendarIcon size={20} className="text-zen-accent" />
                    <h2 className="text-lg font-semibold text-zen-text">{monthName}</h2>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={goToToday}
                        className="text-xs px-3 py-1.5 rounded-md bg-zen-surface text-zen-text-secondary
                                   hover:bg-zen-border transition-colors"
                    >
                        Today
                    </button>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={goToPreviousMonth}
                            className="p-1.5 rounded-md text-zen-text-muted hover:text-zen-text
                                       hover:bg-zen-surface transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={goToNextMonth}
                            className="p-1.5 rounded-md text-zen-text-muted hover:text-zen-text
                                       hover:bg-zen-surface transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-zen-border">
                {WEEKDAYS.map((day) => (
                    <div key={day} className="py-2 text-center text-xs font-medium text-zen-text-muted">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-zen-border p-px">
                {calendarDays.map((date, index) => {
                    const dateKey = formatDateKey(date);
                    const dayTasks = tasksByDate.get(dateKey) || [];
                    const isCurrentMonth = date.getMonth() === month;
                    const isToday = date.getTime() === today.getTime();

                    return (
                        <CalendarDay
                            key={index}
                            date={date}
                            tasks={dayTasks}
                            isCurrentMonth={isCurrentMonth}
                            isToday={isToday}
                            onTaskToggle={onTaskToggle}
                            onAddTask={handleAddTask}
                        />
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 p-3 border-t border-zen-border text-xs text-zen-text-muted">
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-priority-low" /> Low
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-priority-medium" /> Medium
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-priority-high" /> High
                </span>
            </div>
        </motion.div>
    );
}
