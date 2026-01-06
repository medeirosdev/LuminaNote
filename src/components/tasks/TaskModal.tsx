/**
 * @fileoverview Task Modal Component
 * 
 * Unified modal for creating and editing tasks - title, date, time, priority, and recurring status.
 * 
 * @module components/tasks/TaskModal
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Repeat, Plus } from 'lucide-react';
import type { Task } from '../../types';

type TaskModalMode = 'add' | 'edit';

interface TaskModalProps {
    /** Task to edit (null for add mode) */
    task?: Task | null;
    /** Whether modal is open */
    isOpen: boolean;
    /** Category for new tasks */
    category?: Task['category'];
    /** Close handler */
    onClose: () => void;
    /** Save handler for edit mode */
    onSave?: (id: string, updates: Partial<Task>) => void;
    /** Add handler for add mode */
    onAdd?: (title: string, category: Task['category'], options?: {
        priority?: Task['priority'];
        dueDate?: string;
        dueTime?: string;
        isRecurring?: boolean;
    }) => void;
}

export function TaskModal({
    task,
    isOpen,
    category = 'today',
    onClose,
    onSave,
    onAdd
}: TaskModalProps) {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [priority, setPriority] = useState<Task['priority']>('medium');
    const [isRecurring, setIsRecurring] = useState(false);

    const mode: TaskModalMode = task ? 'edit' : 'add';

    // Sync state when task changes (edit mode)
    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDueDate(task.dueDate || '');
            setDueTime(task.dueTime || '');
            setPriority(task.priority);
            setIsRecurring(task.isRecurring || false);
        } else {
            // Reset for add mode
            setTitle('');
            setDueDate('');
            setDueTime('');
            setPriority('medium');
            setIsRecurring(false);
        }
    }, [task, isOpen]);

    const handleSubmit = () => {
        if (!title.trim()) return;

        if (mode === 'edit' && task && onSave) {
            onSave(task.id, {
                title: title.trim(),
                dueDate: dueDate || undefined,
                dueTime: dueTime || undefined,
                priority,
                isRecurring,
            });
        } else if (mode === 'add' && onAdd) {
            onAdd(title.trim(), category, {
                priority,
                dueDate: dueDate || undefined,
                dueTime: dueTime || undefined,
                isRecurring,
            });
        }
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'Enter' && e.ctrlKey) {
            handleSubmit();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        onKeyDown={handleKeyDown}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                            w-full max-w-md bg-zen-card rounded-xl border border-zen-border 
                            shadow-zen-lg p-6"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-zen-text">
                                {mode === 'add' ? 'New Task' : 'Edit Task'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-md text-zen-text-muted hover:text-zen-text 
                                    hover:bg-zen-surface transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-zen-text-secondary mb-1.5">
                                    Title
                                </label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-zen border border-zen-border bg-zen-bg
                                        text-sm text-zen-text placeholder:text-zen-text-muted
                                        focus:outline-none focus:border-zen-accent focus:ring-1 focus:ring-zen-accent/20
                                        transition-all duration-200"
                                    placeholder="What needs to be done?"
                                />
                            </div>

                            {/* Date and Time */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-zen-text-secondary mb-1.5">
                                        Due Date
                                    </label>
                                    <div className="relative">
                                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zen-text-muted" />
                                        <input
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 rounded-zen border border-zen-border bg-zen-bg
                                                text-sm text-zen-text
                                                focus:outline-none focus:border-zen-accent focus:ring-1 focus:ring-zen-accent/20
                                                transition-all duration-200"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zen-text-secondary mb-1.5">
                                        Time
                                    </label>
                                    <div className="relative">
                                        <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zen-text-muted" />
                                        <input
                                            type="time"
                                            value={dueTime}
                                            onChange={(e) => setDueTime(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 rounded-zen border border-zen-border bg-zen-bg
                                                text-sm text-zen-text
                                                focus:outline-none focus:border-zen-accent focus:ring-1 focus:ring-zen-accent/20
                                                transition-all duration-200"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-zen-text-secondary mb-1.5">
                                    Priority
                                </label>
                                <div className="flex gap-2">
                                    {(['low', 'medium', 'high'] as const).map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPriority(p)}
                                            className={`flex-1 py-2 px-3 rounded-zen border text-sm font-medium capitalize
                                                transition-all duration-200 ${priority === p
                                                    ? p === 'high'
                                                        ? 'border-priority-high bg-priority-high/10 text-priority-high'
                                                        : p === 'medium'
                                                            ? 'border-priority-medium bg-priority-medium/10 text-priority-medium'
                                                            : 'border-priority-low bg-priority-low/10 text-priority-low'
                                                    : 'border-zen-border text-zen-text-muted hover:border-zen-accent/30'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Recurring Toggle */}
                            <button
                                type="button"
                                onClick={() => setIsRecurring(!isRecurring)}
                                className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-zen border text-sm 
                                    transition-all duration-200 ${isRecurring
                                        ? 'border-zen-sage bg-zen-sage/10 text-zen-sage'
                                        : 'border-zen-border text-zen-text-muted hover:border-zen-accent/30'
                                    }`}
                            >
                                <Repeat size={14} />
                                <span>Daily recurring</span>
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={onClose}
                                className="flex-1 py-2.5 px-4 rounded-zen border border-zen-border
                                    text-sm font-medium text-zen-text-secondary
                                    hover:bg-zen-surface transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!title.trim()}
                                className="flex-1 py-2.5 px-4 rounded-zen bg-zen-accent text-white
                                    text-sm font-medium hover:bg-zen-accent/90
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                {mode === 'add' && <Plus size={16} />}
                                {mode === 'add' ? 'Add Task' : 'Save Changes'}
                            </button>
                        </div>

                        {/* Hint */}
                        <p className="text-xs text-zen-text-muted text-center mt-4">
                            Press Ctrl+Enter to {mode === 'add' ? 'add' : 'save'}, Esc to cancel
                        </p>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Re-export TaskEditModal for backwards compatibility
export { TaskModal as TaskEditModal };
