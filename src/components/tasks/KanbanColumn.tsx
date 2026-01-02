/**
 * @fileoverview Kanban column component for board view
 * 
 * Represents a single column in the Kanban board containing a list of tasks.
 * 
 * @module components/tasks/KanbanColumn
 */

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { TaskCard } from './TaskCard';
import type { Task } from '../../types';

interface KanbanColumnProps {
    title: string;
    tasks: Task[];
    status: 'todo' | 'in-progress' | 'done';
    color: string;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onAddClick?: () => void;
}

export function KanbanColumn({
    title,
    tasks,
    status,
    color,
    onToggle,
    onDelete,
    onAddClick,
}: KanbanColumnProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col bg-zen-surface/50 rounded-zen-lg border border-zen-border min-h-[400px]"
        >
            {/* Column Header */}
            <div className="flex items-center justify-between p-4 border-b border-zen-border">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <h3 className="font-semibold text-zen-text">{title}</h3>
                    <span className="text-xs text-zen-text-muted bg-zen-surface px-2 py-0.5 rounded-full">
                        {tasks.length}
                    </span>
                </div>
                {status === 'todo' && onAddClick && (
                    <button
                        onClick={onAddClick}
                        className="p-1.5 text-zen-text-muted hover:text-zen-accent 
                                   hover:bg-zen-surface rounded-md transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                )}
            </div>

            {/* Tasks */}
            <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                {tasks.map((task, index) => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <TaskCard
                            task={task}
                            onToggle={onToggle}
                            onDelete={onDelete}
                            isDraggable={false}
                        />
                    </motion.div>
                ))}

                {tasks.length === 0 && (
                    <div className="flex items-center justify-center h-24 text-zen-text-muted text-sm">
                        No tasks
                    </div>
                )}
            </div>
        </motion.div>
    );
}
