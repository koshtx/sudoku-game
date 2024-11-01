export const BOX_SIZE = 3;
export const GRID_SIZE = 9;

export const generatePuzzle = (difficulty: 'easy' | 'medium' | 'hard'): number[][] => {
  const grid = generateSolvedGrid();
  const cellsToRemove = {
    easy: 40,
    medium: 50,
    hard: 60
  }[difficulty];

  const puzzle = grid.map(row => [...row]);
  let removed = 0;

  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);

    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }

  return puzzle;
};

const generateSolvedGrid = (): number[][] => {
  const grid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
  fillGrid(grid);
  return grid;
};

const fillGrid = (grid: number[][]): boolean => {
  const emptyCell = findEmptyCell(grid);
  if (!emptyCell) return true;

  const [row, col] = emptyCell;
  const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (const num of numbers) {
    if (isValidPlacement(grid, row, col, num)) {
      grid[row][col] = num;
      if (fillGrid(grid)) return true;
      grid[row][col] = 0;
    }
  }

  return false;
};

export const findEmptyCell = (grid: number[][]): [number, number] | null => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) return [row, col];
    }
  }
  return null;
};

const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const isValidPlacement = (
  grid: number[][],
  row: number,
  col: number,
  num: number
): boolean => {
  // Check row
  for (let x = 0; x < GRID_SIZE; x++) {
    if (grid[row][x] === num && x !== col) return false;
  }

  // Check column
  for (let x = 0; x < GRID_SIZE; x++) {
    if (grid[x][col] === num && x !== row) return false;
  }

  // Check box
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;

  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (
        grid[boxRow + i][boxCol + j] === num &&
        boxRow + i !== row &&
        boxCol + j !== col
      ) {
        return false;
      }
    }
  }

  return true;
};

export const findNextLogicalMove = (grid: number[][]): {
  row: number;
  col: number;
  value: number;
  explanation: string;
} | null => {
  // First try naked singles (cells with only one possible value)
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        const possibleValues = getPossibleValues(grid, row, col);
        if (possibleValues.length === 1) {
          return {
            row,
            col,
            value: possibleValues[0],
            explanation: `En la celda (${row + 1}, ${col + 1}), el único valor posible es ${possibleValues[0]} ya que todos los demás números ya están presentes en la fila, columna o cuadro.`
          };
        }
      }
    }
  }

  // Then try hidden singles
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isHiddenSingle(grid, row, col, num)) {
            return {
              row,
              col,
              value: num,
              explanation: `El número ${num} solo puede ir en la celda (${row + 1}, ${col + 1}) dentro de su región actual.`
            };
          }
        }
      }
    }
  }

  return null;
};

const getPossibleValues = (grid: number[][], row: number, col: number): number[] => {
  const values = [];
  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(grid, row, col, num)) {
      values.push(num);
    }
  }
  return values;
};

const isHiddenSingle = (grid: number[][], row: number, col: number, num: number): boolean => {
  if (!isValidPlacement(grid, row, col, num)) return false;

  // Check if this number can only go in this cell in the row
  let uniqueInRow = true;
  for (let c = 0; c < GRID_SIZE; c++) {
    if (c !== col && grid[row][c] === 0 && isValidPlacement(grid, row, c, num)) {
      uniqueInRow = false;
      break;
    }
  }
  if (uniqueInRow) return true;

  // Check if this number can only go in this cell in the column
  let uniqueInCol = true;
  for (let r = 0; r < GRID_SIZE; r++) {
    if (r !== row && grid[r][col] === 0 && isValidPlacement(grid, r, col, num)) {
      uniqueInCol = false;
      break;
    }
  }
  if (uniqueInCol) return true;

  // Check if this number can only go in this cell in the box
  let uniqueInBox = true;
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const currentRow = boxRow + r;
      const currentCol = boxCol + c;
      if ((currentRow !== row || currentCol !== col) && 
          grid[currentRow][currentCol] === 0 && 
          isValidPlacement(grid, currentRow, currentCol, num)) {
        uniqueInBox = false;
        break;
      }
    }
  }
  return uniqueInBox;
};

export const solveSudoku = (grid: number[][]): number[][] | null => {
  const copy = grid.map(row => [...row]);
  return solveGrid(copy) ? copy : null;
};

const solveGrid = (grid: number[][]): boolean => {
  const emptyCell = findEmptyCell(grid);
  if (!emptyCell) return true;

  const [row, col] = emptyCell;
  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(grid, row, col, num)) {
      grid[row][col] = num;
      if (solveGrid(grid)) return true;
      grid[row][col] = 0;
    }
  }

  return false;
};