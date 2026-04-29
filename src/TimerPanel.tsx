import React from 'react';
import type { Task } from './types';

interface TimerPanelProps {
  task: Task | null;
  secondsLeft: number;
  totalSeconds: number;
  isRunning: boolean;
  onStart: (taskId: number) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const TimerPanel: React.FC<TimerPanelProps> = ({
  task,
  secondsLeft,
  totalSeconds,
  isRunning,
}) => {
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 1;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const isUrgent = secondsLeft > 0 && secondsLeft < 30;
  const strokeColor = isUrgent ? 'var(--danger)' : 'var(--accent)';

  return (
    <div className="timer-panel">
      <h2 className="timer-title">
        {task ? task.label : 'Visual Schedule'}
      </h2>
      <div className="timer-circle-container">
        <svg
          width="260"
          height="260"
          viewBox="0 0 260 260"
          aria-label={task ? `Timer: ${formatTime(secondsLeft)} remaining` : 'No active timer'}
        >
          {/* Background track */}
          <circle
            cx="130"
            cy="130"
            r={RADIUS}
            fill="none"
            stroke="#2a2a4a"
            strokeWidth="16"
          />
          {/* Progress arc */}
          <circle
            cx="130"
            cy="130"
            r={RADIUS}
            fill="none"
            stroke={strokeColor}
            strokeWidth="16"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 130 130)"
            style={{ transition: isRunning ? 'stroke-dashoffset 1s linear, stroke 0.3s' : 'stroke 0.3s' }}
          />
          {/* Center text */}
          <text
            x="130"
            y="122"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--text)"
            fontSize="42"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {task ? formatTime(secondsLeft) : '--:--'}
          </text>
          {task && (
            <text
              x="130"
              y="162"
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isRunning ? strokeColor : '#888'}
              fontSize="16"
              fontFamily="sans-serif"
            >
              {isRunning ? 'Running' : 'Paused'}
            </text>
          )}
        </svg>
      </div>
      {!task && (
        <p className="timer-hint">Select a task to start</p>
      )}
    </div>
  );
};

export default TimerPanel;
