import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Check, Trash2, Calendar, GripVertical, Repeat, Clock, Pencil } from 'lucide-react';
import type { Task } from '../../types';

interface TaskCardProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit?: (task: Task) => void;
    isDraggable?: boolean;
}


const priorityColors = {
    low: 'bg-priority-low',
    medium: 'bg-priority-medium',
    high: 'bg-priority-high',
};

function formatDueDate(dateString: string, timeString?: string): { text: string; isOverdue: boolean; isToday: boolean } {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let timeText = '';
    if (timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        timeText = ` at ${hour12}:${minutes} ${ampm}`;
    }

    if (diffDays < 0) {
        return { text: 'Overdue' + timeText, isOverdue: true, isToday: false };
    } else if (diffDays === 0) {
        return { text: 'Today' + timeText, isOverdue: false, isToday: true };
    } else if (diffDays === 1) {
        return { text: 'Tomorrow' + timeText, isOverdue: false, isToday: false };
    } else if (diffDays <= 7) {
        return { text: `${diffDays} days` + timeText, isOverdue: false, isToday: false };
    } else {
        return {
            text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + timeText,
            isOverdue: false,
            isToday: false
        };
    }
}


export function TaskCard({ task, onToggle, onDelete, onEdit, isDraggable = false }: TaskCardProps) {
    const dueInfo = task.dueDate ? formatDueDate(task.dueDate, task.dueTime) : null;

    const content = (
        <>
            {/* Drag Handle */}
            {isDraggable && (
                <div className="cursor-grab active:cursor-grabbing text-zen-text-muted hover:text-zen-text transition-colors">
                    <GripVertical size={16} />
                </div>
            )}

            {/* Priority Indicator */}
            <div className={`w-1.5 h-1.5 rounded-full ${priorityColors[task.priority]} shrink-0`} />

            {/* Checkbox */}
            <button
                onClick={() => onToggle(task.id)}
                className={`
          w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0
          transition-all duration-200
          ${task.completed
                        ? 'bg-zen-sage border-zen-sage'
                        : 'border-zen-border hover:border-zen-accent'
                    }
        `}
            >
                <motion.div
                    initial={false}
                    animate={{ scale: task.completed ? 1 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                    <Check size={12} className="text-white" strokeWidth={3} />
                </motion.div>
            </button>

            {/* Task Content */}
            <div className="flex-1 min-w-0">
                <motion.span
                    className={`
            block text-sm transition-all duration-300 truncate
            ${task.completed
                            ? 'text-zen-text-muted line-through'
                            : 'text-zen-text'
                        }
          `}
                >
                    {task.title}
                </motion.span>

                {/* Due Date and Time */}
                {dueInfo && !task.completed && (
                    <div className={`flex items-center gap-1 mt-0.5 text-xs ${dueInfo.isOverdue ? 'text-priority-high' :
                        dueInfo.isToday ? 'text-priority-medium' :
                            'text-zen-text-muted'
                        }`}>
                        {task.dueTime ? <Clock size={10} /> : <Calendar size={10} />}
                        <span>{dueInfo.text}</span>
                    </div>
                )}

                {/* Recurring Indicator */}
                {task.isRecurring && (
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-zen-sage">
                        <Repeat size={10} />
                        <span>Daily</span>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                {/* Edit Button */}
                {onEdit && (
                    <button
                        onClick={() => onEdit(task)}
                        className="p-1.5 rounded-md text-zen-text-muted hover:text-zen-accent hover:bg-zen-accent/10
                           transition-all duration-200"
                    >
                        <Pencil size={14} />
                    </button>
                )}

                {/* Delete Button */}
                <button
                    onClick={() => onDelete(task.id)}
                    className="p-1.5 rounded-md text-zen-text-muted hover:text-priority-high hover:bg-priority-high/10
                       transition-all duration-200"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </>
    );

    if (isDraggable) {
        return (
            <Reorder.Item
                value={task}
                id={task.id}
                className="group flex items-center gap-3 p-3 bg-zen-card rounded-zen border border-zen-border
                   hover:border-zen-accent/20 hover:shadow-zen-sm transition-all duration-200"
            >
                {content}
            </Reorder.Item>
        );
    }

    return (
        <AnimatePresence mode="popLayout">
            <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="group flex items-center gap-3 p-3 bg-zen-card rounded-zen border border-zen-border
                   hover:border-zen-accent/20 hover:shadow-zen-sm transition-all duration-200"
            >
                {content}
            </motion.div>
        </AnimatePresence>
    );
}
