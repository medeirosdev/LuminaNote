import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
    children: ReactNode;
    sidebar: ReactNode;
}

export function Layout({ children, sidebar }: LayoutProps) {
    return (
        <div className="h-screen flex bg-zen-bg overflow-hidden">
            {sidebar}
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-auto"
            >
                <div className="min-h-full p-8">
                    {children}
                </div>
            </motion.main>
        </div>
    );
}
