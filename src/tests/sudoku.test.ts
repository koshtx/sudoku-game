import { describe, it, expect } from 'vitest';
import { 
  generateSudoku,
  isValidPlacement,
  solveSudoku,
  isSudokuComplete
} from '../utils/sudoku';

describe('Sudoku Utils', () => {
  describe('generateSudoku', () => {
    it('should generate a valid sudoku grid', () => {
      const grid = generateSudoku('medium');
      
      // Check dimensions
      expect(grid.length).toBe(9);
      grid.forEach(row => expect(row.length).toBe(9));
      
      // Check if numbers are valid
      grid.forEach(row => {
        row.forEach(cell => {
          expect(cell === null || (cell >= 1 && cell <= 9)).toBeTruthy();
        });
      });
    });
  });

  describe('isValidPlacement', () => {
    it('should validate number placement correctly', () => {
      const grid = Array(9).fill(null).map(() => Array(9).fill(null));
      
      // Test valid placement
      expect(isValidPlacement(grid, 0, 0, 1)).toBeTruthy();
      
      // Test invalid row placement
      grid[0][1] = 1;
      expect(isValidPlacement(grid, 0, 2, 1)).toBeFalsy();
      
      // Test invalid column placement
      grid[0][1] = null;
      grid[1][0] = 1;
      expect(isValidPlacement(grid, 2, 0, 1)).toBeFalsy();
    });
  });

  describe('solveSudoku', () => {
    it('should solve a valid sudoku puzzle', () => {
      const grid = Array(9).fill(null).map(() => Array(9).fill(null));
      grid[0][0] = 5;
      
      const solution = solveSudoku(grid);
      expect(solution).not.toBeNull();
      expect(isSudokuComplete(solution!)).toBeTruthy();
    });
  });

  describe('isSudokuComplete', () => {
    it('should correctly identify complete and incomplete grids', () => {
      const incompleteGrid = Array(9).fill(null).map(() => Array(9).fill(null));
      expect(isSudokuComplete(incompleteGrid)).toBeFalsy();
      
      const completeGrid = [
        [5,3,4,6,7,8,9,1,2],
        [6,7,2,1,9,5,3,4,8],
        [1,9,8,3,4,2,5,6,7],
        [8,5,9,7,6,1,4,2,3],
        [4,2,6,8,5,3,7,9,1],
        [7,1,3,9,2,4,8,5,6],
        [9,6,1,5,3,7,2,8,4],
        [2,8,7,4,1,9,6,3,5],
        [3,4,5,2,8,6,1,7,9]
      ];
      expect(isSudokuComplete(completeGrid)).toBeTruthy();
    });
  });
});