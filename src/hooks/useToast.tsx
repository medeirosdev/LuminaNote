/**
 * @fileoverview Toast notification system with context
 * 
 * Provides a global toast notification system for showing brief,
 * non-blocking messages to the user. Toasts auto-dismiss after 3 seconds.
 * 
 * @module hooks/useToast
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

/** Types of toast notifications */
type ToastType = 'success' | 'error' | 'info';

/** Individual toast data */
interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

/** Context value shape */
interface ToastContextType {
    /** Show a toast notification */
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/** Icon mapping for toast types */
const toastIcons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
};

/** Style mapping for toast types */
const toastStyles = {
    success: 'bg-zen-sage text-white',
    error: 'bg-rose-500 text-white',
    info: 'bg-zen-accent text-white',
};

/**
 * Provider component for the toast notification system.
 * Renders the toast container and manages toast state.
 * 
 * @param children - Child components that will have access to toast context
 * 
 * @example
 * ```tsx
 * // In main.tsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * ```
 */
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    /**
     * Shows a toast notification.
     * 
     * @param message - Text to display
     * @param type - Toast style: 'success' | 'error' | 'info'
     */
    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = `toast_${Date.now()}`;
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    /** Manually dismiss a toast */
    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container - Fixed position bottom-right */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => {
                        const Icon = toastIcons[toast.type];
                        return (
                            <motion.div
                                key={toast.id}
                                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-zen-lg shadow-zen-lg ${toastStyles[toast.type]}`}
                            >
                                <Icon size={18} />
                                <span className="text-sm font-medium">{toast.message}</span>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
                                    aria-label="Dismiss notification"
                                >
                                    <X size={14} />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

/**
 * Hook to show toast notifications from any component.
 * Must be used within a ToastProvider.
 * 
 * @returns Object with showToast function
 * @throws Error if used outside of ToastProvider
 * 
 * @example
 * ```tsx
 * const { showToast } = useToast();
 * 
 * const handleSave = () => {
 *   saveData();
 *   showToast('Saved successfully!', 'success');
 * };
 * 
 * const handleError = () => {
 *   showToast('Something went wrong', 'error');
 * };
 * ```
 */
export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
