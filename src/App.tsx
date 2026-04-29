import { useState, useRef, useEffect, useCallback } from 'react';
import type { Task } from './types';
import TimerPanel from './TimerPanel';
import TaskList from './TaskList';

const INITIAL_TASKS: Task[] = [
  { id: 1, label: 'Morning Meeting', duration: 10, completed: false },
  { id: 2, label: 'Reading', duration: 20, completed: false },
  { id: 3, label: 'Math', duration: 20, completed: false },
  { id: 4, label: 'Snack Break', duration: 10, completed: false },
  { id: 5, label: 'Writing', duration: 15, completed: false },
  { id: 6, label: 'Science', duration: 15, completed: false },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const startTimer = useCallback(
    (taskId: number) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task || task.completed) return;

      clearTimer();
      const secs = task.duration * 60;
      setActiveTaskId(taskId);
      setSecondsLeft(secs);
      setTotalSeconds(secs);
      setIsRunning(true);

      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [tasks, clearTimer],
  );

  const markComplete = useCallback(
    (taskId: number) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t)),
      );

      if (activeTaskId === taskId) {
        clearTimer();
        setActiveTaskId(null);
        setSecondsLeft(0);
        setTotalSeconds(0);
      }

      try {
        const audio = new Audio('/mixkit-game-level-completed-2059.wav');
        audio.play().catch(() => {
          // Autoplay may be blocked; silently ignore
        });
      } catch {
        // Audio not supported; silently ignore
      }
    },
    [activeTaskId, clearTimer],
  );

  // Clean up interval on unmount
  useEffect(() => () => clearTimer(), [clearTimer]);

  const activeTask = tasks.find((t) => t.id === activeTaskId) ?? null;

  return (
    <div className="app">
      <TimerPanel
        task={activeTask}
        secondsLeft={secondsLeft}
        totalSeconds={totalSeconds}
        isRunning={isRunning}
        onStart={startTimer}
      />
      <TaskList
        tasks={tasks}
        activeTaskId={activeTaskId}
        onStart={startTimer}
        onComplete={markComplete}
      />
    </div>
  );
}

export default App;
