export interface Position {
  row: number;
  col: number;
}

export interface Move {
  row: number;
  col: number;
  value: number;
  timestamp: number;
}

export interface GameRecord {
  id: number;
  grid: number[][];
  currentGrid: number[][];
  difficulty: 'easy' | 'medium' | 'hard';
  moveHistory: Move[];
  duration: number;
  completed: boolean;
  timestamp: number;
}

export interface GameState {
  grid: number[][];
  initialGrid: number[][];
  currentGrid: number[][];
  selectedCell: Position | null;
  difficulty: 'easy' | 'medium' | 'hard';
  moveHistory: Move[];
  gameHistory: GameRecord[];
  highlightedCells: Position[];
  hintMessage: string;
  stepMessage: string;
  isComplete: boolean;
  startTime: number;
  initializeGame: (difficulty?: 'easy' | 'medium' | 'hard') => void;
  loadSavedGame: (gameId: number) => void;
  selectCell: (position: Position | null) => void;
  setCell: (value: number | null) => void;
  getHint: () => void;
  solve: () => void;
}