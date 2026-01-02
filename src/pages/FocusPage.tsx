import { motion } from 'framer-motion';
import { PomodoroTimer } from '../components/focus';
import { useTimer } from '../hooks/useTimer';

export function FocusPage() {
    const { sessions } = useTimer();

    return (
        <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="max-w-md w-full bg-zen-card rounded-zen-xl p-8 border border-zen-border shadow-zen-lg"
            >
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-zen-text">Focus Mode</h1>
                    <p className="text-zen-text-secondary mt-1">
                        Stay present. One task at a time.
                    </p>
                </div>

                <PomodoroTimer />

                {/* Tips */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 p-4 bg-zen-surface rounded-zen text-center"
                >
                    <p className="text-xs text-zen-text-muted">
                        💡 <span className="text-zen-text-secondary">Tip:</span> Take a 5-minute break after each focus session to maintain productivity.
                    </p>
                </motion.div>
            </motion.div>

            {/* Session History */}
            {sessions > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-zen-sage/10 rounded-full">
                        <span className="text-zen-sage font-medium">{sessions}</span>
                        <span className="text-zen-text-secondary text-sm">
                            focus session{sessions !== 1 ? 's' : ''} completed
                        </span>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
