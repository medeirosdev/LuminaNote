/**
 * @fileoverview About Modal Component
 * 
 * Displays information about the app author in a modal dialog.
 * 
 * @module components/layout/AboutModal
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, Linkedin, Github, GraduationCap, Sparkles } from 'lucide-react';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                                   w-full max-w-md bg-zen-card rounded-zen-lg shadow-zen-lg 
                                   border border-zen-border z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-zen-accent/10 to-zen-sage/10 p-6 pb-8">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-1 rounded-zen text-zen-text-muted 
                                         hover:text-zen-text hover:bg-zen-surface transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-zen-accent to-zen-sage 
                                              flex items-center justify-center text-white text-xl font-bold shadow-zen-md">
                                    GM
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-zen-text">
                                        Guilherme de Medeiros
                                    </h2>
                                    <p className="text-sm text-zen-text-secondary">
                                        Software Engineer
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            {/* About */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-zen-text-secondary">
                                    <GraduationCap size={16} />
                                    <span className="text-sm font-medium">Education & Research</span>
                                </div>
                                <p className="text-sm text-zen-text-muted pl-6">
                                    Computational and Applied Mathematics @ UNICAMP
                                    <br />
                                    Undergraduate Researcher @ Recod.ai
                                </p>
                            </div>

                            {/* App Info */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-zen-text-secondary">
                                    <Sparkles size={16} />
                                    <span className="text-sm font-medium">About LuminaNote</span>
                                </div>
                                <p className="text-sm text-zen-text-muted pl-6">
                                    A productivity dashboard designed to be simple, clean, and lightweight.
                                </p>
                            </div>

                            {/* Links */}
                            <div className="flex gap-3 pt-4 border-t border-zen-border">
                                <a
                                    href="https://www.linkedin.com/in/guilhermedemedeiros/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 
                                             bg-[#0077B5] text-white rounded-zen text-sm font-medium
                                             hover:bg-[#006097] transition-colors"
                                >
                                    <Linkedin size={16} />
                                    LinkedIn
                                </a>
                                <a
                                    href="https://github.com/medeirosdev"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 
                                             bg-zen-surface text-zen-text rounded-zen text-sm font-medium
                                             hover:bg-zen-border transition-colors border border-zen-border"
                                >
                                    <Github size={16} />
                                    GitHub
                                </a>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-zen-surface/50 px-6 py-3 text-center">
                            <p className="text-xs text-zen-text-muted">
                                Made with calm and clarity ✨
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
