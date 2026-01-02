/**
 * @fileoverview Task management hook with CRUD operations
 * 
 * Provides all task-related functionality including creating, updating,
 * deleting, and reordering tasks. Persists to localStorage automatically.
 * 
 * @module hooks/useTasks
 */

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Task } from '../types';

/**
 * Generates a unique ID for new tasks.
 * Uses timestamp + random string for uniqueness.
 */
const generateId = () => `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Hook for managing the task state in the application.
 * Handles CRUD operations, filtering, and drag-and-drop reordering.
 * 
 * @returns Object containing tasks and all management functions
 * 
 * @example
 * ```tsx
 * const { todayTasks, addTask, toggleTask, deleteTask } = useTasks();
 * 
 * // Add a new task
 * addTask('Review PR', 'today', { priority: 'high', dueDate: '2026-01-05' });
 * 
 * // Mark task as complete
 * toggleTask(taskId);
 * ```
 */
export function useTasks() {
    const [tasks, setTasks] = useLocalStorage<Task[]>('lumina-tasks', []);

    /**
     * Creates a new task with the given parameters.
     * 
     * @param title - The task title
     * @param category - Time-based category (today, week, backlog)
     * @param options - Optional priority, projectId, and dueDate
     * @returns The newly created task
     */
    const addTask = useCallback((
        title: string,
        category: Task['category'],
        options?: {
            priority?: Task['priority'];
            projectId?: string;
            dueDate?: string;
        }
    ) => {
        const newTask: Task = {
            id: generateId(),
            title,
            completed: false,
            category,
            priority: options?.priority || 'medium',
            createdAt: new Date().toISOString(),
            projectId: options?.projectId,
            dueDate: options?.dueDate,
            order: tasks.filter(t => t.category === category).length,
        };
        setTasks((prev) => [...prev, newTask]);
        return newTask;
    }, [setTasks, tasks]);

    /**
     * Toggles the completed status of a task.
     * 
     * @param id - The task ID to toggle
     */
    const toggleTask = useCallback((id: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    }, [setTasks]);

    /**
     * Permanently deletes a task.
     * 
     * @param id - The task ID to delete
     */
    const deleteTask = useCallback((id: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    }, [setTasks]);

    /**
     * Updates specific fields of a task.
     * 
     * @param id - The task ID to update
     * @param updates - Partial task object with fields to update
     */
    const updateTask = useCallback((id: string, updates: Partial<Task>) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, ...updates } : task
            )
        );
    }, [setTasks]);

    /**
     * Gets all tasks for a specific category, sorted by order.
     * 
     * @param category - The category to filter by
     * @returns Sorted array of tasks in the category
     */
    const getTasksByCategory = useCallback((category: Task['category']) => {
        return tasks
            .filter((task) => task.category === category)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }, [tasks]);

    /**
     * Gets all tasks associated with a project.
     * 
     * @param projectId - The project ID to filter by
     * @returns Array of tasks linked to the project
     */
    const getTasksByProject = useCallback((projectId: string) => {
        return tasks.filter((task) => task.projectId === projectId);
    }, [tasks]);

    /**
     * Links or unlinks a task to/from a project.
     * 
     * @param taskId - The task ID to update
     * @param projectId - The project ID (undefined to unlink)
     */
    const linkTaskToProject = useCallback((taskId: string, projectId: string | undefined) => {
        updateTask(taskId, { projectId });
    }, [updateTask]);

    /**
     * Updates the order of tasks after drag-and-drop reordering.
     * Only affects tasks in the specified category.
     * 
     * @param category - The category being reordered
     * @param reorderedTasks - New order of tasks
     */
    const reorderTasks = useCallback((category: Task['category'], reorderedTasks: Task[]) => {
        setTasks((prev) => {
            const otherTasks = prev.filter(t => t.category !== category);
            const orderedTasks = reorderedTasks.map((task, index) => ({
                ...task,
                order: index,
            }));
            return [...otherTasks, ...orderedTasks];
        });
    }, [setTasks]);

    // Pre-filtered and sorted task lists for convenience
    const todayTasks = tasks.filter((t) => t.category === 'today').sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const weekTasks = tasks.filter((t) => t.category === 'week').sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const backlogTasks = tasks.filter((t) => t.category === 'backlog').sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return {
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        updateTask,
        getTasksByCategory,
        getTasksByProject,
        linkTaskToProject,
        reorderTasks,
        todayTasks,
        weekTasks,
        backlogTasks,
    };
}
