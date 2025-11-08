import React from 'react';
import { Theme, CagedShapeName, CAGED_SHAPE_NAMES, CAGED_COLORS } from '../constants';

interface CagedSelectorProps {
    theme: Theme;
    isActive: boolean;
    onToggle: (isActive: boolean) => void;
    selectedShapeIndex: number | null;
    onShapeSelect: (index: number) => void;
}

export const CagedSelector: React.FC<CagedSelectorProps> = ({ theme, isActive, onToggle, selectedShapeIndex, onShapeSelect }) => {
  const themeClasses = {
      dark: {
          bg: 'bg-gray-800',
          title: 'text-cyan-400',
          textMuted: 'text-gray-400',
          button: 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white focus:ring-gray-500',
          ringOffset: 'focus:ring-offset-gray-800',
          border: 'border-gray-700',
          switchBg: 'bg-gray-700',
          switchKnob: 'bg-white'
      },
      light: {
          bg: 'bg-white',
          title: 'text-cyan-600',
          textMuted: 'text-gray-500',
          button: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400',
          ringOffset: 'focus:ring-offset-white',
          border: 'border-gray-200',
          switchBg: 'bg-gray-300',
          switchKnob: 'bg-white'
      }
  }
  const currentTheme = themeClasses[theme];

  return (
    <div className={`${currentTheme.bg} p-4 rounded-lg shadow-lg transition-colors duration-300`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${currentTheme.title}`}>Sistema CAGED</h3>
            <button
                type="button"
                onClick={() => onToggle(!isActive)}
                className={`${isActive ? 'bg-cyan-500' : currentTheme.switchBg} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${currentTheme.ringOffset}`}
                role="switch"
                aria-checked={isActive}
            >
                <span
                aria-hidden="true"
                className={`${isActive ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full ${currentTheme.switchKnob} shadow ring-0 transition duration-200 ease-in-out`}
                />
            </button>
        </div>
      
        {isActive && (
            <div className="border-t pt-4 mt-4 ${currentTheme.border}">
                <p className={`text-center text-sm ${currentTheme.textMuted} mb-3`}>Selecciona una forma para visualizar en el mástil.</p>
                <div className="grid grid-cols-5 gap-2 sm:gap-4 text-center">
                    {CAGED_SHAPE_NAMES.map((shapeName, index) => {
                        const isSelected = selectedShapeIndex === index;
                        const { color, glow } = CAGED_COLORS[shapeName];
                        
                        return (
                        <button 
                            key={shapeName} 
                            onClick={() => onShapeSelect(index)}
                            className={`
                                p-3 rounded-md flex items-center justify-center transition-all duration-200 ease-in-out transform focus:outline-none
                                focus:ring-2 focus:ring-offset-2 ${currentTheme.ringOffset}
                                ${isSelected 
                                    ? `${color} ${glow} text-white font-bold shadow-lg scale-105` 
                                    : currentTheme.button
                                }
                            `}
                        >
                            <span className="text-xl font-bold">{shapeName}</span>
                        </button>
                        )
                    })}
                </div>
            </div>
      )}
    </div>
  );
};