import React from 'react';
import { useGameStore } from '../store/gameStore';
import { 
  RotateCcw, Undo2, Redo2, Lightbulb, Play, 
  Eraser, RefreshCw, Edit3, Pencil, Save 
} from 'lucide-react';

const Controls: React.FC = () => {
  const {
    undo, redo, getHint, solveStep, solve,
    togglePencilMode, isPencilMode, clearCell,
    resetUserMoves, initializeGame, difficulty,
    setDifficulty, saveCurrentGame
  } = useGameStore();

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 space-y-3">
      <div className="flex gap-2">
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
          className="flex-1 px-2 py-1.5 text-sm bg-gray-50 rounded border border-gray-200"
        >
          <option value="easy">Fácil</option>
          <option value="medium">Medio</option>
          <option value="hard">Difícil</option>
        </select>
        <button
          onClick={() => initializeGame(difficulty)}
          className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
          title="Nuevo Juego"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button
          onClick={saveCurrentGame}
          className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600"
          title="Guardar Juego"
        >
          <Save className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={undo}
          className="p-2 bg-gray-100 rounded hover:bg-gray-200"
          title="Deshacer"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          className="p-2 bg-gray-100 rounded hover:bg-gray-200"
          title="Rehacer"
        >
          <Redo2 className="w-4 h-4" />
        </button>
        <button
          onClick={clearCell}
          className="p-2 bg-gray-100 rounded hover:bg-gray-200"
          title="Borrar"
        >
          <Eraser className="w-4 h-4" />
        </button>
        <button
          onClick={togglePencilMode}
          className={`p-2 rounded ${isPencilMode ? 'bg-yellow-100' : 'bg-gray-100'} hover:bg-gray-200`}
          title="Notas"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={getHint}
          className="p-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
          title="Pista"
        >
          <Lightbulb className="w-4 h-4" />
        </button>
        <button
          onClick={solveStep}
          className="p-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
          title="Paso"
        >
          <Play className="w-4 h-4" />
        </button>
        <button
          onClick={solve}
          className="p-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
          title="Resolver"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={resetUserMoves}
        className="w-full p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        <span className="text-sm">Reiniciar</span>
      </button>
    </div>
  );
};

export default Controls;