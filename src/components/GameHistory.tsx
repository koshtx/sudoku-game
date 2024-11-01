import React from 'react';
import { useGameStore } from '../store/gameStore';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { BookOpen } from 'lucide-react';

const GameHistory: React.FC = () => {
  const { gameHistory, loadGame } = useGameStore();

  return (
    <div className="bg-white rounded-lg shadow-sm p-3">
      <h2 className="text-sm font-medium mb-2 flex items-center gap-1.5">
        <BookOpen className="w-4 h-4" />
        Juegos Guardados
      </h2>

      {(!gameHistory || gameHistory.length === 0) ? (
        <p className="text-gray-500 text-xs text-center py-2">No hay juegos guardados</p>
      ) : (
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
          {gameHistory.map((game) => (
            <button
              key={game.id}
              onClick={() => loadGame(game.id)}
              className="w-full text-left p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors group"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-800">
                  {game.difficulty === 'easy' ? 'Fácil' : 
                   game.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(game.date), { addSuffix: true, locale: es })}
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {game.completed ? 'Completado ✓' : 'En Progreso...'}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameHistory;