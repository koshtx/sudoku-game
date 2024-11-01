import { create } from 'zustand';
import { generatePuzzle, isValidPlacement, findNextLogicalMove, solveSudoku } from '../utils/sudoku';

interface Position {
  row: number;
  col: number;
}

interface Move {
  row: number;
  col: number;
  value: number;
  timestamp: number;
}

interface GameState {
  grid: number[][];
  initialGrid: number[][];
  selectedCell: Position | null;
  difficulty: 'easy' | 'medium' | 'hard';
  moveHistory: Move[];
  currentMoveIndex: number;
  hintMessage: string;
  isPencilMode: boolean;
  highlightedCells: Position[];
  setGrid: (grid: number[][]) => void;
  setSelectedCell: (cell: Position | null) => void;
  setCellValue: (value: number) => void;
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  togglePencilMode: () => void;
  initializeGame: (difficulty?: 'easy' | 'medium' | 'hard') => void;
  solve: () => void;
  getHint: () => void;
  solveStep: () => void;
  undo: () => void;
  redo: () => void;
  clearCell: () => void;
  resetUserMoves: () => void;
  saveCurrentGame: () => void;
}

const STORAGE_KEY = 'sudoku_saved_games';

interface SavedGame {
  id: number;
  grid: number[][];
  initialGrid: number[][];
  difficulty: 'easy' | 'medium' | 'hard';
  moveHistory: Move[];
  timestamp: number;
}

const createEmptyGrid = () => Array(9).fill(0).map(() => Array(9).fill(0));

export const useGameStore = create<GameState>((set, get) => ({
  grid: createEmptyGrid(),
  initialGrid: createEmptyGrid(),
  selectedCell: null,
  difficulty: 'hard', // Cambiado a 'hard' por defecto
  moveHistory: [],
  currentMoveIndex: -1,
  hintMessage: '',
  isPencilMode: false,
  highlightedCells: [],

  setGrid: (grid) => set({ grid }),
  setSelectedCell: (cell) => set({ selectedCell: cell }),
  setCellValue: (value) => {
    const { grid, selectedCell, initialGrid, moveHistory, currentMoveIndex } = get();
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    if (initialGrid[row][col] !== 0) return;

    if (value !== 0 && !isValidPlacement(grid, row, col, value)) {
      set({ 
        hintMessage: `No se puede colocar el número ${value} en esta posición porque ya existe en la misma fila, columna o cuadro.`
      });
      return;
    }

    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = value;

    const newMove = { row, col, value, timestamp: Date.now() };
    const newHistory = [...moveHistory.slice(0, currentMoveIndex + 1), newMove];

    set({ 
      grid: newGrid,
      moveHistory: newHistory,
      currentMoveIndex: newHistory.length - 1,
      hintMessage: ''
    });
  },

  setDifficulty: (difficulty) => set({ difficulty }),
  togglePencilMode: () => set(state => ({ isPencilMode: !state.isPencilMode })),

  initializeGame: (difficulty) => {
    const newGrid = generatePuzzle(difficulty || get().difficulty);
    set({
      grid: newGrid.map(row => [...row]),
      initialGrid: newGrid.map(row => [...row]),
      moveHistory: [],
      currentMoveIndex: -1,
      hintMessage: '',
      highlightedCells: []
    });
    if (difficulty) {
      set({ difficulty });
    }
  },

  saveCurrentGame: () => {
    const { grid, initialGrid, difficulty, moveHistory } = get();
    const savedGames: SavedGame[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    const newGame: SavedGame = {
      id: Date.now(),
      grid: grid,
      initialGrid: initialGrid,
      difficulty: difficulty,
      moveHistory: moveHistory,
      timestamp: Date.now()
    };

    savedGames.unshift(newGame);
    if (savedGames.length > 10) savedGames.pop(); // Keep only last 10 games
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedGames));
    set({ hintMessage: 'Juego guardado correctamente' });
    
    setTimeout(() => {
      set({ hintMessage: '' });
    }, 2000);
  },

  solve: () => {
    const { grid } = get();
    const solution = solveSudoku(grid);
    if (solution) {
      set({ 
        grid: solution,
        hintMessage: 'Sudoku resuelto completamente.',
        highlightedCells: []
      });
    }
  },

  getHint: () => {
    const { grid } = get();
    const nextMove = findNextLogicalMove(grid);
    if (nextMove) {
      const affectedCells: Position[] = [];
      affectedCells.push({ row: nextMove.row, col: nextMove.col });
      
      set({ 
        hintMessage: `Pista: ${nextMove.explanation}`,
        highlightedCells: affectedCells,
        selectedCell: { row: nextMove.row, col: nextMove.col }
      });
    } else {
      set({
        hintMessage: 'No se encontraron más movimientos lógicos disponibles.',
        highlightedCells: []
      });
    }
  },

  solveStep: () => {
    const { grid } = get();
    const nextMove = findNextLogicalMove(grid);
    if (nextMove) {
      const newGrid = grid.map(row => [...row]);
      newGrid[nextMove.row][nextMove.col] = nextMove.value;
      
      const newMove = {
        row: nextMove.row,
        col: nextMove.col,
        value: nextMove.value,
        timestamp: Date.now()
      };

      set(state => ({ 
        grid: newGrid,
        hintMessage: `Paso completado: ${nextMove.explanation}`,
        moveHistory: [...state.moveHistory, newMove],
        currentMoveIndex: state.currentMoveIndex + 1,
        highlightedCells: [{ row: nextMove.row, col: nextMove.col }]
      }));
    } else {
      set({ 
        hintMessage: 'No se encontraron más movimientos lógicos disponibles.',
        highlightedCells: []
      });
    }
  },

  undo: () => {
    const { moveHistory, currentMoveIndex, initialGrid } = get();
    if (currentMoveIndex >= 0) {
      const newGrid = initialGrid.map(row => [...row]);
      for (let i = 0; i <= currentMoveIndex - 1; i++) {
        const move = moveHistory[i];
        newGrid[move.row][move.col] = move.value;
      }
      set({ 
        grid: newGrid,
        currentMoveIndex: currentMoveIndex - 1,
        hintMessage: '',
        highlightedCells: []
      });
    }
  },

  redo: () => {
    const { moveHistory, currentMoveIndex } = get();
    if (currentMoveIndex < moveHistory.length - 1) {
      const move = moveHistory[currentMoveIndex + 1];
      const newGrid = get().grid.map(row => [...row]);
      newGrid[move.row][move.col] = move.value;
      set({ 
        grid: newGrid,
        currentMoveIndex: currentMoveIndex + 1,
        hintMessage: '',
        highlightedCells: []
      });
    }
  },

  clearCell: () => {
    const { selectedCell, setCellValue } = get();
    if (selectedCell) {
      setCellValue(0);
    }
  },

  resetUserMoves: () => {
    const { initialGrid } = get();
    set({ 
      grid: initialGrid.map(row => [...row]),
      moveHistory: [],
      currentMoveIndex: -1,
      hintMessage: '',
      highlightedCells: []
    });
  },
}));