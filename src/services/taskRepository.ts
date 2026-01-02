/**
 * @fileoverview Task repository for SQLite database operations
 * 
 * Provides CRUD operations for tasks using the SQLite database.
 * Handles conversion between database rows and Task objects.
 * 
 * @module services/taskRepository
 */

import { getDatabase, saveDatabase } from './database';
import type { Task } from '../types';

/**
 * Get all tasks from the database.
 */
export function getAllTasks(): Task[] {
    const db = getDatabase();
    const result = db.exec('SELECT * FROM tasks ORDER BY task_order ASC');

    if (result.length === 0) return [];

    return result[0].values.map((row: unknown[]) => ({
        id: row[0] as string,
        title: row[1] as string,
        completed: Boolean(row[2]),
        category: row[3] as Task['category'],
        priority: row[4] as Task['priority'],
        createdAt: row[5] as string,
        projectId: row[6] as string | undefined,
        dueDate: row[7] as string | undefined,
        order: row[8] as number,
    }));
}

/**
 * Get tasks by category.
 */
export function getTasksByCategory(category: Task['category']): Task[] {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM tasks WHERE category = ? ORDER BY task_order ASC');
    stmt.bind([category]);

    const tasks: Task[] = [];
    while (stmt.step()) {
        const row = stmt.get();
        tasks.push({
            id: row[0] as string,
            title: row[1] as string,
            completed: Boolean(row[2]),
            category: row[3] as Task['category'],
            priority: row[4] as Task['priority'],
            createdAt: row[5] as string,
            projectId: row[6] as string | undefined,
            dueDate: row[7] as string | undefined,
            order: row[8] as number,
        });
    }
    stmt.free();

    return tasks;
}

/**
 * Insert a new task.
 */
export function insertTask(task: Task): void {
    const db = getDatabase();
    db.run(
        `INSERT INTO tasks (id, title, completed, category, priority, created_at, project_id, due_date, task_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            task.id,
            task.title,
            task.completed ? 1 : 0,
            task.category,
            task.priority,
            task.createdAt,
            task.projectId || null,
            task.dueDate || null,
            task.order || 0,
        ]
    );
    saveDatabase();
}

/**
 * Update an existing task.
 */
export function updateTask(task: Task): void {
    const db = getDatabase();
    db.run(
        `UPDATE tasks SET 
            title = ?, completed = ?, category = ?, priority = ?, 
            project_id = ?, due_date = ?, task_order = ?
         WHERE id = ?`,
        [
            task.title,
            task.completed ? 1 : 0,
            task.category,
            task.priority,
            task.projectId || null,
            task.dueDate || null,
            task.order || 0,
            task.id,
        ]
    );
    saveDatabase();
}

/**
 * Delete a task by ID.
 */
export function deleteTask(id: string): void {
    const db = getDatabase();
    db.run('DELETE FROM tasks WHERE id = ?', [id]);
    saveDatabase();
}

/**
 * Toggle task completion status.
 */
export function toggleTask(id: string): void {
    const db = getDatabase();
    db.run('UPDATE tasks SET completed = NOT completed WHERE id = ?', [id]);
    saveDatabase();
}

/**
 * Update task order for a category.
 */
export function updateTaskOrder(_category: Task['category'], orderedIds: string[]): void {
    const db = getDatabase();
    orderedIds.forEach((id, index) => {
        db.run('UPDATE tasks SET task_order = ? WHERE id = ?', [index, id]);
    });
    saveDatabase();
}

/**
 * Get count of tasks by category.
 */
export function getTaskCount(): { total: number; completed: number } {
    const db = getDatabase();
    const totalResult = db.exec('SELECT COUNT(*) FROM tasks');
    const completedResult = db.exec('SELECT COUNT(*) FROM tasks WHERE completed = 1');

    return {
        total: totalResult.length > 0 ? Number(totalResult[0].values[0][0]) : 0,
        completed: completedResult.length > 0 ? Number(completedResult[0].values[0][0]) : 0,
    };
}
