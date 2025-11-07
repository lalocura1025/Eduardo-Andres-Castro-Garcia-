import React from 'react';

interface RootNoteSelectorProps {
  notes: readonly string[];
  selectedRoot: string;
  onRootChange: (note: string) => void;
}

export const RootNoteSelector: React.FC<RootNoteSelectorProps> = ({ notes, selectedRoot, onRootChange }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-center text-cyan-400 mb-3">Seleccionar Tónica</h3>
      <div className="flex flex-wrap justify-center gap-2">
        {notes.map((note) => {
          const isSelected = note === selectedRoot;
          return (
            <button
              key={note}
              onClick={() => onRootChange(note)}
              className={`
                w-12 h-12 rounded-full text-lg font-bold 
                transition-all duration-200 ease-in-out transform 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
                ${isSelected 
                  ? 'bg-cyan-500 text-gray-900 shadow-md scale-110 focus:ring-cyan-400' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white focus:ring-gray-500'
                }
              `}
            >
              {note}
            </button>
          );
        })}
      </div>
    </div>
  );
};
