/**
 * @fileoverview Theme context and hook for dark/light mode
 * 
 * Provides application-wide theming with automatic localStorage persistence.
 * The theme is applied by adding/removing the 'dark' class on the document root.
 * 
 * @module hooks/useTheme
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useLocalStorage } from './useLocalStorage';

/** Available theme options */
type Theme = 'light' | 'dark';

/** Context value shape */
interface ThemeContextType {
    /** Current active theme */
    theme: Theme;
    /** Toggle between light and dark mode */
    toggleTheme: () => void;
    /** Set a specific theme */
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Provider component for the theme context.
 * Wrap your app with this to enable theming.
 * 
 * @param children - Child components that will have access to theme context
 * 
 * @example
 * ```tsx
 * // In main.tsx or App.tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useLocalStorage<Theme>('lumina-theme', 'light');
    const [mounted, setMounted] = useState(false);

    // Prevent flash of wrong theme on initial load
    useEffect(() => {
        setMounted(true);
    }, []);

    // Apply theme class to document root
    useEffect(() => {
        if (mounted) {
            const root = document.documentElement;
            if (theme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    }, [theme, mounted]);

    /** Toggle between light and dark themes */
    const toggleTheme = () => {
        setThemeState(theme === 'light' ? 'dark' : 'light');
    };

    /** Set a specific theme directly */
    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * Hook to access the current theme and theme controls.
 * Must be used within a ThemeProvider.
 * 
 * @returns Theme context value with current theme and control functions
 * @throws Error if used outside of ThemeProvider
 * 
 * @example
 * ```tsx
 * const { theme, toggleTheme } = useTheme();
 * 
 * return (
 *   <button onClick={toggleTheme}>
 *     {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
 *   </button>
 * );
 * ```
 */
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
