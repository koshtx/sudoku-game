import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Clock } from 'lucide-react';

export function Timer() {
  const { startTime, isPaused } = useGameStore();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let intervalId: number;

    if (!isPaused) {
      intervalId = window.setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [startTime, isPaused]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div className="flex items-center gap-2 text-xl font-mono">
      <Clock size={24} />
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}