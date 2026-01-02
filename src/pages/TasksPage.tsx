import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, Columns, Filter as FilterIcon } from 'lucide-react';
import { TaskList, TaskFilters, KanbanBoard } from '../components/tasks';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { useToast } from '../hooks/useToast';
import type { Task } from '../types';

type TasksViewMode = 'list' | 'kanban';

export function TasksPage() {
    const { tasks, todayTasks, weekTasks, backlogTasks, addTask, toggleTask, deleteTask, reorderTasks } = useTasks();
    const { projects } = useProjects();
    const { showToast } = useToast();
    const {
        filters,
        setProjectFilter,
        setPriorityFilter,
        setDateRangeFilter,
        clearFilters,
        hasActiveFilters,
        applyFilters,
    } = useTaskFilters();

    const [viewMode, setViewMode] = useState<TasksViewMode>('list');
    const [showFilters, setShowFilters] = useState(false);

    // Apply filters to all task lists
    const filteredTodayTasks = applyFilters(todayTasks);
    const filteredWeekTasks = applyFilters(weekTasks);
    const filteredBacklogTasks = applyFilters(backlogTasks);
    const allFilteredTasks = applyFilters(tasks);

    const handleAddTask = (title: string, category: Task['category'], options?: { priority?: Task['priority']; dueDate?: string }) => {
        addTask(title, category, options);
        showToast('Task added successfully', 'success');
    };

    const handleToggleTask = (id: string) => {
        const task = tasks.find(t => t.id === id);
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

    const viewModes: { mode: TasksViewMode; icon: typeof List; label: string }[] = [
        { mode: 'list', icon: List, label: 'List' },
        { mode: 'kanban', icon: Columns, label: 'Kanban' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold text-zen-text">Tasks</h1>
                    <p className="text-zen-text-secondary">
                        Organize your work, one task at a time.
                    </p>
                </div>

                {/* View Mode Toggle & Filter Button */}
                <div className="flex items-center gap-3">
                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-zen transition-all
                            ${showFilters || hasActiveFilters
                                ? 'bg-zen-accent text-white'
                                : 'bg-zen-surface text-zen-text-secondary hover:bg-zen-border'
                            }`}
                    >
                        <FilterIcon size={16} />
                        <span className="text-sm">Filters</span>
                        {hasActiveFilters && (
                            <span className="w-2 h-2 rounded-full bg-white" />
                        )}
                    </button>

                    {/* View Mode Buttons */}
                    <div className="flex items-center bg-zen-surface rounded-zen p-1">
                        {viewModes.map(({ mode, icon: Icon, label }) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all
                                    ${viewMode === mode
                                        ? 'bg-zen-card text-zen-text shadow-zen-sm'
                                        : 'text-zen-text-muted hover:text-zen-text'
                                    }`}
                                title={label}
                            >
                                <Icon size={16} />
                                <span className="hidden sm:inline">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <TaskFilters
                            filters={filters}
                            projects={projects}
                            onProjectChange={setProjectFilter}
                            onPriorityChange={setPriorityFilter}
                            onDateRangeChange={setDateRangeFilter}
                            onClear={clearFilters}
                            hasActiveFilters={hasActiveFilters}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content based on view mode */}
            <AnimatePresence mode="wait">
                {viewMode === 'list' && (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0 }}
                            className="bg-zen-card rounded-zen-lg p-5 border border-zen-border shadow-zen-sm"
                        >
                            <TaskList
                                title="Today"
                                tasks={filteredTodayTasks}
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
                                tasks={filteredWeekTasks}
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
                                tasks={filteredBacklogTasks}
                                category="backlog"
                                onAdd={handleAddTask}
                                onToggle={handleToggleTask}
                                onDelete={handleDeleteTask}
                                onReorder={handleReorderBacklog}
                                enableDragDrop={true}
                            />
                        </motion.div>
                    </motion.div>
                )}

                {viewMode === 'kanban' && (
                    <motion.div
                        key="kanban"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <KanbanBoard
                            tasks={allFilteredTasks}
                            onToggle={handleToggleTask}
                            onDelete={handleDeleteTask}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
