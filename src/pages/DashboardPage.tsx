import { Sun, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { BentoGrid, BentoCard } from '../components/layout';
import { TaskList } from '../components/tasks';
import { ProjectCard } from '../components/projects';
import { PomodoroTimer } from '../components/focus';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';

export function DashboardPage() {
    const { todayTasks, addTask, toggleTask, deleteTask } = useTasks();
    const { projects } = useProjects();

    const completedToday = todayTasks.filter(t => t.completed).length;
    const activeProject = projects[0];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-zen-text">Good morning ✨</h1>
                <p className="text-zen-text-secondary">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>

            {/* Bento Grid */}
            <BentoGrid>
                {/* Quick Stats */}
                <BentoCard>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-zen bg-zen-sage/10 flex items-center justify-center">
                            <CheckCircle2 className="text-zen-sage" size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-zen-text">{completedToday}</p>
                            <p className="text-sm text-zen-text-muted">Tasks done today</p>
                        </div>
                    </div>
                </BentoCard>

                <BentoCard>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-zen bg-zen-accent/10 flex items-center justify-center">
                            <Calendar className="text-zen-accent" size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-zen-text">{todayTasks.length}</p>
                            <p className="text-sm text-zen-text-muted">Tasks for today</p>
                        </div>
                    </div>
                </BentoCard>

                <BentoCard>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-zen bg-priority-medium/10 flex items-center justify-center">
                            <Clock className="text-priority-medium" size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-zen-text">{projects.length}</p>
                            <p className="text-sm text-zen-text-muted">Active projects</p>
                        </div>
                    </div>
                </BentoCard>

                {/* Today's Tasks */}
                <BentoCard span="wide" className="min-h-[280px]">
                    <div className="flex items-center gap-2 mb-4">
                        <Sun className="text-zen-accent" size={18} />
                        <h3 className="font-semibold text-zen-text">Today's Focus</h3>
                    </div>
                    <TaskList
                        title=""
                        tasks={todayTasks.slice(0, 5)}
                        category="today"
                        onAdd={addTask}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                        showInput={todayTasks.length < 5}
                    />
                </BentoCard>

                {/* Active Project */}
                {activeProject && (
                    <BentoCard>
                        <h3 className="font-semibold text-zen-text mb-3">Current Project</h3>
                        <ProjectCard project={activeProject} />
                    </BentoCard>
                )}

                {/* Mini Timer Widget */}
                <BentoCard span="tall" className="flex flex-col items-center justify-center">
                    <h3 className="font-semibold text-zen-text mb-4">Focus Timer</h3>
                    <PomodoroTimer />
                </BentoCard>
            </BentoGrid>
        </div>
    );
}
