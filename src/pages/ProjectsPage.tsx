import { useState } from 'react';
import { ProjectList, ProjectDetailModal } from '../components/projects';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import type { Project } from '../types';

export function ProjectsPage() {
    const { projects, addProject, updateProject, changeStatus, deleteProject } = useProjects();
    const { addTask, toggleTask, deleteTask, getTasksByProject } = useTasks();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const handleOpenProject = (project: Project) => {
        setSelectedProject(project);
    };

    const handleCloseProject = () => {
        setSelectedProject(null);
    };

    // Get tasks for selected project
    const projectTasks = selectedProject ? getTasksByProject(selectedProject.id) : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-zen-text">Projects</h1>
                <p className="text-zen-text-secondary">Track your ongoing work and progress</p>
            </div>

            {/* Projects List */}
            <ProjectList
                projects={projects}
                onStatusChange={changeStatus}
                onDelete={deleteProject}
                onAdd={addProject}
                onOpenProject={handleOpenProject}
            />

            {/* Project Detail Modal */}
            <ProjectDetailModal
                project={selectedProject}
                projectTasks={projectTasks}
                isOpen={!!selectedProject}
                onClose={handleCloseProject}
                onUpdateProject={updateProject}
                onDeleteProject={deleteProject}
                onAddTask={addTask}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
            />
        </div>
    );
}
