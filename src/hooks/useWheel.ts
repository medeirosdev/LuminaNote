/**
 * @fileoverview Random wheel hook for the decision wheel feature
 * 
 * Manages customizable wheel options that persist in localStorage.
 * 
 * @module hooks/useWheel
 */

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { WheelOption } from '../types';

/**
 * Default wheel segment colors - muted, professional tones
 */
const defaultColors = [
    '#475569', // Slate 600
    '#64748b', // Slate 500
    '#6b7280', // Gray 500
    '#78716c', // Warm Gray
    '#84a98c', // Sage (zen-sage)
    '#52525b', // Zinc 600
];

/**
 * Default options for first-time users
 */
const defaultOptions: WheelOption[] = [
    { id: 'opt-1', label: 'Study', color: defaultColors[0] },
    { id: 'opt-2', label: 'Exercise', color: defaultColors[1] },
    { id: 'opt-3', label: 'Read', color: defaultColors[2] },
    { id: 'opt-4', label: 'Code', color: defaultColors[3] },
    { id: 'opt-5', label: 'Rest', color: defaultColors[4] },
    { id: 'opt-6', label: 'Create', color: defaultColors[5] },
];

/**
 * Hook for managing the random decision wheel state.
 * Options persist in localStorage across sessions.
 */
export function useWheel() {
    const [options, setOptions] = useLocalStorage<WheelOption[]>('lumina-wheel-options', defaultOptions);

    /**
     * Updates the label of a specific option.
     */
    const updateOptionLabel = useCallback((id: string, label: string) => {
        setOptions(prev =>
            prev.map(opt => opt.id === id ? { ...opt, label } : opt)
        );
    }, [setOptions]);

    /**
     * Gets a random option from the wheel.
     */
    const getRandomOption = useCallback((): WheelOption => {
        const randomIndex = Math.floor(Math.random() * options.length);
        return options[randomIndex];
    }, [options]);

    /**
     * Resets all options to defaults.
     */
    const resetOptions = useCallback(() => {
        setOptions(defaultOptions);
    }, [setOptions]);

    return {
        options,
        updateOptionLabel,
        getRandomOption,
        resetOptions,
    };
}
