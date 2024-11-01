import React from 'react';
import { useGameStore } from '../store/gameStore';
import { RefreshCw, Edit3, Play, Eraser, Pencil, Lightbulb, RotateCcw, Save } from 'lucide-react';

const GameControls: React.FC = () => {
  const {
    difficulty,
    setDifficulty,
    newGame,
    solve,
    hint,
    step,
    undo,
    hintMessage,
    selectedCell,
    setCellValue,
    saveGame,
    resetGame,
    isManualMode,
    toggleManualMode,
    isEditingManual,
    startManualGame,
    clearBoard,
    isPencilMode,
    togglePencilMode
  } = useGameStore();

  const handleNumberClick = (number: number) => {
    setCellValue(number);
  };

  return (
    <div className="w-full max-w-3xl space-y-6">
      {/* Controles principales */}
      <div className="flex flex-wrap gap-3 justify-center">
        {!isManualMode && (
          <div className="flex-1 min-w-[200px]">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="easy">Fácil</option>
              <option value="medium">Medio</option>
              <option value="hard">Difícil</option>
            </select>
          </div>
        )}
        
        <button
          onClick={toggleManualMode}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            isManualMode ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          Modo Manual
        </button>

        {!isManualMode && (
          <>
            <button
              onClick={newGame}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Nuevo Juego
            </button>
            <button
              onClick={saveGame}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Guardar
            </button>
          </>
        )}
      </div>

      {/* Teclado numérico */}
      <div className="grid grid-cols-10 gap-2">
        <button
          onClick={togglePencilMode}
          className={`p-3 rounded-lg flex items-center justify-center transition-all ${
            isPencilMode 
              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title="Modo Notas"
        >
          <Pencil className="w-5 h-5" />
        </button>
        {Array.from({ length: 9 }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handleNumberClick(i + 1)}
            className={`p-3 text-xl font-semibold rounded-lg transition-all ${
              selectedCell
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!selectedCell}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Controles de ayuda */}
      {!isEditingManual && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={hint}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            Pista
          </button>
          <button
            onClick={step}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Paso
          </button>
          <button
            onClick={solve}
            className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Resolver
          </button>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reiniciar
          </button>
        </div>
      )}

      {/* Mensaje de pista */}
      {hintMessage && !isEditingManual && (
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
          {hintMessage}
        </div>
      )}
    </div>
  );
};

export default GameControls;