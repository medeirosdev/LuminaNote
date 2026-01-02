import { motion } from 'framer-motion';
import { TaskList } from '../components/tasks';
import { useTasks } from '../hooks/useTasks';
import { useToast } from '../hooks/useToast';
import type { Task } from '../types';

export function TasksPage() {
    const { todayTasks, weekTasks, backlogTasks, addTask, toggleTask, deleteTask, reorderTasks } = useTasks();
    const { showToast } = useToast();

    const handleAddTask = (title: string, category: Task['category'], options?: { priority?: Task['priority']; dueDate?: string }) => {
        addTask(title, category, options);
        showToast('Task added successfully', 'success');
    };

    const handleToggleTask = (id: string) => {
        const task = [...todayTasks, ...weekTasks, ...backlogTasks].find(t => t.id === id);
        toggleTask(id);
        if (task && !task.completed) {
            showToast('Task completed! 🎉', 'success');
        }
    };

    const handleDeleteTask = (id: string) => {
        deleteTask(id);
        showToast('Task deleted', 'info');
    };

    const handleReorderToday = (tasks: Task[]) => {
        reorderTasks('today', tasks);
    };

    const handleReorderWeek = (tasks: Task[]) => {
        reorderTasks('week', tasks);
    };

    const handleReorderBacklog = (tasks: Task[]) => {
        reorderTasks('backlog', tasks);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-zen-text">Tasks</h1>
                <p className="text-zen-text-secondary">Organize your work, one task at a time. Drag to reorder.</p>
            </div>

            {/* Task Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                    className="bg-zen-card rounded-zen-lg p-5 border border-zen-border shadow-zen-sm"
                >
                    <TaskList
                        title="Today"
                        tasks={todayTasks}
                        category="today"
                        onAdd={handleAddTask}
                        onToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                        onReorder={handleReorderToday}
                        enableDragDrop={true}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-zen-card rounded-zen-lg p-5 border border-zen-border shadow-zen-sm"
                >
                    <TaskList
                        title="This Week"
                        tasks={weekTasks}
                        category="week"
                        onAdd={handleAddTask}
                        onToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                        onReorder={handleReorderWeek}
                        enableDragDrop={true}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-zen-card rounded-zen-lg p-5 border border-zen-border shadow-zen-sm"
                >
                    <TaskList
                        title="Backlog"
                        tasks={backlogTasks}
                        category="backlog"
                        onAdd={handleAddTask}
                        onToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                        onReorder={handleReorderBacklog}
                        enableDragDrop={true}
                    />
                </motion.div>
            </div>
        </div>
    );
}
