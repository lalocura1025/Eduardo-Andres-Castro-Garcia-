import React from 'react';
import { INTERVAL_COLORS, Scale } from '../constants';

interface LegendProps {
  selectedScale: Scale;
}

export const Legend: React.FC<LegendProps> = ({ selectedScale }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-center text-cyan-400 mb-3">Leyenda de Intervalos</h3>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        {selectedScale.intervalNames.map((name, index) => (
          <div key={`${name}-${index}`} className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full ${INTERVAL_COLORS[name] || 'bg-gray-500'}`}></div>
            <span className="text-gray-300 font-medium">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
