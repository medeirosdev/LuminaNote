import { motion } from 'framer-motion';
import iconImg from '../../assets/icon.png';

interface SplashScreenProps {
    onComplete: () => void;
}

/**
 * Splash screen component displayed on app startup.
 * Shows logo, tagline, and transitions out after animation.
 */
export function SplashScreen({ onComplete }: SplashScreenProps) {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zen-bg"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={(definition) => {
                // Only trigger onComplete when exit animation finishes
                if (definition === 'exit') {
                    onComplete();
                }
            }}
        >
            {/* Logo */}
            <motion.img
                src={iconImg}
                alt="LuminaNote"
                className="w-28 h-28 mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.8,
                    ease: [0.4, 0, 0.2, 1],
                }}
            />

            {/* App Name */}
            <motion.h1
                className="text-3xl font-light text-zen-text mb-3 tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
                LuminaNote
            </motion.h1>

            {/* Tagline */}
            <motion.p
                className="text-sm text-zen-text-muted tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
            >
                Focus. Breathe. Accomplish.
            </motion.p>

            {/* Subtle loading indicator */}
            <motion.div
                className="mt-10 w-16 h-0.5 bg-zen-accent/30 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
            >
                <motion.div
                    className="h-full bg-zen-accent"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.9, duration: 1.3, ease: 'easeInOut' }}
                    onAnimationComplete={onComplete}
                />
            </motion.div>
        </motion.div>
    );
}
