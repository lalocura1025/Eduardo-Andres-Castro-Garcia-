
import React from 'react';
import { Theme } from '../constants';

interface RootNoteSelectorProps {
  notes: readonly string[];
  selectedRoot: string;
  onRootChange: (note: string) => void;
  theme: Theme;
}

export const RootNoteSelector: React.FC<RootNoteSelectorProps> = ({ notes, selectedRoot, onRootChange, theme }) => {
  const themeClasses = {
      dark: {
          bg: 'bg-gray-800',
          title: 'text-cyan-400',
          button: 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white focus:ring-gray-500',
          buttonSelected: 'bg-cyan-500 text-gray-900 shadow-md scale-110 focus:ring-cyan-400',
          ringOffset: 'focus:ring-offset-gray-800',
      },
      light: {
          bg: 'bg-white',
          title: 'text-cyan-600',
          button: 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 focus:ring-gray-400',
          buttonSelected: 'bg-cyan-500 text-gray-900 shadow-md scale-110 focus:ring-cyan-400',
          ringOffset: 'focus:ring-offset-white',
      }
  }

  const currentTheme = themeClasses[theme];

  return (
    <div className={`${currentTheme.bg} p-4 rounded-lg shadow-lg transition-colors duration-300`}>
      <h3 className={`text-lg font-semibold text-center ${currentTheme.title} mb-3`}>Seleccionar Tónica</h3>
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
                focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentTheme.ringOffset}
                ${isSelected 
                  ? currentTheme.buttonSelected
                  : currentTheme.button
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