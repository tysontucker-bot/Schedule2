import React from 'react';
import type { Task } from './types';

interface TaskListProps {
  tasks: Task[];
  activeTaskId: number | null;
  onStart: (id: number) => void;
  onComplete: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, activeTaskId, onStart, onComplete }) => {
  return (
    <div className="task-list">
      <h2 className="task-list-title">Today's Schedule</h2>
      {tasks.map((task) => {
        const isActive = task.id === activeTaskId;
        const cardClass = [
          'task-card',
          isActive ? 'active' : '',
          task.completed ? 'completed' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div key={task.id} className={cardClass}>
            <div className="task-info">
              <span className={`task-label${task.completed ? ' task-label--done' : ''}`}>
                {task.label}
              </span>
              <span className="task-duration">{task.duration} min</span>
            </div>
            <div className="task-actions">
              <button
                className="btn btn-start"
                onClick={() => onStart(task.id)}
                disabled={task.completed || isActive}
                aria-label={`Start ${task.label}`}
              >
                ▶ Start
              </button>
              <button
                className="btn btn-done"
                onClick={() => onComplete(task.id)}
                disabled={task.completed}
                aria-label={`Mark ${task.label} complete`}
              >
                Done ✓
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
