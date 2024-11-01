import React from 'react';
import { useGameStore } from '../store/gameStore';

const SudokuGrid: React.FC = () => {
  const { 
    grid, 
    selectedCell, 
    setSelectedCell, 
    initialGrid,
    highlightedCells,
    isPencilMode,
    pencilMarks
  } = useGameStore();

  const handleCellClick = (row: number, col: number) => {
    if (initialGrid[row][col] === 0) {
      setSelectedCell({ row, col });
    }
  };

  const isCellHighlighted = (row: number, col: number) => {
    return highlightedCells.some(cell => cell.row === row && cell.col === col);
  };

  const isCellInitial = (row: number, col: number) => {
    return initialGrid[row][col] !== 0;
  };

  const isSameNumber = (row: number, col: number) => {
    const value = grid[row][col];
    return value !== 0 && selectedCell && grid[selectedCell.row][selectedCell.col] === value;
  };

  const isRelatedCell = (row: number, col: number) => {
    if (!selectedCell) return false;
    return row === selectedCell.row || 
           col === selectedCell.col || 
           (Math.floor(row / 3) === Math.floor(selectedCell.row / 3) && 
            Math.floor(col / 3) === Math.floor(selectedCell.col / 3));
  };

  const getCellClassName = (row: number, col: number) => {
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const isHighlighted = isCellHighlighted(row, col);
    const isInitial = isCellInitial(row, col);
    const isSame = isSameNumber(row, col);
    const isRelated = isRelatedCell(row, col);

    return `relative w-10 h-10 flex items-center justify-center text-lg font-medium
      ${isSelected ? 'bg-blue-100' : ''}
      ${isHighlighted ? 'bg-yellow-50' : ''}
      ${isInitial ? 'text-gray-900 font-bold' : 'text-blue-600'}
      ${!isInitial ? 'hover:bg-blue-50 cursor-pointer' : 'cursor-not-allowed'}
      ${isSame && !isSelected ? 'bg-blue-50' : ''}
      ${isRelated && !isSelected && !isSame ? 'bg-gray-50' : ''}
      ${row % 3 === 0 ? 'border-t-2 border-t-gray-400' : 'border-t border-t-gray-300'}
      ${col % 3 === 0 ? 'border-l-2 border-l-gray-400' : 'border-l border-l-gray-300'}
      ${row === 8 ? 'border-b-2 border-b-gray-400' : ''}
      ${col === 8 ? 'border-r-2 border-r-gray-400' : ''}
      transition-colors`;
  };

  const renderPencilMarks = (row: number, col: number) => {
    const marks = pencilMarks[`${row}-${col}`] || [];
    if (marks.length === 0) return null;

    return (
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0 p-0.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <div key={num} className="flex items-center justify-center text-[8px] text-gray-500">
            {marks.includes(num) ? num : ''}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="inline-block bg-white rounded-lg shadow-sm p-3">
      <div className="grid grid-cols-9 gap-0 border-2 border-gray-400 bg-white">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={getCellClassName(rowIndex, colIndex)}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {isPencilMode ? (
                renderPencilMarks(rowIndex, colIndex)
              ) : (
                cell !== 0 ? cell : ''
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default SudokuGrid;