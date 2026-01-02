/**
 * @fileoverview Calendar page for task visualization
 * 
 * Dedicated page for the monthly calendar view displaying tasks
 * based on their due dates.
 * 
 * @module pages/CalendarPage
 */

import { CalendarView } from '../components/tasks';
import { useTasks } from '../hooks/useTasks';
import { useToast } from '../hooks/useToast';

export function CalendarPage() {
    const { tasks, toggleTask } = useTasks();
    const { showToast } = useToast();

    const handleToggleTask = (id: string) => {
        const task = tasks.find(t => t.id === id);
        toggleTask(id);
        if (task && !task.completed) {
            showToast('Task completed! 🎉', 'success');
        }
    };

    const handleAddTask = (dueDate: string) => {
        showToast(`Add task for ${new Date(dueDate).toLocaleDateString()}`, 'info');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-zen-text">Calendar</h1>
                <p className="text-zen-text-secondary">
                    View your tasks on a monthly calendar. Click a day to add a task.
                </p>
            </div>

            {/* Calendar */}
            <CalendarView
                tasks={tasks}
                onTaskToggle={handleToggleTask}
                onAddTask={handleAddTask}
            />
        </div>
    );
}
