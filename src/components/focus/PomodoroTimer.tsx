import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, Coffee, Edit2 } from 'lucide-react';
import { useTimer } from '../../hooks/useTimer';

export function PomodoroTimer() {
    const {
        formattedTime,
        isRunning,
        progress,
        sessions,
        mode,
        start,
        pause,
        reset,
        skipToNext,
        setCustomDuration,
    } = useTimer();

    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleTimeClick = () => {
        if (!isRunning && mode === 'focus') {
            setIsEditing(true);
        }
    };

    const handleInputBlur = () => {
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const mins = parseInt(inputValue);
            if (!isNaN(mins) && mins > 0) {
                setCustomDuration(mins);
            }
            setIsEditing(false);
            setInputValue('');
        } else if (e.key === 'Escape') {
            setIsEditing(false);
        }
    };

    const circumference = 2 * Math.PI * 90; // radius = 90
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex flex-col items-center space-y-6">
            {/* Mode Indicator */}
            <div className="flex items-center gap-2 text-sm">
                <span className={`px-3 py-1 rounded-full ${mode === 'focus'
                    ? 'bg-zen-accent/10 text-zen-accent'
                    : 'bg-zen-sage/10 text-zen-sage'
                    }`}>
                    {mode === 'focus' ? 'Focus Time' : 'Break Time'}
                </span>
                {mode === 'break' && <Coffee size={16} className="text-zen-sage" />}
            </div>

            {/* Timer Ring */}
            <div className="relative w-52 h-52">
                {/* Background Ring */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="104"
                        cy="104"
                        r="90"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-zen-border"
                    />
                    {/* Progress Ring */}
                    <motion.circle
                        cx="104"
                        cy="104"
                        r="90"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeLinecap="round"
                        className={mode === 'focus' ? 'text-zen-accent' : 'text-zen-sage'}
                        style={{
                            strokeDasharray: circumference,
                        }}
                        animate={{
                            strokeDashoffset,
                        }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </svg>

                {/* Time Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {isEditing ? (
                        <input
                            autoFocus
                            type="number"
                            min="1"
                            max="999"
                            placeholder="min"
                            className="w-24 text-4xl text-center bg-transparent border-b-2 border-zen-accent/50 text-zen-text focus:outline-none focus:border-zen-accent"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onBlur={handleInputBlur}
                            onKeyDown={handleKeyDown}
                        />
                    ) : (
                        <div
                            className={`flex flex-col items-center justify-center ${!isRunning && mode === 'focus' ? 'cursor-pointer group' : ''}`}
                            onClick={handleTimeClick}
                            title={!isRunning && mode === 'focus' ? "Click to set custom time" : ""}
                        >
                            <div className="flex items-center gap-2">
                                <motion.span
                                    key={formattedTime}
                                    initial={{ scale: 1.1, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-4xl font-light text-zen-text tracking-wide"
                                >
                                    {formattedTime}
                                </motion.span>
                                {!isRunning && mode === 'focus' && (
                                    <Edit2 size={16} className="text-zen-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </div>
                            <span className="text-xs text-zen-text-muted mt-1">
                                Session {sessions + 1}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
                <button
                    onClick={reset}
                    className="p-3 rounded-full text-zen-text-muted hover:text-zen-text
                     hover:bg-zen-surface transition-colors duration-200"
                    title="Reset"
                >
                    <RotateCcw size={20} />
                </button>

                <motion.button
                    onClick={isRunning ? pause : start}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-full text-white shadow-zen-md transition-colors duration-200
            ${mode === 'focus'
                            ? 'bg-zen-accent hover:bg-zen-accent/90'
                            : 'bg-zen-sage hover:bg-zen-sage/90'
                        }`}
                >
                    {isRunning ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
                </motion.button>

                <button
                    onClick={skipToNext}
                    className="p-3 rounded-full text-zen-text-muted hover:text-zen-text
                     hover:bg-zen-surface transition-colors duration-200"
                    title="Skip to next"
                >
                    <SkipForward size={20} />
                </button>
            </div>

            {/* Sessions Counter */}
            {sessions > 0 && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-zen-text-secondary"
                >
                    {sessions} session{sessions !== 1 ? 's' : ''} completed today 🎉
                </motion.p>
            )}
        </div>
    );
}
