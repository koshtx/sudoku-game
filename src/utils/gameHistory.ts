import { Grid, Difficulty } from '../types/sudoku';

export interface GameRecord {
  grid: Grid;
  currentGrid: Grid;
  difficulty: Difficulty;
  duration: number;
  completed: boolean;
  timestamp: number;
}

const HISTORY_KEY = 'sudoku_game_history';

export function saveGame(
  initialGrid: Grid,
  currentGrid: Grid,
  difficulty: Difficulty,
  duration: number,
  completed: boolean
): void {
  const gameHistory = loadGameHistory();
  const newRecord: GameRecord = {
    grid: initialGrid,
    currentGrid,
    difficulty,
    duration,
    completed,
    timestamp: Date.now(),
  };
  
  // Only save if it's a new completed game
  if (completed) {
    gameHistory.unshift(newRecord);
    
    // Keep only the last 50 games
    if (gameHistory.length > 50) {
      gameHistory.pop();
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(gameHistory));
  }
}

export function loadGameHistory(): GameRecord[] {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
}