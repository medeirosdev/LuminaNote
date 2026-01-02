import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface BentoGridProps {
    children: ReactNode;
}

interface BentoCardProps {
    children: ReactNode;
    className?: string;
    span?: 'default' | 'wide' | 'tall' | 'large';
}

const spanClasses = {
    default: '',
    wide: 'md:col-span-2',
    tall: 'md:row-span-2',
    large: 'md:col-span-2 md:row-span-2',
};

export function BentoGrid({ children }: BentoGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
            {children}
        </div>
    );
}

export function BentoCard({ children, className = '', span = 'default' }: BentoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01, y: -2 }}
            transition={{ duration: 0.2 }}
            className={`
        bg-zen-card rounded-zen-lg p-5 border border-zen-border
        shadow-zen-sm hover:shadow-zen-md transition-shadow duration-300
        ${spanClasses[span]}
        ${className}
      `}
        >
            {children}
        </motion.div>
    );
}
