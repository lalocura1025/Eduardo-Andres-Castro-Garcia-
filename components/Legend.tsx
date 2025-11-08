
import React from 'react';
import { INTERVAL_COLORS, Scale, INTERVAL_FULL_NAMES, Theme } from '../constants';

interface LegendProps {
  selectedScale: Scale;
  theme: Theme;
}

export const Legend: React.FC<LegendProps> = ({ selectedScale, theme }) => {
  const themeClasses = {
    dark: {
        bg: 'bg-gray-800',
        title: 'text-cyan-400',
        text: 'text-gray-300'
    },
    light: {
        bg: 'bg-white',
        title: 'text-cyan-600',
        text: 'text-gray-700'
    }
  }
  const currentTheme = themeClasses[theme];

  return (
    <div className={`${currentTheme.bg} p-4 rounded-lg shadow-lg transition-colors duration-300`}>
      <h3 className={`text-lg font-semibold text-center ${currentTheme.title} mb-3`}>Leyenda de Intervalos</h3>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        {selectedScale.intervalNames.map((name, index) => (
          <div 
            key={`${name}-${index}`} 
            className="flex items-center gap-2"
            title={INTERVAL_FULL_NAMES[name] || ''}
          >
            <div className={`w-5 h-5 rounded-full ${INTERVAL_COLORS[name] || 'bg-gray-500'}`}></div>
            <span className={`${currentTheme.text} font-medium`}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};