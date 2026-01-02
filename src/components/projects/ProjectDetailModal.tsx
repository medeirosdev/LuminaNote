import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Calendar,
    Clock,
    Tag,
    Edit3,
    Save,
    Plus,
    Check,
    Trash2,
    AlertCircle
} from 'lucide-react';
import type { Project, Task, ProjectColor, ProjectStatus } from '../../types';

interface ProjectDetailModalProps {
    project: Project | null;
    projectTasks: Task[];
    isOpen: boolean;
    onClose: () => void;
    onUpdateProject: (id: string, updates: Partial<Project>) => void;
    onDeleteProject: (id: string) => void;
    onAddTask: (title: string, category: Task['category'], options?: { projectId?: string; priority?: Task['priority'] }) => void;
    onToggleTask: (id: string) => void;
    onDeleteTask: (id: string) => void;
}

const colorOptions: { value: ProjectColor; label: string; class: string }[] = [
    { value: 'slate', label: 'Slate', class: 'bg-zen-accent' },
    { value: 'sage', label: 'Sage', class: 'bg-zen-sage' },
    { value: 'amber', label: 'Amber', class: 'bg-amber-500' },
    { value: 'rose', label: 'Rose', class: 'bg-rose-500' },
];

const statusOptions: { value: ProjectStatus; label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
];

