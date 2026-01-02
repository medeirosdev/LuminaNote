/**
 * @fileoverview Project management hook with CRUD operations
 * 
 * Provides all project-related functionality including creating, updating,
 * deleting, and status management. Projects can contain linked tasks
 * and track progress automatically based on task completion.
 * 
 * @module hooks/useProjects
 */

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Project, ProjectStatus, ProjectColor } from '../types';

/**
 * Generates a unique ID for new projects.
 */
const generateId = () => `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Hook for managing projects in the application.
 * Handles CRUD operations, status changes, and progress tracking.
 * 
 * @returns Object containing projects and all management functions
 * 
 * @example
 * ```tsx
 * const { projects, addProject, updateProject, changeStatus } = useProjects();
 * 
 * // Create a new project
 * addProject('Website Redesign', 'Modernize the UI', {
 *   color: 'sage',
 *   deadline: '2026-02-01',
 *   tags: ['design', 'frontend']
 * });
 * ```
 */
export function useProjects() {
    // Initialize with demo projects for first-time users
    const [projects, setProjects] = useLocalStorage<Project[]>('lumina-projects', [
        {
            id: 'demo-1',
            name: 'App Redesign',
            description: 'Modernize the user interface with a fresh, minimal look. Focus on improving usability and accessibility.',
            progress: 65,
            totalTasks: 12,
            completedTasks: 8,
            color: 'slate',
            status: 'active',
            createdAt: '2025-12-15T10:00:00Z',
            deadline: '2026-01-15T23:59:59Z',
            tags: ['design', 'frontend', 'priority'],
        },
        {
            id: 'demo-2',
            name: 'Documentation',
            description: 'Write comprehensive documentation for the API and user guides. Include examples and tutorials.',
            progress: 30,
            totalTasks: 10,
            completedTasks: 3,
            color: 'sage',
            status: 'active',
            createdAt: '2025-12-20T14:30:00Z',
            deadline: '2026-01-31T23:59:59Z',
            tags: ['docs', 'writing'],
        },
        {
            id: 'demo-3',
            name: 'Performance Audit',
            description: 'Analyze and optimize application performance. Reduce bundle size and improve load times.',
            progress: 0,
            totalTasks: 8,
            completedTasks: 0,
            color: 'amber',
            status: 'on-hold',
            createdAt: '2025-12-28T09:00:00Z',
            tags: ['performance', 'optimization'],
        },
    ]);

    /**
     * Creates a new project with optional settings.
     * 
     * @param name - Project name
     * @param description - Project description
     * @param options - Optional color, deadline, and tags
     * @returns The newly created project
     */
    const addProject = useCallback((
        name: string,
        description: string,
        options?: {
            color?: ProjectColor;
            deadline?: string;
            tags?: string[];
        }
    ) => {
        const newProject: Project = {
            id: generateId(),
            name,
            description,
            progress: 0,
            totalTasks: 0,
            completedTasks: 0,
            color: options?.color || 'slate',
            status: 'active',
            createdAt: new Date().toISOString(),
            deadline: options?.deadline,
            tags: options?.tags || [],
        };
        setProjects((prev) => [...prev, newProject]);
        return newProject;
    }, [setProjects]);

    /**
     * Updates specific fields of a project.
     * 
     * @param id - Project ID to update
     * @param updates - Partial project object with fields to update
     */
    const updateProject = useCallback((id: string, updates: Partial<Project>) => {
        setProjects((prev) =>
            prev.map((project) =>
                project.id === id ? { ...project, ...updates } : project
            )
        );
    }, [setProjects]);

    /**
     * Permanently deletes a project.
     * Note: This does not delete associated tasks.
     * 
     * @param id - Project ID to delete
     */
    const deleteProject = useCallback((id: string) => {
        setProjects((prev) => prev.filter((project) => project.id !== id));
    }, [setProjects]);

    /**
     * Updates project progress based on task completion.
     * Automatically marks project as 'completed' when 100% done.
     * 
     * @param id - Project ID to update
     * @param completedTasks - Number of completed tasks
     * @param totalTasks - Total number of tasks
     */
    const updateProgress = useCallback((id: string, completedTasks: number, totalTasks: number) => {
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        const status: ProjectStatus = progress === 100 ? 'completed' : 'active';
        updateProject(id, { completedTasks, totalTasks, progress, status });
    }, [updateProject]);

    /**
     * Changes the status of a project.
     * 
     * @param id - Project ID to update
     * @param status - New status (active, on-hold, completed)
     */
    const changeStatus = useCallback((id: string, status: ProjectStatus) => {
        updateProject(id, { status });
    }, [updateProject]);

    // Filtered project lists by status
    const activeProjects = projects.filter(p => p.status === 'active');
    const onHoldProjects = projects.filter(p => p.status === 'on-hold');
    const completedProjects = projects.filter(p => p.status === 'completed');

    return {
        projects,
        activeProjects,
        onHoldProjects,
        completedProjects,
        addProject,
        updateProject,
        deleteProject,
        updateProgress,
        changeStatus,
    };
}
