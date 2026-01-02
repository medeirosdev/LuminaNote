/**
 * @fileoverview Generic localStorage hook with TypeScript support
 * 
 * Provides a useState-like interface for values persisted in localStorage.
 * Supports cross-tab synchronization via storage events.
 * 
 * @module hooks/useLocalStorage
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * A hook that provides persistent state using localStorage.
 * Works like useState but persists the value across page reloads.
 * 
 * @template T - The type of value being stored
 * @param key - The localStorage key to use
 * @param initialValue - Default value if no stored value exists
 * @returns Tuple of [storedValue, setValue] similar to useState
 * 
 * @example
 * ```tsx
 * const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
 * 
 * // Toggle theme
 * setTheme(prev => prev === 'light' ? 'dark' : 'light');
 * ```
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {

    /**
     * Reads and parses the value from localStorage.
     * Returns initialValue if no stored value exists or on error.
     */
    const readValue = useCallback((): T => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    }, [initialValue, key]);

    const [storedValue, setStoredValue] = useState<T>(readValue);

    /**
     * Updates both state and localStorage.
     * Supports functional updates like useState.
     */
    const setValue = useCallback((value: T | ((prev: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            setStoredValue(valueToStore);

            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    /**
     * Synchronize with changes from other tabs/windows.
     * This allows multi-tab apps to stay in sync.
     */
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue) {
                setStoredValue(JSON.parse(e.newValue));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);

    return [storedValue, setValue];
}
