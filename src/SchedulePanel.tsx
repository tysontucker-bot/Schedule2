import React from 'react';
import type { Task } from './types';
import TaskRow from './TaskRow';

interface SchedulePanelProps {
  tasks: Task[];
  currentTaskIndex: number;
  onComplete: (taskId: string) => void;
}

const SchedulePanel: React.FC<SchedulePanelProps> = ({
  tasks,
  currentTaskIndex,
  onComplete,
}) => {
  return (
    <div className="schedule-panel">
      <h1 className="schedule-title">Today's Schedule</h1>
      <div className="task-list">
        {tasks.map((task, index) => (
          <TaskRow
            key={task.id}
            task={task}
            isCurrent={index === currentTaskIndex}
            onComplete={onComplete}
          />
        ))}
      </div>
    </div>
  );
};

export default SchedulePanel;
