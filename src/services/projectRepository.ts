/**
 * @fileoverview Project repository for SQLite database operations
 * 
 * Provides CRUD operations for projects using the SQLite database.
 * 
 * @module services/projectRepository
 */

import { getDatabase, saveDatabase } from './database';
import type { Project } from '../types';

/**
 * Get all projects from the database.
 */
export function getAllProjects(): Project[] {
    const db = getDatabase();
    const result = db.exec('SELECT * FROM projects ORDER BY created_at DESC');

    if (result.length === 0) return [];

    return result[0].values.map((row: unknown[]) => ({
        id: row[0] as string,
        name: row[1] as string,
        description: row[2] as string,
        progress: row[3] as number,
        totalTasks: row[4] as number,
        completedTasks: row[5] as number,
        color: row[6] as Project['color'],
        status: row[7] as Project['status'],
        createdAt: row[8] as string,
        deadline: row[9] as string | undefined,
        tags: row[10] ? JSON.parse(row[10] as string) : [],
    }));
}

/**
 * Insert a new project.
 */
export function insertProject(project: Project): void {
    const db = getDatabase();
    db.run(
        `INSERT INTO projects (id, name, description, progress, total_tasks, completed_tasks, color, status, created_at, deadline, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            project.id,
            project.name,
            project.description,
            project.progress,
            project.totalTasks,
            project.completedTasks,
            project.color,
            project.status,
            project.createdAt,
            project.deadline || null,
            JSON.stringify(project.tags),
        ]
    );
    saveDatabase();
}

/**
 * Update an existing project.
 */
export function updateProject(project: Project): void {
    const db = getDatabase();
    db.run(
        `UPDATE projects SET 
            name = ?, description = ?, progress = ?, total_tasks = ?, 
            completed_tasks = ?, color = ?, status = ?, deadline = ?, tags = ?
         WHERE id = ?`,
        [
            project.name,
            project.description,
            project.progress,
            project.totalTasks,
            project.completedTasks,
            project.color,
            project.status,
            project.deadline || null,
            JSON.stringify(project.tags),
            project.id,
        ]
    );
    saveDatabase();
}

/**
 * Delete a project by ID.
 */
export function deleteProject(id: string): void {
    const db = getDatabase();
    db.run('DELETE FROM projects WHERE id = ?', [id]);
    saveDatabase();
}

/**
 * Get project by ID.
 */
export function getProjectById(id: string): Project | null {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
    stmt.bind([id]);

    if (stmt.step()) {
        const row = stmt.get();
        stmt.free();
        return {
            id: row[0] as string,
            name: row[1] as string,
            description: row[2] as string,
            progress: row[3] as number,
            totalTasks: row[4] as number,
            completedTasks: row[5] as number,
            color: row[6] as Project['color'],
            status: row[7] as Project['status'],
            createdAt: row[8] as string,
            deadline: row[9] as string | undefined,
            tags: row[10] ? JSON.parse(row[10] as string) : [],
        };
    }

    stmt.free();
    return null;
}

/**
 * Get projects by status.
 */
export function getProjectsByStatus(status: Project['status']): Project[] {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM projects WHERE status = ? ORDER BY created_at DESC');
    stmt.bind([status]);

    const projects: Project[] = [];
    while (stmt.step()) {
        const row = stmt.get();
        projects.push({
            id: row[0] as string,
            name: row[1] as string,
            description: row[2] as string,
            progress: row[3] as number,
            totalTasks: row[4] as number,
            completedTasks: row[5] as number,
            color: row[6] as Project['color'],
            status: row[7] as Project['status'],
            createdAt: row[8] as string,
            deadline: row[9] as string | undefined,
            tags: row[10] ? JSON.parse(row[10] as string) : [],
        });
    }
    stmt.free();

    return projects;
}
