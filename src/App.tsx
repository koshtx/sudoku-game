import React, { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import SudokuGrid from './components/SudokuGrid';
import Controls from './components/Controls';
import GameHistory from './components/GameHistory';
import MoveHistory from './components/MoveHistory';
import { AlertCircle } from 'lucide-react';

function App() {
  const { 
    grid, 
    selectedCell, 
    setSelectedCell, 
    setCellValue, 
    hintMessage,
    initializeGame 
  } = useGameStore();

  useEffect(() => {
    initializeGame('hard');
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedCell) return;

    if (e.key >= '1' && e.key <= '9') {
      setCellValue(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      setCellValue(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
          <div>
            {hintMessage && (
              <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">{hintMessage}</p>
              </div>
            )}
            <div className="flex flex-col items-center">
              <SudokuGrid />
              <div className="mt-4 w-full">
                <MoveHistory />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Controls />
            <GameHistory />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;