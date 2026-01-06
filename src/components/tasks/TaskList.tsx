import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Plus } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import type { Task } from '../../types';

interface TaskListProps {
    title: string;
    tasks: Task[];
    category: Task['category'];
    onAdd: (title: string, category: Task['category'], options?: {
        priority?: Task['priority'];
        projectId?: string;
        dueDate?: string;
        dueTime?: string;
        isRecurring?: boolean;
    }) => void;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit?: (task: Task) => void;
    onReorder?: (tasks: Task[]) => void;
    showInput?: boolean;
    enableDragDrop?: boolean;
}

export function TaskList({
    title,
    tasks,
    category,
    onAdd,
    onToggle,
    onDelete,
    onEdit,
    onReorder,
    showInput = true,
    enableDragDrop = false,
}: TaskListProps) {
    const [orderedTasks, setOrderedTasks] = useState(tasks);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;

    // Update local state when props change
    useEffect(() => {
        setOrderedTasks(tasks);
    }, [tasks]);

    const handleReorder = useCallback((newOrder: Task[]) => {
        setOrderedTasks(newOrder);
        onReorder?.(newOrder);
    }, [onReorder]);

    const displayTasks = enableDragDrop ? orderedTasks : tasks;

    return (
        <div className="space-y-4">
            {/* Header */}
            {title && (
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-zen-text">{title}</h3>
                    {totalCount > 0 && (
                        <span className="text-xs text-zen-text-muted bg-zen-surface px-2 py-1 rounded-full">
                            {completedCount}/{totalCount}
                        </span>
                    )}
                </div>
            )}

            {/* Tasks - With or without drag-and-drop */}
            {enableDragDrop && orderedTasks.length > 0 ? (
                <Reorder.Group
                    axis="y"
                    values={orderedTasks}
                    onReorder={handleReorder}
                    className="space-y-2"
                >
                    {orderedTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onToggle={onToggle}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            isDraggable={true}
                        />
                    ))}
                </Reorder.Group>
            ) : (
                <motion.div layout className="space-y-2">
                    <AnimatePresence mode="popLayout">
                        {displayTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggle={onToggle}
                                onDelete={onDelete}
                                onEdit={onEdit}
                                isDraggable={false}
                            />
                        ))}
                    </AnimatePresence>

                    {displayTasks.length === 0 && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-zen-text-muted text-center py-6"
                        >
                            No tasks yet. Add one to get started!
                        </motion.p>
                    )}
                </motion.div>
            )}

            {/* Add Task Button */}
            {showInput && (
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4
                        rounded-zen border border-dashed border-zen-border
                        text-sm text-zen-text-muted
                        hover:border-zen-accent hover:text-zen-accent
                        transition-all duration-200"
                >
                    <Plus size={16} />
                    <span>Add task</span>
                </button>
            )}

            {/* Add Task Modal */}
            <TaskModal
                isOpen={isAddModalOpen}
                category={category}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={onAdd}
            />
        </div>
    );
}
