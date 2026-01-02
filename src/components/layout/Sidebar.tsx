import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    CheckSquare,
    FolderKanban,
    Timer,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Sun,
    Moon
} from 'lucide-react';
import type { NavItem } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface SidebarProps {
    activeNav: NavItem;
    onNavChange: (nav: NavItem) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const navItems: { id: NavItem; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'focus', label: 'Focus', icon: Timer },
];

export function Sidebar({ activeNav, onNavChange, isCollapsed, onToggleCollapse }: SidebarProps) {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 72 : 240 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="h-full bg-zen-surface border-r border-zen-border flex flex-col"
        >
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-zen-border">
                <motion.div
                    className="flex items-center gap-3 overflow-hidden"
                    animate={{ opacity: 1 }}
                >
                    <div className="w-9 h-9 rounded-zen bg-gradient-to-br from-zen-accent to-zen-sage flex items-center justify-center shrink-0">
                        <Sparkles size={18} className="text-white" />
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className="font-semibold text-zen-text whitespace-nowrap overflow-hidden"
                            >
                                LuminaNote
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeNav === item.id;

                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => onNavChange(item.id)}
                                    className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-zen
                    transition-all duration-200 group relative
                    ${isActive
                                            ? 'bg-zen-card text-zen-accent shadow-zen-sm'
                                            : 'text-zen-text-secondary hover:bg-zen-card/50 hover:text-zen-text'
                                        }
                  `}
                                >
                                    <Icon size={20} />
                                    <AnimatePresence>
                                        {!isCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.15 }}
                                                className="font-medium text-sm whitespace-nowrap"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    {/* Active indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-zen-accent rounded-r-full"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Theme Toggle & Collapse */}
            <div className="p-3 border-t border-zen-border space-y-2">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-zen
                     text-zen-text-muted hover:text-zen-text hover:bg-zen-card/50
                     transition-colors duration-200"
                >
                    <motion.div
                        initial={false}
                        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                    </motion.div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-sm"
                            >
                                {theme === 'dark' ? 'Dark' : 'Light'}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>

                {/* Collapse Toggle */}
                <button
                    onClick={onToggleCollapse}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-zen
                     text-zen-text-muted hover:text-zen-text hover:bg-zen-card/50
                     transition-colors duration-200"
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-sm"
                            >
                                Collapse
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </motion.aside>
    );
}
