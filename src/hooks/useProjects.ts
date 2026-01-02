/**
 * @fileoverview Project management hook with SQLite and localStorage support
 * 
 * Provides all project-related functionality including creating, updating,
 * deleting, and status management. Uses SQLite when available, falls back to localStorage.
 * 
 * @module hooks/useProjects
 */

import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useDatabase } from './useDatabase';
import { isDatabaseInitialized } from '../services/database';
import * as projectRepo from '../services/projectRepository';
import type { Project, ProjectStatus, ProjectColor } from '../types';

/**
 * Generates a unique ID for new projects.
 */
const generateId = () => `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Default demo projects for first-time users.
 */
const defaultProjects: Project[] = [
    {
        id: 'demo-1',
        name: 'App Redesign',
        description: 'Modernize the user interface with a fresh, minimal look.',
        progress: 65,
        totalTasks: 12,
        completedTasks: 8,
        color: 'slate',
        status: 'active',
        createdAt: '2025-12-15T10:00:00Z',
        deadline: '2026-01-15T23:59:59Z',
        tags: ['design', 'frontend'],
    },
    {
        id: 'demo-2',
        name: 'Documentation',
        description: 'Write comprehensive documentation for the API.',
        progress: 30,
        totalTasks: 10,
        completedTasks: 3,
        color: 'sage',
        status: 'active',
        createdAt: '2025-12-20T14:30:00Z',
        deadline: '2026-01-31T23:59:59Z',
        tags: ['docs'],
    },
];

/**
 * Hook for managing projects in the application.
 * Uses SQLite when database is ready, falls back to localStorage.
 */
export function useProjects() {
    const { isReady: dbReady } = useDatabase();
    const [localProjects, setLocalProjects] = useLocalStorage<Project[]>('lumina-projects', defaultProjects);
    const [dbProjects, setDbProjects] = useState<Project[]>([]);
    const [useDb, setUseDb] = useState(false);

    // Load from SQLite when database is ready
    useEffect(() => {
        if (dbReady && isDatabaseInitialized()) {
            try {
                const projects = projectRepo.getAllProjects();
                if (projects.length > 0) {
                    setDbProjects(projects);
                    setUseDb(true);
                } else if (localProjects.length > 0) {
                    // Migrate localStorage data to SQLite
                    localProjects.forEach(project => {
                        projectRepo.insertProject(project);
                    });
                    setDbProjects(localProjects);
                    setUseDb(true);
                    console.log('[useProjects] Migrated localStorage data to SQLite');
                } else {
                    setUseDb(true);
                }
            } catch (error) {
                console.error('[useProjects] SQLite error, using localStorage:', error);
                setUseDb(false);
            }
        }
    }, [dbReady, localProjects]);

    // Current projects
    const projects = useDb ? dbProjects : localProjects;
    const setProjects = useDb
        ? (updater: Project[] | ((prev: Project[]) => Project[])) => {
            setDbProjects(typeof updater === 'function' ? updater(dbProjects) : updater);
        }
        : setLocalProjects;

    /**
     * Creates a new project with optional settings.
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

        if (useDb) {
            try {
                projectRepo.insertProject(newProject);
            } catch (error) {
                console.error('[useProjects] Failed to insert project:', error);
            }
        }

        setProjects((prev: Project[]) => [...prev, newProject]);
        return newProject;
    }, [setProjects, useDb]);

    /**
     * Updates specific fields of a project.
     */
    const updateProject = useCallback((id: string, updates: Partial<Project>) => {
        setProjects((prev: Project[]) => {
            const updated = prev.map((project) =>
                project.id === id ? { ...project, ...updates } : project
            );

            if (useDb) {
                const updatedProject = updated.find(p => p.id === id);
                if (updatedProject) {
                    try {
                        projectRepo.updateProject(updatedProject);
                    } catch (error) {
                        console.error('[useProjects] Failed to update project:', error);
                    }
                }
            }

            return updated;
        });
    }, [setProjects, useDb]);

    /**
     * Permanently deletes a project.
     */
    const deleteProject = useCallback((id: string) => {
        if (useDb) {
            try {
                projectRepo.deleteProject(id);
            } catch (error) {
                console.error('[useProjects] Failed to delete project:', error);
            }
        }

        setProjects((prev: Project[]) => prev.filter((project) => project.id !== id));
    }, [setProjects, useDb]);

    /**
     * Updates project progress based on task completion.
     */
    const updateProgress = useCallback((id: string, completedTasks: number, totalTasks: number) => {
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        const status: ProjectStatus = progress === 100 ? 'completed' : 'active';
        updateProject(id, { completedTasks, totalTasks, progress, status });
    }, [updateProject]);

    /**
     * Changes the status of a project.
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
        isUsingSQLite: useDb,
    };
}
