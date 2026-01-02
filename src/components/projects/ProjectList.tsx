import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FolderKanban, Clock, CheckCircle2, PauseCircle, X } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import type { Project, ProjectStatus, ProjectColor } from '../../types';

interface ProjectListProps {
    projects: Project[];
    onStatusChange?: (id: string, status: ProjectStatus) => void;
    onDelete?: (id: string) => void;
    onAdd?: (name: string, description: string, options?: { color?: ProjectColor; deadline?: string; tags?: string[] }) => void;
    onOpenProject?: (project: Project) => void;
}

type FilterStatus = 'all' | ProjectStatus;

export function ProjectList({ projects, onStatusChange, onDelete, onAdd, onOpenProject }: ProjectListProps) {
    const [filter, setFilter] = useState<FilterStatus>('all');
    const [showNewForm, setShowNewForm] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        color: 'slate' as ProjectColor,
        deadline: '',
        tags: '',
    });

    const filteredProjects = filter === 'all'
        ? projects
        : projects.filter(p => p.status === filter);

    const stats = {
        total: projects.length,
        active: projects.filter(p => p.status === 'active').length,
        onHold: projects.filter(p => p.status === 'on-hold').length,
        completed: projects.filter(p => p.status === 'completed').length,
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newProject.name.trim()) {
            onAdd?.(
                newProject.name.trim(),
                newProject.description.trim(),
                {
                    color: newProject.color,
                    deadline: newProject.deadline || undefined,
                    tags: newProject.tags.split(',').map(t => t.trim()).filter(Boolean),
                }
            );
            setNewProject({ name: '', description: '', color: 'slate', deadline: '', tags: '' });
            setShowNewForm(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zen-card rounded-zen-lg p-4 border border-zen-border"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-zen bg-zen-accent/10 flex items-center justify-center">
                            <FolderKanban className="text-zen-accent" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-zen-text">{stats.total}</p>
                            <p className="text-xs text-zen-text-muted">Total Projects</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-zen-card rounded-zen-lg p-4 border border-zen-border"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-zen bg-green-50 flex items-center justify-center">
                            <Clock className="text-green-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-zen-text">{stats.active}</p>
                            <p className="text-xs text-zen-text-muted">Active</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-zen-card rounded-zen-lg p-4 border border-zen-border"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-zen bg-amber-50 flex items-center justify-center">
                            <PauseCircle className="text-amber-600" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-zen-text">{stats.onHold}</p>
                            <p className="text-xs text-zen-text-muted">On Hold</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-zen-card rounded-zen-lg p-4 border border-zen-border"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-zen bg-zen-sage/10 flex items-center justify-center">
                            <CheckCircle2 className="text-zen-sage" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-zen-text">{stats.completed}</p>
                            <p className="text-xs text-zen-text-muted">Completed</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    {(['all', 'active', 'on-hold', 'completed'] as FilterStatus[]).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${filter === status
                                ? 'bg-zen-accent text-white'
                                : 'bg-zen-surface text-zen-text-secondary hover:bg-zen-border'
                                }`}
                        >
                            {status === 'all' ? 'All' : status === 'on-hold' ? 'On Hold' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setShowNewForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-zen-accent text-white rounded-zen
                     hover:bg-zen-accent/90 transition-colors text-sm font-medium"
                >
                    <Plus size={16} />
                    New Project
                </button>
            </div>

            {/* New Project Form Modal */}
            <AnimatePresence>
                {showNewForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowNewForm(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zen-card rounded-zen-xl p-6 w-full max-w-md shadow-zen-lg border border-zen-border"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-zen-text">New Project</h3>
                                <button
                                    onClick={() => setShowNewForm(false)}
                                    className="p-1.5 rounded-md text-zen-text-muted hover:text-zen-text
                            hover:bg-zen-surface transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zen-text mb-1.5">
                                        Project Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={newProject.name}
                                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                        placeholder="e.g., Website Redesign"
                                        className="w-full px-3 py-2.5 rounded-zen border border-zen-border bg-zen-bg
                               text-sm text-zen-text placeholder:text-zen-text-muted
                               focus:outline-none focus:border-zen-accent focus:ring-1 focus:ring-zen-accent/20"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zen-text mb-1.5">
                                        Description
                                    </label>
                                    <textarea
                                        value={newProject.description}
                                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                        placeholder="Brief description of the project..."
                                        rows={3}
                                        className="w-full px-3 py-2.5 rounded-zen border border-zen-border bg-zen-bg
                               text-sm text-zen-text placeholder:text-zen-text-muted resize-none
                               focus:outline-none focus:border-zen-accent focus:ring-1 focus:ring-zen-accent/20"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zen-text mb-1.5">
                                            Color
                                        </label>
                                        <select
                                            value={newProject.color}
                                            onChange={(e) => setNewProject({ ...newProject, color: e.target.value as ProjectColor })}
                                            className="w-full px-3 py-2.5 rounded-zen border border-zen-border bg-zen-bg
                                 text-sm text-zen-text
                                 focus:outline-none focus:border-zen-accent focus:ring-1 focus:ring-zen-accent/20"
                                        >
                                            <option value="slate">Slate</option>
                                            <option value="sage">Sage</option>
                                            <option value="amber">Amber</option>
                                            <option value="rose">Rose</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zen-text mb-1.5">
                                            Deadline
                                        </label>
                                        <input
                                            type="date"
                                            value={newProject.deadline}
                                            onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                                            className="w-full px-3 py-2.5 rounded-zen border border-zen-border bg-zen-bg
                                 text-sm text-zen-text
                                 focus:outline-none focus:border-zen-accent focus:ring-1 focus:ring-zen-accent/20"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zen-text mb-1.5">
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        value={newProject.tags}
                                        onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                                        placeholder="design, frontend, priority (comma separated)"
                                        className="w-full px-3 py-2.5 rounded-zen border border-zen-border bg-zen-bg
                               text-sm text-zen-text placeholder:text-zen-text-muted
                               focus:outline-none focus:border-zen-accent focus:ring-1 focus:ring-zen-accent/20"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowNewForm(false)}
                                        className="flex-1 py-2.5 rounded-zen text-zen-text-secondary
                              hover:bg-zen-surface transition-colors text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!newProject.name.trim()}
                                        className="flex-1 py-2.5 rounded-zen bg-zen-accent text-white text-sm font-medium
                              hover:bg-zen-accent/90 disabled:opacity-50 disabled:cursor-not-allowed
                              transition-colors"
                                    >
                                        Create Project
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onStatusChange={onStatusChange}
                            onDelete={onDelete}
                            onClick={onOpenProject}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {filteredProjects.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <FolderKanban className="mx-auto text-zen-text-muted mb-3" size={40} />
                    <p className="text-zen-text-secondary">
                        {filter === 'all'
                            ? 'No projects yet. Create one to get started!'
                            : `No ${filter} projects found.`
                        }
                    </p>
                </motion.div>
            )}
        </div>
    );
}
