import React from 'react';
import { useGameStore } from '../store/gameStore';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { History } from 'lucide-react';

const MoveHistory: React.FC = () => {
  const { moveHistory, currentMoveIndex } = useGameStore();

  return (
    <div className="bg-white rounded-lg shadow-sm p-3">
      <h2 className="text-sm font-medium mb-2 flex items-center gap-1.5">
        <History className="w-4 h-4" />
        Historial de Movimientos
      </h2>
      
      {moveHistory.length === 0 ? (
        <p className="text-gray-500 text-xs text-center py-2">No hay movimientos</p>
      ) : (
        <div className="space-y-1 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
          {moveHistory.map((move, index) => (
            <div
              key={`${move.row}-${move.col}-${move.timestamp}`}
              className={`p-2 rounded text-xs ${
                index === currentMoveIndex
                  ? 'bg-blue-50 border-l-2 border-blue-500'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>
                  ({move.row + 1}, {move.col + 1}): {move.value}
                </span>
                <span className="text-gray-500">
                  {formatDistanceToNow(move.timestamp, { addSuffix: true, locale: es })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoveHistory;