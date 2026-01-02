import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, Trash2, Pause, Play } from 'lucide-react';
import type { Project, ProjectStatus } from '../../types';

interface ProjectCardProps {
    project: Project;
    onStatusChange?: (id: string, status: ProjectStatus) => void;
    onDelete?: (id: string) => void;
    onClick?: (project: Project) => void;
}

const colorStyles = {
    slate: {
        bg: 'bg-zen-accent/5',
        bar: 'bg-zen-accent',
        text: 'text-zen-accent',
        tag: 'bg-zen-accent/10 text-zen-accent',
    },
    sage: {
        bg: 'bg-zen-sage/10',
        bar: 'bg-zen-sage',
        text: 'text-zen-sage',
        tag: 'bg-zen-sage/10 text-zen-sage',
    },
    amber: {
        bg: 'bg-amber-50',
        bar: 'bg-amber-500',
        text: 'text-amber-600',
        tag: 'bg-amber-50 text-amber-600',
    },
    rose: {
        bg: 'bg-rose-50',
        bar: 'bg-rose-500',
        text: 'text-rose-600',
        tag: 'bg-rose-50 text-rose-600',
    },
};

const statusConfig = {
    active: { label: 'Active', class: 'bg-green-50 text-green-600' },
    'on-hold': { label: 'On Hold', class: 'bg-amber-50 text-amber-600' },
    completed: { label: 'Completed', class: 'bg-zen-accent/10 text-zen-accent' },
};

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

function getDaysUntil(deadline: string): number {
    const target = new Date(deadline);
    const today = new Date();
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function ProjectCard({ project, onStatusChange, onDelete, onClick }: ProjectCardProps) {
    const style = colorStyles[project.color];
    const statusInfo = statusConfig[project.status];
    const daysLeft = project.deadline ? getDaysUntil(project.deadline) : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => onClick?.(project)}
            className="bg-zen-card rounded-zen-lg p-5 border border-zen-border
                 shadow-zen-sm hover:shadow-zen-md transition-all duration-300
                 cursor-pointer group"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-zen ${style.bg} flex items-center justify-center`}>
                    <span className={`text-lg font-semibold ${style.text}`}>
                        {project.name.charAt(0).toUpperCase()}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
                        {statusInfo.label}
                    </span>

                    {/* Actions Menu */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        {project.status !== 'completed' && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onStatusChange?.(project.id, project.status === 'active' ? 'on-hold' : 'active');
                                }}
                                className="p-1.5 rounded-md text-zen-text-muted hover:text-zen-text
                          hover:bg-zen-surface transition-colors"
                                title={project.status === 'active' ? 'Pause project' : 'Resume project'}
                            >
                                {project.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                            </button>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(project.id);
                            }}
                            className="p-1.5 rounded-md text-zen-text-muted hover:text-rose-500
                        hover:bg-rose-50 transition-colors"
                            title="Delete project"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-2 mb-4">
                <h4 className="font-semibold text-zen-text">{project.name}</h4>
                <p className="text-sm text-zen-text-secondary line-clamp-2">
                    {project.description}
                </p>
            </div>

            {/* Tags */}
            {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${style.tag}`}
                        >
                            <Tag size={10} />
                            {tag}
                        </span>
                    ))}
                    {project.tags.length > 3 && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-zen-surface text-zen-text-muted">
                            +{project.tags.length - 3}
                        </span>
                    )}
                </div>
            )}

            {/* Progress */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-zen-text-muted">Progress</span>
                    <span className={`font-medium ${style.text}`}>{project.progress}%</span>
                </div>
                <div className="h-1.5 bg-zen-surface rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                        className={`h-full ${style.bar} rounded-full`}
                    />
                </div>
                <div className="text-xs text-zen-text-muted">
                    {project.completedTasks} of {project.totalTasks} tasks completed
                </div>
            </div>

            {/* Footer - Dates */}
            <div className="flex items-center justify-between text-xs text-zen-text-muted pt-3 border-t border-zen-border-light">
                <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>Created {formatDate(project.createdAt)}</span>
                </div>

                {project.deadline && (
                    <div className={`flex items-center gap-1 ${daysLeft !== null && daysLeft <= 7
                        ? daysLeft <= 0 ? 'text-rose-500' : 'text-amber-500'
                        : ''
                        }`}>
                        <Calendar size={12} />
                        <span>
                            {daysLeft !== null && daysLeft <= 0
                                ? 'Overdue'
                                : `${daysLeft} days left`
                            }
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
