/**
 * @fileoverview Type definitions for LuminaNote application
 * 
 * This module contains all TypeScript interfaces and types used throughout
 * the application for type safety and documentation.
 * 
 * @module types
 */

// =============================================================================
// TASK TYPES
// =============================================================================

/**
 * Represents a task in the productivity system.
 * Tasks can be organized by category, assigned to projects, and have due dates.
 */
export interface Task {
    /** Unique identifier for the task */
    id: string;

    /** The task title/description */
    title: string;

    /** Whether the task has been completed */
    completed: boolean;

    /** Time-based category for organizing tasks */
    category: 'today' | 'week' | 'backlog';

    /** Priority level affecting visual indicators */
    priority: 'low' | 'medium' | 'high';

    /** ISO timestamp of when the task was created */
    createdAt: string;

    /** Optional project association */
    projectId?: string;

    /** Optional due date in ISO format */
    dueDate?: string;

    /** Order index for drag-and-drop sorting */
    order?: number;
}

// =============================================================================
// PROJECT TYPES
// =============================================================================

/** Project lifecycle status */
export type ProjectStatus = 'active' | 'on-hold' | 'completed';

/** Available color themes for projects */
export type ProjectColor = 'slate' | 'sage' | 'amber' | 'rose';

/**
 * Represents a project containing multiple tasks.
 * Projects track progress based on completed tasks.
 */
export interface Project {
    /** Unique identifier for the project */
    id: string;

    /** Project name */
    name: string;

    /** Detailed description of the project */
    description: string;

    /** Completion percentage (0-100) */
    progress: number;

    /** Total number of tasks in the project */
    totalTasks: number;

    /** Number of completed tasks */
    completedTasks: number;

    /** Color theme for visual distinction */
    color: ProjectColor;

    /** Current project status */
    status: ProjectStatus;

    /** ISO timestamp of creation */
    createdAt: string;

    /** Optional deadline in ISO format */
    deadline?: string;

    /** Categorization tags */
    tags: string[];
}

// =============================================================================
// TIMER TYPES
// =============================================================================

/**
 * Pomodoro timer state for focus sessions.
 * Alternates between focus and break modes.
 */
export interface TimerState {
    /** Total duration in seconds */
    duration: number;

    /** Remaining time in seconds */
    remaining: number;

    /** Whether the timer is actively counting down */
    isRunning: boolean;

    /** Number of completed focus sessions */
    sessions: number;

    /** Current timer mode */
    mode: 'focus' | 'break';
}

// =============================================================================
// NAVIGATION TYPES
// =============================================================================

/** Available navigation destinations in the app */
export type NavItem = 'dashboard' | 'tasks' | 'projects' | 'focus' | 'calendar';

// =============================================================================
// VIEW MODE TYPES
// =============================================================================

/** Available view modes for the tasks page */
export type TaskViewMode = 'list' | 'kanban' | 'calendar';

/** Filter state for advanced task filtering */
export interface TaskFilterState {
    /** Filter by project ID, null for all projects */
    project: string | null;

    /** Filter by priority level, null for all priorities */
    priority: Task['priority'] | null;

    /** Filter by date range */
    dateRange: 'all' | 'overdue' | 'today' | 'week' | 'no-date';
}
