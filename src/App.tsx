import { useReducer, useCallback, useEffect } from 'react';
import type { Task } from './types';
import TimerPanel from './TimerPanel';
import SchedulePanel from './SchedulePanel';

const INITIAL_TASKS: Task[] = [
  { id: 'morning-meeting', label: 'Morning Meeting', duration: 10, completed: false },
  { id: 'reading', label: 'Reading', duration: 20, completed: false },
  { id: 'math', label: 'Math', duration: 20, completed: false },
  { id: 'snack-break', label: 'Snack Break', duration: 10, completed: false },
  { id: 'writing', label: 'Writing', duration: 15, completed: false },
];

interface AppState {
  tasks: Task[];
  currentTaskIndex: number;
  timerRunning: boolean;
  timeRemaining: number;
}

type AppAction =
  | { type: 'TOGGLE_TIMER' }
  | { type: 'TICK' }
  | { type: 'MARK_COMPLETE'; taskId: string };

function findNextIndex(tasks: Task[], fromIndex: number): number {
  for (let i = fromIndex + 1; i < tasks.length; i++) {
    if (!tasks[i].completed) return i;
  }
  return -1;
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TOGGLE_TIMER': {
      const task = state.tasks[state.currentTaskIndex];
      if (!task || task.completed) return state;
      return { ...state, timerRunning: !state.timerRunning };
    }
    case 'TICK': {
      if (!state.timerRunning) return state;
      const newTime = state.timeRemaining <= 1 ? 0 : state.timeRemaining - 1;
      if (newTime === 0) {
        // Timer expired — advance to next incomplete task
        const nextIndex = findNextIndex(state.tasks, state.currentTaskIndex);
        if (nextIndex !== -1) {
          return {
            ...state,
            timerRunning: false,
            currentTaskIndex: nextIndex,
            timeRemaining: state.tasks[nextIndex].duration * 60,
          };
        }
        return { ...state, timerRunning: false, timeRemaining: 0 };
      }
      return { ...state, timeRemaining: newTime };
    }
    case 'MARK_COMPLETE': {
      const updatedTasks = state.tasks.map((t) =>
        t.id === action.taskId ? { ...t, completed: true } : t,
      );
      const isCurrent = state.tasks[state.currentTaskIndex]?.id === action.taskId;
      if (!isCurrent) {
        return { ...state, tasks: updatedTasks };
      }
      // Current task completed — stop timer and advance to next
      const nextIndex = findNextIndex(updatedTasks, state.currentTaskIndex);
      if (nextIndex !== -1) {
        return {
          ...state,
          tasks: updatedTasks,
          timerRunning: false,
          currentTaskIndex: nextIndex,
          timeRemaining: updatedTasks[nextIndex].duration * 60,
        };
      }
      return { ...state, tasks: updatedTasks, timerRunning: false };
    }
    default:
      return state;
  }
}

function playCompletionSound(): void {
  try {
    new Audio('/mixkit-game-level-completed-2059.wav').play().catch(() => {});
  } catch {
    // Audio not supported
  }
}

const INITIAL_STATE: AppState = {
  tasks: INITIAL_TASKS,
  currentTaskIndex: 0,
  timerRunning: false,
  timeRemaining: INITIAL_TASKS[0].duration * 60,
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // Run a 1-second interval while the timer is active
  useEffect(() => {
    if (!state.timerRunning) return;
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(id);
  }, [state.timerRunning]);

  const handleToggle = useCallback(() => {
    dispatch({ type: 'TOGGLE_TIMER' });
  }, []);

  const handleComplete = useCallback((taskId: string) => {
    playCompletionSound();
    dispatch({ type: 'MARK_COMPLETE', taskId });
  }, []);

  const allComplete = state.tasks.every((t) => t.completed);
  const currentTask = state.tasks[state.currentTaskIndex] ?? null;
  const totalSeconds = currentTask ? currentTask.duration * 60 : 0;

  return (
    <div className="app">
      <TimerPanel
        task={currentTask}
        timeRemaining={state.timeRemaining}
        totalSeconds={totalSeconds}
        timerRunning={state.timerRunning}
        allComplete={allComplete}
        onToggle={handleToggle}
      />
      <SchedulePanel
        tasks={state.tasks}
        currentTaskIndex={state.currentTaskIndex}
        onComplete={handleComplete}
      />
    </div>
  );
}
