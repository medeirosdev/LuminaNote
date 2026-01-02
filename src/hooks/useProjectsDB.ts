/**
 * @fileoverview SQLite-based project management hook
 * 
 * Provides all project-related functionality using SQLite for persistence.
 * 
 * @module hooks/useProjectsDB
 */

import { useState, useCallback, useEffect } from 'react';
import { isDatabaseInitialized } from '../services/database';
import * as projectRepo from '../services/projectRepository';
import type { Project, ProjectStatus, ProjectColor } from '../types';

/**
 * Generates a unique ID for new projects.
 */
const generateId = () => `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Hook for managing projects with SQLite persistence.
 */
export function useProjectsDB() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load projects from database
    const loadProjects = useCallback(() => {
        if (!isDatabaseInitialized()) return;

        try {
            const allProjects = projectRepo.getAllProjects();
            setProjects(allProjects);
        } catch (error) {
            console.error('[useProjectsDB] Failed to load projects:', error);
        }
    }, []);

    // Initial load
    useEffect(() => {
        if (isDatabaseInitialized()) {
            loadProjects();
            setIsLoading(false);
        }
    }, [loadProjects]);

    /**
     * Creates a new project.
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

        projectRepo.insertProject(newProject);
        setProjects(prev => [...prev, newProject]);
        return newProject;
    }, []);

    /**
     * Updates a project.
     */
    const updateProject = useCallback((id: string, updates: Partial<Project>) => {
        setProjects(prev => {
            const updated = prev.map(project =>
                project.id === id ? { ...project, ...updates } : project
            );
            const updatedProject = updated.find(p => p.id === id);
            if (updatedProject) {
                projectRepo.updateProject(updatedProject);
            }
            return updated;
        });
    }, []);

    /**
     * Deletes a project.
     */
    const deleteProject = useCallback((id: string) => {
        projectRepo.deleteProject(id);
        setProjects(prev => prev.filter(project => project.id !== id));
    }, []);

    /**
     * Updates project progress based on task completion.
     */
    const updateProgress = useCallback((id: string, completedTasks: number, totalTasks: number) => {
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        const status: ProjectStatus = progress === 100 ? 'completed' : 'active';
        updateProject(id, { completedTasks, totalTasks, progress, status });
    }, [updateProject]);

    /**
     * Changes project status.
     */
    const changeStatus = useCallback((id: string, status: ProjectStatus) => {
        updateProject(id, { status });
    }, [updateProject]);

    // Filtered project lists
    const activeProjects = projects.filter(p => p.status === 'active');
    const onHoldProjects = projects.filter(p => p.status === 'on-hold');
    const completedProjects = projects.filter(p => p.status === 'completed');

    return {
        projects,
        isLoading,
        activeProjects,
        onHoldProjects,
        completedProjects,
        addProject,
        updateProject,
        deleteProject,
        updateProgress,
        changeStatus,
        refreshProjects: loadProjects,
    };
}
