/**
 * @fileoverview Calendar day cell component
 * 
 * Represents a single day in the calendar grid with tasks.
 * 
 * @module components/tasks/CalendarDay
 */

import { motion } from 'framer-motion';
import type { Task } from '../../types';

interface CalendarDayProps {
    date: Date;
    tasks: Task[];
    isCurrentMonth: boolean;
    isToday: boolean;
    onTaskToggle: (id: string) => void;
    onAddTask?: (date: Date) => void;
}

const priorityDotColors = {
    low: 'bg-priority-low',
    medium: 'bg-priority-medium',
    high: 'bg-priority-high',
};

export function CalendarDay({
    date,
    tasks,
    isCurrentMonth,
    isToday,
    onTaskToggle,
    onAddTask,
}: CalendarDayProps) {
    const dayNumber = date.getDate();
    const maxVisibleTasks = 3;
    const visibleTasks = tasks.slice(0, maxVisibleTasks);
    const remainingCount = tasks.length - maxVisibleTasks;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => onAddTask?.(date)}
            className={`
                min-h-[100px] p-2 border border-zen-border rounded-zen cursor-pointer
                transition-all duration-200 hover:border-zen-accent/40 hover:shadow-zen-sm
                ${isCurrentMonth ? 'bg-zen-card' : 'bg-zen-surface/50'}
                ${isToday ? 'ring-2 ring-zen-accent ring-inset' : ''}
            `}
        >
            {/* Day Number */}
            <div className={`
                text-sm font-medium mb-1
                ${isToday
                    ? 'text-zen-accent'
                    : isCurrentMonth
                        ? 'text-zen-text'
                        : 'text-zen-text-muted'
                }
            `}>
                {dayNumber}
            </div>

            {/* Tasks */}
            <div className="space-y-1">
                {visibleTasks.map((task) => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onTaskToggle(task.id);
                        }}
                        className={`
                            flex items-center gap-1.5 px-1.5 py-0.5 rounded text-xs
                            transition-all cursor-pointer
                            ${task.completed
                                ? 'bg-zen-sage/20 text-zen-text-muted line-through'
                                : 'bg-zen-surface hover:bg-zen-border text-zen-text'
                            }
                        `}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityDotColors[task.priority]}`} />
                        <span className="truncate">{task.title}</span>
                    </motion.div>
                ))}

                {remainingCount > 0 && (
                    <div className="text-xs text-zen-text-muted px-1.5">
                        +{remainingCount} more
                    </div>
                )}
            </div>
        </motion.div>
    );
}