export function ProjectDetailModal({
    project,
    projectTasks,
    isOpen,
    onClose,
    onUpdateProject,
    onDeleteProject,
    onAddTask,
    onToggleTask,
    onDeleteTask,
}: ProjectDetailModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        color: 'slate' as ProjectColor,
        status: 'active' as ProjectStatus,
        deadline: '',
        tags: '',
    });
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Sync form with project data
    useEffect(() => {
        if (project) {
            setEditForm({
                name: project.name,
                description: project.description,
                color: project.color,
                status: project.status,
                deadline: project.deadline ? project.deadline.split('T')[0] : '',
                tags: project.tags.join(', '),
            });
        }
    }, [project]);

    if (!project) return null;

    const completedTasks = projectTasks.filter(t => t.completed).length;
    const totalTasks = projectTasks.length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const handleSave = () => {
        onUpdateProject(project.id, {
            name: editForm.name,
            description: editForm.description,
            color: editForm.color,
            status: editForm.status,
            deadline: editForm.deadline ? new Date(editForm.deadline).toISOString() : undefined,
            tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
            progress,
            totalTasks,
            completedTasks,
        });
        setIsEditing(false);
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            onAddTask(newTaskTitle.trim(), 'backlog', { projectId: project.id });
            setNewTaskTitle('');
            // Update project task counts
            onUpdateProject(project.id, {
                totalTasks: totalTasks + 1,
                progress: Math.round((completedTasks / (totalTasks + 1)) * 100),
            });
        }
    };

    const handleToggleTask = (taskId: string) => {
        const task = projectTasks.find(t => t.id === taskId);
        if (task) {
            onToggleTask(taskId);
            const newCompleted = task.completed ? completedTasks - 1 : completedTasks + 1;
            const newProgress = totalTasks > 0 ? Math.round((newCompleted / totalTasks) * 100) : 0;
            onUpdateProject(project.id, {
                completedTasks: newCompleted,
                progress: newProgress,
            });
        }
    };

    const handleDeleteTask = (taskId: string) => {
        const task = projectTasks.find(t => t.id === taskId);
        if (task) {
            onDeleteTask(taskId);
            const newTotal = totalTasks - 1;
            const newCompleted = task.completed ? completedTasks - 1 : completedTasks;
            const newProgress = newTotal > 0 ? Math.round((newCompleted / newTotal) * 100) : 0;
            onUpdateProject(project.id, {
                totalTasks: newTotal,
                completedTasks: newCompleted,
                progress: newProgress,
            });
        }
    };

    const handleDelete = () => {
        onDeleteProject(project.id);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-zen-card rounded-zen-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-zen-lg border border-zen-border flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-zen-border">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-zen flex items-center justify-center ${editForm.color === 'slate' ? 'bg-zen-accent/10' :
                                        editForm.color === 'sage' ? 'bg-zen-sage/10' :
                                            editForm.color === 'amber' ? 'bg-amber-50' : 'bg-rose-50'
                                    }`}>
                                    <span className={`text-lg font-semibold ${editForm.color === 'slate' ? 'text-zen-accent' :
                                            editForm.color === 'sage' ? 'text-zen-sage' :
                                                editForm.color === 'amber' ? 'text-amber-600' : 'text-rose-600'
                                        }`}>
                                        {editForm.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="text-xl font-semibold text-zen-text bg-transparent border-b-2 border-zen-accent focus:outline-none"
                                        autoFocus
                                    />
                                ) : (
                                    <h2 className="text-xl font-semibold text-zen-text">{project.name}</h2>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                {isEditing ? (
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-zen-sage text-white rounded-zen text-sm hover:bg-zen-sage/90 transition-colors"
                                    >
                                        <Save size={14} />
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-zen-text-secondary hover:text-zen-text hover:bg-zen-surface rounded-zen text-sm transition-colors"
                                    >
                                        <Edit3 size={14} />
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="p-1.5 text-zen-text-muted hover:text-zen-text hover:bg-zen-surface rounded-zen transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-zen-text-secondary mb-2">Description</label>
                                {isEditing ? (
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2.5 rounded-zen border border-zen-border bg-zen-bg text-sm text-zen-text resize-none focus:outline-none focus:border-zen-accent"
                                    />
                                ) : (
                                    <p className="text-zen-text">{project.description || 'No description'}</p>
                                )}
                            </div>

                            {/* Settings Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-zen-text-secondary mb-2">Status</label>
                                    {isEditing ? (
                                        <select
                                            value={editForm.status}
                                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value as ProjectStatus })}
                                            className="w-full px-3 py-2 rounded-zen border border-zen-border bg-zen-bg text-sm focus:outline-none focus:border-zen-accent"
                                        >
                                            {statusOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${project.status === 'active' ? 'bg-green-50 text-green-600' :
                                                project.status === 'on-hold' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-zen-accent/10 text-zen-accent'
                                            }`}>
                                            {statusOptions.find(s => s.value === project.status)?.label}
                                        </span>
                                    )}
                                </div>

                                {/* Color */}
                                <div>
                                    <label className="block text-sm font-medium text-zen-text-secondary mb-2">Color</label>
                                    {isEditing ? (
                                        <div className="flex gap-2">
                                            {colorOptions.map(color => (
                                                <button
                                                    key={color.value}
                                                    type="button"
                                                    onClick={() => setEditForm({ ...editForm, color: color.value })}
                                                    className={`w-8 h-8 rounded-full ${color.class} ${editForm.color === color.value ? 'ring-2 ring-offset-2 ring-zen-accent' : ''
                                                        }`}
                                                    title={color.label}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={`w-8 h-8 rounded-full ${colorOptions.find(c => c.value === project.color)?.class}`} />
                                    )}
                                </div>

                                {/* Deadline */}
                                <div>
                                    <label className="block text-sm font-medium text-zen-text-secondary mb-2">
                                        <Calendar size={12} className="inline mr-1" />
                                        Deadline
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            value={editForm.deadline}
                                            onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                                            className="w-full px-3 py-2 rounded-zen border border-zen-border bg-zen-bg text-sm focus:outline-none focus:border-zen-accent"
                                        />
                                    ) : (
                                        <span className="text-sm text-zen-text">
                                            {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not set'}
                                        </span>
                                    )}
                                </div>

                                {/* Created */}
                                <div>
                                    <label className="block text-sm font-medium text-zen-text-secondary mb-2">
                                        <Clock size={12} className="inline mr-1" />
                                        Created
                                    </label>
                                    <span className="text-sm text-zen-text">
                                        {new Date(project.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-zen-text-secondary mb-2">
                                    <Tag size={12} className="inline mr-1" />
                                    Tags
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editForm.tags}
                                        onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                                        placeholder="design, frontend, priority (comma separated)"
                                        className="w-full px-3 py-2.5 rounded-zen border border-zen-border bg-zen-bg text-sm focus:outline-none focus:border-zen-accent"
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-1.5">
                                        {project.tags.length > 0 ? project.tags.map(tag => (
                                            <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-zen-surface text-zen-text-secondary">
                                                {tag}
                                            </span>
                                        )) : (
                                            <span className="text-sm text-zen-text-muted">No tags</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Progress */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-zen-text-secondary">Progress</label>
                                    <span className="text-sm font-semibold text-zen-accent">{progress}%</span>
                                </div>
                                <div className="h-2 bg-zen-surface rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5 }}
                                        className={`h-full rounded-full ${editForm.color === 'slate' ? 'bg-zen-accent' :
                                                editForm.color === 'sage' ? 'bg-zen-sage' :
                                                    editForm.color === 'amber' ? 'bg-amber-500' : 'bg-rose-500'
                                            }`}
                                    />
                                </div>
                                <p className="text-xs text-zen-text-muted mt-1">
                                    {completedTasks} of {totalTasks} tasks completed
                                </p>
                            </div>

                            {/* Tasks Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-zen-text">Project Tasks</h3>
                                </div>

                                {/* Add Task Form */}
                                <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        placeholder="Add a new task..."
                                        className="flex-1 px-3 py-2.5 rounded-zen border border-zen-border bg-zen-bg text-sm focus:outline-none focus:border-zen-accent"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newTaskTitle.trim()}
                                        className="px-4 py-2.5 bg-zen-accent text-white rounded-zen text-sm hover:bg-zen-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </form>

                                {/* Task List */}
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    <AnimatePresence mode="popLayout">
                                        {projectTasks.map(task => (
                                            <motion.div
                                                key={task.id}
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="flex items-center gap-3 p-3 bg-zen-surface rounded-zen group"
                                            >
                                                <button
                                                    onClick={() => handleToggleTask(task.id)}
                                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${task.completed
                                                            ? 'bg-zen-sage border-zen-sage'
                                                            : 'border-zen-border hover:border-zen-accent'
                                                        }`}
                                                >
                                                    {task.completed && <Check size={12} className="text-white" strokeWidth={3} />}
                                                </button>
                                                <span className={`flex-1 text-sm ${task.completed ? 'line-through text-zen-text-muted' : 'text-zen-text'}`}>
                                                    {task.title}
                                                </span>
                                                <button
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-zen-text-muted hover:text-rose-500 transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {projectTasks.length === 0 && (
                                        <p className="text-center text-sm text-zen-text-muted py-8">
                                            No tasks yet. Add one above to get started!
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer - Delete Action */}
                        <div className="p-4 border-t border-zen-border bg-zen-surface/50">
                            {showDeleteConfirm ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-rose-500">
                                        <AlertCircle size={16} />
                                        <span className="text-sm">Delete this project and all its tasks?</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="px-3 py-1.5 text-sm text-zen-text-secondary hover:bg-zen-surface rounded-zen transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="px-3 py-1.5 text-sm bg-rose-500 text-white rounded-zen hover:bg-rose-600 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="flex items-center gap-2 text-sm text-zen-text-muted hover:text-rose-500 transition-colors"
                                >
                                    <Trash2 size={14} />
                                    Delete project
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
