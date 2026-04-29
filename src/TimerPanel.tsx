import React from 'react';
import type { Task } from './types';

interface TimerPanelProps {
  task: Task | null;
  timeRemaining: number;
  totalSeconds: number;
  timerRunning: boolean;
  allComplete: boolean;
  onToggle: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const RADIUS = 140;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SVG_SIZE = 320;
const CENTER = SVG_SIZE / 2;

const TimerPanel: React.FC<TimerPanelProps> = ({
  task,
  timeRemaining,
  totalSeconds,
  timerRunning,
  allComplete,
  onToggle,
}) => {
  if (allComplete) {
    return (
      <div className="timer-panel">
        <div className="timer-complete">
          <div className="timer-complete-icon">🎉</div>
          <h2 className="timer-complete-title">All Done!</h2>
          <p className="timer-complete-sub">Great work today!</p>
        </div>
      </div>
    );
  }

  const progress = totalSeconds > 0 ? timeRemaining / totalSeconds : 1;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const isUrgent = timeRemaining > 0 && timeRemaining <= 60;
  const arcColor = isUrgent ? 'var(--danger)' : 'var(--accent)';

  let statusText = 'Paused';
  if (timerRunning) statusText = 'Running';
  else if (timeRemaining === 0) statusText = 'Time Up';

  return (
    <div className="timer-panel">
      <h2 className="timer-task-label">{task ? task.label : '—'}</h2>

      <div className="timer-circle-wrap">
        <svg
          width={SVG_SIZE}
          height={SVG_SIZE}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          aria-label={
            task
              ? `Timer: ${formatTime(timeRemaining)} remaining`
              : 'No active task'
          }
        >
          {/* Background track */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="var(--track)"
            strokeWidth="20"
          />
          {/* Progress arc */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke={arcColor}
            strokeWidth="20"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
            style={{
              transition: timerRunning
                ? 'stroke-dashoffset 1s linear, stroke 0.3s'
                : 'stroke 0.3s',
            }}
          />
          {/* Time display */}
          <text
            x={CENTER}
            y={CENTER - 14}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--text)"
            fontSize="56"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {task ? formatTime(timeRemaining) : '--:--'}
          </text>
          {/* Status label */}
          <text
            x={CENTER}
            y={CENTER + 40}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={timerRunning ? arcColor : 'var(--muted)'}
            fontSize="22"
            fontFamily="sans-serif"
          >
            {statusText}
          </text>
        </svg>
      </div>

      <button
        className={`timer-toggle-btn${timerRunning ? ' btn-pause' : ' btn-start'}`}
        onClick={onToggle}
        disabled={!task || task.completed}
        aria-label={timerRunning ? 'Pause timer' : 'Start timer'}
      >
        {timerRunning ? '⏸ Pause' : '▶ Start'}
      </button>
    </div>
  );
};

export default TimerPanel;
