/**
 * @fileoverview Task management hook with SQLite and localStorage support
 * 
 * Provides all task-related functionality including creating, updating,
 * deleting, and reordering tasks. Uses SQLite when available, falls back to localStorage.
 * 
 * @module hooks/useTasks
 */

import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useDatabase } from './useDatabase';
import { isDatabaseInitialized } from '../services/database';
import * as taskRepo from '../services/taskRepository';
import type { Task } from '../types';

/**
 * Generates a unique ID for new tasks.
 * Uses timestamp + random string for uniqueness.
 */
const generateId = () => `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Hook for managing the task state in the application.
 * Handles CRUD operations, filtering, and drag-and-drop reordering.
 * Uses SQLite when database is ready, falls back to localStorage.
 * 
 * @returns Object containing tasks and all management functions
 */
export function useTasks() {
    const { isReady: dbReady } = useDatabase();
    const [localTasks, setLocalTasks] = useLocalStorage<Task[]>('lumina-tasks', []);
    const [dbTasks, setDbTasks] = useState<Task[]>([]);
    const [useDb, setUseDb] = useState(false);

    // Load from SQLite when database is ready
    useEffect(() => {
        if (dbReady && isDatabaseInitialized()) {
            try {
                const tasks = taskRepo.getAllTasks();
                if (tasks.length > 0) {
                    // Database has data, use it
                    setDbTasks(tasks);
                    setUseDb(true);
                } else if (localTasks.length > 0) {
                    // Migrate localStorage data to SQLite
                    localTasks.forEach(task => {
                        taskRepo.insertTask(task);
                    });
                    setDbTasks(localTasks);
                    setUseDb(true);
                    console.log('[useTasks] Migrated localStorage data to SQLite');
                } else {
                    setUseDb(true);
                }
            } catch (error) {
                console.error('[useTasks] SQLite error, using localStorage:', error);
                setUseDb(false);
            }
        }
    }, [dbReady, localTasks]);

    // Current tasks (either from DB or localStorage)
    const tasks = useDb ? dbTasks : localTasks;
    const setTasks = useDb
        ? (updater: Task[] | ((prev: Task[]) => Task[])) => {
            setDbTasks(typeof updater === 'function' ? updater(dbTasks) : updater);
        }
        : setLocalTasks;

    // Reset recurring tasks daily
    useEffect(() => {
        const today = new Date().toDateString();
        const tasksToReset = tasks.filter(task => {
            if (!task.isRecurring || !task.completed) return false;
            if (!task.lastCompletedAt) return true;
            const lastCompleted = new Date(task.lastCompletedAt).toDateString();
            return lastCompleted !== today;
        });

        if (tasksToReset.length > 0) {
            setTasks((prev: Task[]) =>
                prev.map(task =>
                    tasksToReset.find(t => t.id === task.id)
                        ? { ...task, completed: false }
                        : task
                )
            );
            console.log('[useTasks] Reset', tasksToReset.length, 'recurring tasks');
        }
    }, [tasks, setTasks]);

    /**
     * Creates a new task with the given parameters.
     */
    const addTask = useCallback((
        title: string,
        category: Task['category'],
        options?: {
            priority?: Task['priority'];
            projectId?: string;
            dueDate?: string;
            dueTime?: string;
            isRecurring?: boolean;
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
            dueTime: options?.dueTime,
            isRecurring: options?.isRecurring,
            order: tasks.filter(t => t.category === category).length,
        };

        if (useDb) {
            try {
                taskRepo.insertTask(newTask);
            } catch (error) {
                console.error('[useTasks] Failed to insert task:', error);
            }
        }

        setTasks((prev: Task[]) => [...prev, newTask]);
        return newTask;
    }, [setTasks, tasks, useDb]);


    /**
     * Toggles the completed status of a task.
     * For recurring tasks, also tracks lastCompletedAt timestamp.
     */
    const toggleTask = useCallback((id: string) => {
        if (useDb) {
            try {
                taskRepo.toggleTask(id);
            } catch (error) {
                console.error('[useTasks] Failed to toggle task:', error);
            }
        }

        setTasks((prev: Task[]) =>
            prev.map((task) => {
                if (task.id !== id) return task;
                const nowCompleted = !task.completed;
                return {
                    ...task,
                    completed: nowCompleted,
                    // Track when recurring tasks are completed
                    lastCompletedAt: task.isRecurring && nowCompleted
                        ? new Date().toISOString()
                        : task.lastCompletedAt,
                };
            })
        );
    }, [setTasks, useDb]);

    /**
     * Permanently deletes a task.
     */
    const deleteTask = useCallback((id: string) => {
        if (useDb) {
            try {
                taskRepo.deleteTask(id);
            } catch (error) {
                console.error('[useTasks] Failed to delete task:', error);
            }
        }

        setTasks((prev: Task[]) => prev.filter((task) => task.id !== id));
    }, [setTasks, useDb]);

    /**
     * Updates specific fields of a task.
     */
    const updateTask = useCallback((id: string, updates: Partial<Task>) => {
        setTasks((prev: Task[]) => {
            const updated = prev.map((task) =>
                task.id === id ? { ...task, ...updates } : task
            );

            if (useDb) {
                const updatedTask = updated.find(t => t.id === id);
                if (updatedTask) {
                    try {
                        taskRepo.updateTask(updatedTask);
                    } catch (error) {
                        console.error('[useTasks] Failed to update task:', error);
                    }
                }
            }

            return updated;
        });
    }, [setTasks, useDb]);

    /**
     * Gets all tasks for a specific category, sorted by order.
     */
    const getTasksByCategory = useCallback((category: Task['category']) => {
        return tasks
            .filter((task) => task.category === category)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }, [tasks]);

    /**
     * Gets all tasks associated with a project.
     */
    const getTasksByProject = useCallback((projectId: string) => {
        return tasks.filter((task) => task.projectId === projectId);
    }, [tasks]);

    /**
     * Links or unlinks a task to/from a project.
     */
    const linkTaskToProject = useCallback((taskId: string, projectId: string | undefined) => {
        updateTask(taskId, { projectId });
    }, [updateTask]);

    /**
     * Updates the order of tasks after drag-and-drop reordering.
     */
    const reorderTasks = useCallback((category: Task['category'], reorderedTasks: Task[]) => {
        if (useDb) {
            const orderedIds = reorderedTasks.map(t => t.id);
            try {
                taskRepo.updateTaskOrder(category, orderedIds);
            } catch (error) {
                console.error('[useTasks] Failed to reorder tasks:', error);
            }
        }

        setTasks((prev: Task[]) => {
            const otherTasks = prev.filter(t => t.category !== category);
            const orderedTasks = reorderedTasks.map((task, index) => ({
                ...task,
                order: index,
            }));
            return [...otherTasks, ...orderedTasks];
        });
    }, [setTasks, useDb]);

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
        isUsingSQLite: useDb,
    };
}
