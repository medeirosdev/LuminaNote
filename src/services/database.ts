/**
 * @fileoverview SQLite Database Service using sql.js
 * 
 * Provides a persistent SQLite database for storing tasks, projects, and settings.
 * Uses sql.js (SQLite compiled to WebAssembly) for browser/Electron compatibility.
 * Data is persisted to localStorage and can be exported/imported.
 * 
 * @module services/database
 */

import initSqlJs from 'sql.js';
import type { Database } from 'sql.js';

// Singleton database instance
let db: Database | null = null;
let dbInitPromise: Promise<Database> | null = null;

// LocalStorage key for database persistence
const DB_STORAGE_KEY = 'luminanote-sqlite-db';

/**
 * Initialize the SQLite database.
 * Loads existing data from localStorage or creates a new database.
 */
export async function initDatabase(): Promise<Database> {
    if (db) return db;
    if (dbInitPromise) return dbInitPromise;

    dbInitPromise = (async () => {
        // Initialize sql.js with WASM
        const SQL = await initSqlJs({
            // Load sql-wasm.wasm from CDN
            locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
        });

        // Try to load existing database from localStorage
        const savedData = localStorage.getItem(DB_STORAGE_KEY);
        if (savedData) {
            try {
                const uint8Array = new Uint8Array(
                    atob(savedData).split('').map(c => c.charCodeAt(0))
                );
                db = new SQL.Database(uint8Array);
                console.log('[Database] Loaded existing database from localStorage');
            } catch (error) {
                console.warn('[Database] Failed to load saved database, creating new one:', error);
                db = new SQL.Database();
                createTables(db);
            }
        } else {
            db = new SQL.Database();
            createTables(db);
            console.log('[Database] Created new database');
        }

        return db;
    })();

    return dbInitPromise;
}

/**
 * Create database tables if they don't exist.
 */
function createTables(database: Database): void {
    database.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            category TEXT NOT NULL,
            priority TEXT DEFAULT 'medium',
            created_at TEXT NOT NULL,
            project_id TEXT,
            due_date TEXT,
            task_order INTEGER DEFAULT 0
        );
    `);

    database.run(`
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            progress INTEGER DEFAULT 0,
            total_tasks INTEGER DEFAULT 0,
            completed_tasks INTEGER DEFAULT 0,
            color TEXT DEFAULT 'slate',
            status TEXT DEFAULT 'active',
            created_at TEXT NOT NULL,
            deadline TEXT,
            tags TEXT
        );
    `);

    database.run(`
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        );
    `);

    console.log('[Database] Tables created');
}

/**
 * Save the database to localStorage.
 * Call this after making changes to persist them.
 */
export function saveDatabase(): void {
    if (!db) return;

    try {
        const data = db.export();
        const base64 = btoa(String.fromCharCode(...data));
        localStorage.setItem(DB_STORAGE_KEY, base64);
        console.log('[Database] Saved to localStorage');
    } catch (error) {
        console.error('[Database] Failed to save:', error);
    }
}

/**
 * Get the database instance.
 * Throws if database is not initialized.
 */
export function getDatabase(): Database {
    if (!db) {
        throw new Error('Database not initialized. Call initDatabase() first.');
    }
    return db;
}

/**
 * Check if database is initialized.
 */
export function isDatabaseInitialized(): boolean {
    return db !== null;
}

/**
 * Export database as a downloadable file.
 */
export function exportDatabase(): Uint8Array | null {
    if (!db) return null;
    return db.export();
}

/**
 * Import database from a file.
 */
export async function importDatabase(data: Uint8Array): Promise<void> {
    const SQL = await initSqlJs({
        locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
    });

    if (db) {
        db.close();
    }

    db = new SQL.Database(data);
    saveDatabase();
}

/**
 * Close the database connection.
 */
export function closeDatabase(): void {
    if (db) {
        saveDatabase();
        db.close();
        db = null;
        dbInitPromise = null;
    }
}
