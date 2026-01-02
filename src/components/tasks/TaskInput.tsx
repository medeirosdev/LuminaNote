import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar } from 'lucide-react';
import type { Task } from '../../types';

interface TaskInputProps {
    category: Task['category'];
    onAdd: (title: string, category: Task['category'], options?: {
        priority?: Task['priority'];
        projectId?: string;
        dueDate?: string;
    }) => void;
}

export function TaskInput({ category, onAdd }: TaskInputProps) {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onAdd(title.trim(), category, {
                priority: 'medium',
                dueDate: dueDate || undefined,
            });
            setTitle('');
            setDueDate('');
            setIsExpanded(false);
        }
    };

    return (
        <motion.div
            initial={false}
            animate={{ height: isExpanded ? 'auto' : 44 }}
            className="overflow-hidden"
        >
            {!isExpanded ? (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="w-full flex items-center gap-2 p-3 rounded-zen border border-dashed border-zen-border
                     text-zen-text-muted hover:text-zen-text hover:border-zen-accent/30
                     transition-colors duration-200"
                >
                    <Plus size={16} />
                    <span className="text-sm">Add task</span>
                </button>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        autoFocus
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What needs to be done?"
                        className="w-full px-3 py-2.5 rounded-zen border border-zen-border bg-zen-card
                       text-sm text-zen-text placeholder:text-zen-text-muted
                       focus:outline-none focus:border-zen-accent focus:ring-1 focus:ring-zen-accent/20
                       transition-all duration-200"
                    />

                    {/* Due Date Input */}
                    <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zen-text-muted" />
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 rounded-zen border border-zen-border bg-zen-card
                           text-sm text-zen-text
                           focus:outline-none focus:border-zen-accent focus:ring-1 focus:ring-zen-accent/20
                           transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={!title.trim()}
                            className="flex-1 py-2 px-3 rounded-zen bg-zen-accent text-white text-sm font-medium
                         hover:bg-zen-accent/90 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-200"
                        >
                            Add
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsExpanded(false);
                                setTitle('');
                                setDueDate('');
                            }}
                            className="py-2 px-3 rounded-zen text-zen-text-secondary text-sm
                         hover:bg-zen-surface transition-colors duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </motion.div>
    );
}
