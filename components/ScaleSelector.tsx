
import React from 'react';
import { Scale, ScaleName, Theme } from '../constants';

interface ScaleSelectorProps {
  scales: Scale[];
  selectedScale: ScaleName;
  onScaleChange: (scale: ScaleName) => void;
  theme: Theme;
}

export const ScaleSelector: React.FC<ScaleSelectorProps> = ({ scales, selectedScale, onScaleChange, theme }) => {
  const themeClasses = {
      dark: {
          bg: 'bg-gray-800',
          title: 'text-cyan-400',
          select: 'bg-gray-700 text-white',
          arrow: 'text-gray-400'
      },
      light: {
          bg: 'bg-white',
          title: 'text-cyan-600',
          select: 'bg-gray-200 text-gray-800',
          arrow: 'text-gray-500'
      }
  }
  const currentTheme = themeClasses[theme];

  return (
    <div className={`${currentTheme.bg} p-4 rounded-lg shadow-lg transition-colors duration-300`}>
      <h3 className={`text-lg font-semibold text-center ${currentTheme.title} mb-3`}>Seleccionar Escala</h3>
      <div className="relative">
        <select
          value={selectedScale}
          onChange={(e) => onScaleChange(e.target.value as ScaleName)}
          className={`w-full p-3 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors duration-300 ${currentTheme.select}`}
        >
          {scales.map((scale) => (
            <option key={scale.name} value={scale.name}>
              {scale.name}
            </option>
          ))}
        </select>
        <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${currentTheme.arrow}`}>
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};