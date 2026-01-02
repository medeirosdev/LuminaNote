/**
 * @fileoverview Database Provider Context
 * 
 * Provides database initialization state to the entire application.
 * Components should check isReady before accessing the database.
 * 
 * @module hooks/useDatabase
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { initDatabase, closeDatabase } from '../services/database';

interface DatabaseContextType {
    isReady: boolean;
    isError: boolean;
    error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextType>({
    isReady: false,
    isError: false,
    error: null,
});

interface DatabaseProviderProps {
    children: ReactNode;
}

/**
 * Provider component that initializes the SQLite database.
 * Wrap your app with this component to enable database access.
 */
export function DatabaseProvider({ children }: DatabaseProviderProps) {
    const [isReady, setIsReady] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let mounted = true;

        const init = async () => {
            try {
                await initDatabase();
                if (mounted) {
                    setIsReady(true);
                    console.log('[DatabaseProvider] Database initialized successfully');
                }
            } catch (err) {
                if (mounted) {
                    setIsError(true);
                    setError(err instanceof Error ? err : new Error('Failed to initialize database'));
                    console.error('[DatabaseProvider] Database initialization failed:', err);
                }
            }
        };

        init();

        return () => {
            mounted = false;
            closeDatabase();
        };
    }, []);

    return (
        <DatabaseContext.Provider value={{ isReady, isError, error }}>
            {children}
        </DatabaseContext.Provider>
    );
}

/**
 * Hook to access database initialization state.
 */
export function useDatabase() {
    return useContext(DatabaseContext);
}
