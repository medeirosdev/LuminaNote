/**
 * @fileoverview Kanban board view component
 * 
 * Displays tasks in a 3-column Kanban board layout:
 * - To Do: Incomplete tasks
 * - In Progress: Tasks being worked on
 * - Done: Completed tasks
 * 
 * @module components/tasks/KanbanBoard
 */

import { motion } from 'framer-motion';
import { KanbanColumn } from './KanbanColumn';
import type { Task } from '../../types';

interface KanbanBoardProps {
    tasks: Task[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onAddClick?: () => void;
}

export function KanbanBoard({
    tasks,
    onToggle,
    onDelete,
    onAddClick,
}: KanbanBoardProps) {
    // Separate tasks by completion status
    const todoTasks = tasks.filter(t => !t.completed && t.priority !== 'high');
    const inProgressTasks = tasks.filter(t => !t.completed && t.priority === 'high');
    const doneTasks = tasks.filter(t => t.completed);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
            <KanbanColumn
                title="To Do"
                tasks={todoTasks}
                status="todo"
                color="bg-zen-text-muted"
                onToggle={onToggle}
                onDelete={onDelete}
                onAddClick={onAddClick}
            />

            <KanbanColumn
                title="In Progress"
                tasks={inProgressTasks}
                status="in-progress"
                color="bg-priority-medium"
                onToggle={onToggle}
                onDelete={onDelete}
            />

            <KanbanColumn
                title="Done"
                tasks={doneTasks}
                status="done"
                color="bg-zen-sage"
                onToggle={onToggle}
                onDelete={onDelete}
            />
        </motion.div>
    );
}
