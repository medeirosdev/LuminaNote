/**
 * @fileoverview Task filter bar component
 * 
 * Provides UI controls for filtering tasks by project, priority, and date range.
 * Integrates with useTaskFilters hook for state management.
 * 
 * @module components/tasks/TaskFilters
 */

import { motion } from 'framer-motion';
import { Filter, X, Folder, Flag, Calendar } from 'lucide-react';
import type { Task, TaskFilterState } from '../../types';
import type { Project } from '../../types';

interface TaskFiltersProps {
    filters: TaskFilterState;
    projects: Project[];
    onProjectChange: (projectId: string | null) => void;
    onPriorityChange: (priority: Task['priority'] | null) => void;
    onDateRangeChange: (dateRange: TaskFilterState['dateRange']) => void;
    onClear: () => void;
    hasActiveFilters: boolean;
}

const priorityOptions: { value: Task['priority'] | null; label: string; color: string }[] = [
    { value: null, label: 'All', color: 'bg-zen-text-muted' },
    { value: 'low', label: 'Low', color: 'bg-priority-low' },
    { value: 'medium', label: 'Medium', color: 'bg-priority-medium' },
    { value: 'high', label: 'High', color: 'bg-priority-high' },
];

const dateRangeOptions: { value: TaskFilterState['dateRange']; label: string }[] = [
    { value: 'all', label: 'Any Date' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'no-date', label: 'No Due Date' },
];

export function TaskFilters({
    filters,
    projects,
    onProjectChange,
    onPriorityChange,
    onDateRangeChange,
    onClear,
    hasActiveFilters,
}: TaskFiltersProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zen-card rounded-zen-lg p-4 border border-zen-border shadow-zen-sm"
        >
            <div className="flex items-center gap-2 mb-4">
                <Filter size={16} className="text-zen-accent" />
                <span className="text-sm font-medium text-zen-text">Filters</span>
                {hasActiveFilters && (
                    <button
                        onClick={onClear}
                        className="ml-auto flex items-center gap-1 text-xs text-zen-text-muted 
                                   hover:text-zen-text transition-colors px-2 py-1 rounded-md 
                                   hover:bg-zen-surface"
                    >
                        <X size={12} />
                        Clear
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-4">
                {/* Project Filter */}
                <div className="flex items-center gap-2">
                    <Folder size={14} className="text-zen-text-muted" />
                    <select
                        value={filters.project || ''}
                        onChange={(e) => onProjectChange(e.target.value || null)}
                        className="text-sm bg-zen-surface border border-zen-border rounded-md 
                                   px-3 py-1.5 text-zen-text focus:outline-none focus:border-zen-accent
                                   transition-colors cursor-pointer"
                    >
                        <option value="">All Projects</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Priority Filter */}
                <div className="flex items-center gap-2">
                    <Flag size={14} className="text-zen-text-muted" />
                    <div className="flex gap-1">
                        {priorityOptions.map((option) => (
                            <button
                                key={option.label}
                                onClick={() => onPriorityChange(option.value)}
                                className={`text-xs px-3 py-1.5 rounded-md transition-all
                                    ${filters.priority === option.value
                                        ? 'bg-zen-accent text-white'
                                        : 'bg-zen-surface text-zen-text-secondary hover:bg-zen-border'
                                    }`}
                            >
                                <span className="flex items-center gap-1.5">
                                    {option.value && (
                                        <span className={`w-2 h-2 rounded-full ${option.color}`} />
                                    )}
                                    {option.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date Range Filter */}
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-zen-text-muted" />
                    <select
                        value={filters.dateRange}
                        onChange={(e) => onDateRangeChange(e.target.value as TaskFilterState['dateRange'])}
                        className="text-sm bg-zen-surface border border-zen-border rounded-md 
                                   px-3 py-1.5 text-zen-text focus:outline-none focus:border-zen-accent
                                   transition-colors cursor-pointer"
                    >
                        {dateRangeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </motion.div>
    );
}
