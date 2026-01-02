/**
 * @fileoverview Task filtering hook for advanced filter functionality
 * 
 * Manages filter state and provides filtering logic for tasks
 * based on project, priority, and date range.
 * 
 * @module hooks/useTaskFilters
 */

import { useState, useCallback, useMemo } from 'react';
import type { Task, TaskFilterState } from '../types';

/** Default filter state with no filters applied */
const defaultFilters: TaskFilterState = {
    project: null,
    priority: null,
    dateRange: 'all',
};

/**
 * Hook for managing task filter state and applying filters.
 * 
 * @returns Object containing filter state and filter functions
 * 
 * @example
 * ```tsx
 * const { filters, setProjectFilter, applyFilters, clearFilters } = useTaskFilters();
 * 
 * // Apply filters to tasks
 * const filteredTasks = applyFilters(allTasks);
 * ```
 */
export function useTaskFilters() {
    const [filters, setFilters] = useState<TaskFilterState>(defaultFilters);

    /**
     * Sets the project filter.
     */
    const setProjectFilter = useCallback((projectId: string | null) => {
        setFilters(prev => ({ ...prev, project: projectId }));
    }, []);

    /**
     * Sets the priority filter.
     */
    const setPriorityFilter = useCallback((priority: Task['priority'] | null) => {
        setFilters(prev => ({ ...prev, priority }));
    }, []);

    /**
     * Sets the date range filter.
     */
    const setDateRangeFilter = useCallback((dateRange: TaskFilterState['dateRange']) => {
        setFilters(prev => ({ ...prev, dateRange }));
    }, []);

    /**
     * Clears all filters to default state.
     */
    const clearFilters = useCallback(() => {
        setFilters(defaultFilters);
    }, []);

    /**
     * Checks if any filters are currently active.
     */
    const hasActiveFilters = useMemo(() => {
        return filters.project !== null ||
            filters.priority !== null ||
            filters.dateRange !== 'all';
    }, [filters]);

    /**
     * Applies all active filters to a list of tasks.
     */
    const applyFilters = useCallback((tasks: Task[]): Task[] => {
        return tasks.filter(task => {
            // Project filter
            if (filters.project !== null && task.projectId !== filters.project) {
                return false;
            }

            // Priority filter
            if (filters.priority !== null && task.priority !== filters.priority) {
                return false;
            }

            // Date range filter
            if (filters.dateRange !== 'all') {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (filters.dateRange === 'no-date') {
                    if (task.dueDate) return false;
                } else if (!task.dueDate) {
                    return false;
                } else {
                    const dueDate = new Date(task.dueDate);
                    dueDate.setHours(0, 0, 0, 0);
                    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                    switch (filters.dateRange) {
                        case 'overdue':
                            if (diffDays >= 0) return false;
                            break;
                        case 'today':
                            if (diffDays !== 0) return false;
                            break;
                        case 'week':
                            if (diffDays < 0 || diffDays > 7) return false;
                            break;
                    }
                }
            }

            return true;
        });
    }, [filters]);

    return {
        filters,
        setProjectFilter,
        setPriorityFilter,
        setDateRangeFilter,
        clearFilters,
        hasActiveFilters,
        applyFilters,
    };
}
