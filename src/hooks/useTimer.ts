/**
 * @fileoverview Pomodoro timer hook for focus sessions
 * 
 * Implements the Pomodoro Technique with alternating focus and break sessions.
 * Persists timer state to localStorage so progress isn't lost on page refresh.
 * 
 * @module hooks/useTimer
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { TimerState } from '../types';

/** Focus session duration in seconds (25 minutes) */
const FOCUS_DURATION = 25 * 60;

/** Break session duration in seconds (5 minutes) */
const BREAK_DURATION = 5 * 60;

/**
 * Hook for managing a Pomodoro-style focus timer.
 * 
 * Features:
 * - Alternates between 25-min focus and 5-min break sessions
 * - Tracks completed sessions
 * - Persists state across page reloads
 * - Provides formatted time display
 * 
 * @returns Timer state and control functions
 * 
 * @example
 * ```tsx
 * const { formattedTime, isRunning, start, pause, reset } = useTimer();
 * 
 * return (
 *   <div>
 *     <span>{formattedTime}</span>
 *     <button onClick={isRunning ? pause : start}>
 *       {isRunning ? 'Pause' : 'Start'}
 *     </button>
 *   </div>
 * );
 * ```
 */
export function useTimer() {
    // Persist timer state to localStorage
    const [timerState, setTimerState] = useLocalStorage<TimerState>('zen-timer', {
        duration: FOCUS_DURATION,
        remaining: FOCUS_DURATION,
        isRunning: false,
        sessions: 0,
        mode: 'focus',
    });

    // Local state for real-time countdown (more responsive than localStorage)
    const [localRemaining, setLocalRemaining] = useState(timerState.remaining);
    const intervalRef = useRef<number | null>(null);

    // Sync local state with persisted state
    useEffect(() => {
        setLocalRemaining(timerState.remaining);
    }, [timerState.remaining]);

    /**
     * Decrements the timer by one second.
     * Handles session completion and mode switching.
     */
    const tick = useCallback(() => {
        setLocalRemaining((prev) => {
            if (prev <= 1) {
                // Timer complete - switch modes
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }

                const newMode = timerState.mode === 'focus' ? 'break' : 'focus';
                const newDuration = newMode === 'focus' ? FOCUS_DURATION : BREAK_DURATION;
                const newSessions = timerState.mode === 'focus' ? timerState.sessions + 1 : timerState.sessions;

                setTimerState({
                    duration: newDuration,
                    remaining: newDuration,
                    isRunning: false,
                    sessions: newSessions,
                    mode: newMode,
                });

                return newDuration;
            }
            return prev - 1;
        });
    }, [timerState.mode, timerState.sessions, setTimerState]);

    /**
     * Starts the timer countdown.
     */
    const start = useCallback(() => {
        if (!timerState.isRunning && !intervalRef.current) {
            intervalRef.current = window.setInterval(tick, 1000);
            setTimerState((prev) => ({ ...prev, isRunning: true }));
        }
    }, [timerState.isRunning, tick, setTimerState]);

    /**
     * Pauses the timer, preserving the remaining time.
     */
    const pause = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setTimerState((prev) => ({ ...prev, isRunning: false, remaining: localRemaining }));
    }, [localRemaining, setTimerState]);

    /**
     * Resets the timer to the current mode's full duration.
     */
    const reset = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        const duration = timerState.mode === 'focus' ? FOCUS_DURATION : BREAK_DURATION;
        setLocalRemaining(duration);
        setTimerState((prev) => ({
            ...prev,
            duration,
            remaining: duration,
            isRunning: false,
        }));
    }, [timerState.mode, setTimerState]);

    /**
     * Skips to the next session (focus -> break or break -> focus).
     */
    const skipToNext = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        const newMode = timerState.mode === 'focus' ? 'break' : 'focus';
        const newDuration = newMode === 'focus' ? FOCUS_DURATION : BREAK_DURATION;
        setLocalRemaining(newDuration);
        setTimerState({
            duration: newDuration,
            remaining: newDuration,
            isRunning: false,
            sessions: timerState.sessions,
            mode: newMode,
        });
    }, [timerState.mode, timerState.sessions, setTimerState]);

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Resume timer if it was running (e.g., after page reload)
    useEffect(() => {
        if (timerState.isRunning && !intervalRef.current) {
            intervalRef.current = window.setInterval(tick, 1000);
        }
    }, [timerState.isRunning, tick]);

    /**
     * Formats seconds into MM:SS display format.
     */
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate progress percentage for circular indicator
    const progress = ((timerState.duration - localRemaining) / timerState.duration) * 100;

    return {
        ...timerState,
        remaining: localRemaining,
        progress,
        formattedTime: formatTime(localRemaining),
        start,
        pause,
        reset,
        skipToNext,
    };
}
