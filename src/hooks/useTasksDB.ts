/**
 * @fileoverview SQLite-based task management hook
 * 
 * Provides all task-related functionality using SQLite for persistence.
 * This replaces the localStorage-based useTasks hook.
 * 
 * @module hooks/useTasksDB
 */

import { useState, useCallback, useEffect } from 'react';
import { isDatabaseInitialized } from '../services/database';
import * as taskRepo from '../services/taskRepository';
import type { Task } from '../types';

/**
 * Generates a unique ID for new tasks.
 */
const generateId = () => `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Hook for managing tasks with SQLite persistence.
 */
export function useTasksDB() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load tasks from database
    const loadTasks = useCallback(() => {
        if (!isDatabaseInitialized()) return;

        try {
            const allTasks = taskRepo.getAllTasks();
            setTasks(allTasks);
        } catch (error) {
            console.error('[useTasksDB] Failed to load tasks:', error);
        }
    }, []);

    // Initial load
    useEffect(() => {
        if (isDatabaseInitialized()) {
            loadTasks();
            setIsLoading(false);
        }
    }, [loadTasks]);

    /**
     * Creates a new task.
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

        taskRepo.insertTask(newTask);
        setTasks(prev => [...prev, newTask]);
        return newTask;
    }, [tasks]);

    /**
     * Toggles task completion status.
     */
    const toggleTask = useCallback((id: string) => {
        taskRepo.toggleTask(id);
        setTasks(prev =>
            prev.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    }, []);

    /**
     * Deletes a task.
     */
    const deleteTask = useCallback((id: string) => {
        taskRepo.deleteTask(id);
        setTasks(prev => prev.filter(task => task.id !== id));
    }, []);

    /**
     * Updates a task.
     */
    const updateTask = useCallback((id: string, updates: Partial<Task>) => {
        setTasks(prev => {
            const updated = prev.map(task =>
                task.id === id ? { ...task, ...updates } : task
            );
            const updatedTask = updated.find(t => t.id === id);
            if (updatedTask) {
                taskRepo.updateTask(updatedTask);
            }
            return updated;
        });
    }, []);

    /**
     * Reorders tasks in a category.
     */
    const reorderTasks = useCallback((category: Task['category'], reorderedTasks: Task[]) => {
        const orderedIds = reorderedTasks.map(t => t.id);
        taskRepo.updateTaskOrder(category, orderedIds);

        setTasks(prev => {
            const otherTasks = prev.filter(t => t.category !== category);
            const ordered = reorderedTasks.map((task, index) => ({
                ...task,
                order: index,
            }));
            return [...otherTasks, ...ordered];
        });
    }, []);

    /**
     * Gets tasks by category.
     */
    const getTasksByCategory = useCallback((category: Task['category']) => {
        return tasks
            .filter(task => task.category === category)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }, [tasks]);

    /**
     * Gets tasks by project.
     */
    const getTasksByProject = useCallback((projectId: string) => {
        return tasks.filter(task => task.projectId === projectId);
    }, [tasks]);

    /**
     * Links a task to a project.
     */
    const linkTaskToProject = useCallback((taskId: string, projectId: string | undefined) => {
        updateTask(taskId, { projectId });
    }, [updateTask]);

    // Pre-filtered task lists
    const todayTasks = tasks.filter(t => t.category === 'today').sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const weekTasks = tasks.filter(t => t.category === 'week').sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const backlogTasks = tasks.filter(t => t.category === 'backlog').sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return {
        tasks,
        isLoading,
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
        refreshTasks: loadTasks,
    };
}
