import React from 'react';
import type { Task } from './types';

interface TaskRowProps {
  task: Task;
  isCurrent: boolean;
  onComplete: (taskId: string) => void;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, isCurrent, onComplete }) => {
  const rowClass = [
    'task-row',
    isCurrent ? 'task-row--current' : '',
    task.completed ? 'task-row--completed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rowClass}>
      <div className="task-row-info">
        {task.completed && <span className="task-check">✓</span>}
        <span className={`task-label${task.completed ? ' task-label--done' : ''}`}>
          {task.label}
        </span>
        <span className="task-duration">{task.duration} min</span>
      </div>
      <button
        className="btn-done"
        onClick={() => onComplete(task.id)}
        disabled={task.completed}
        aria-label={`Mark ${task.label} complete`}
      >
        {task.completed ? '✓ Done' : 'Done ✓'}
      </button>
    </div>
  );
};

export default TaskRow;
