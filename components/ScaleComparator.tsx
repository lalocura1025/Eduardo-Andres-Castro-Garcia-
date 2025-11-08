import React, { useMemo } from 'react';
import { Theme, ScaleName, SCALES, NOTES } from '../constants';

interface ScaleComparatorProps {
    theme: Theme;
    rootNote: string;
    isComparing: boolean;
    onComparisonToggle: (isActive: boolean) => void;
    comparisonScales: { scale1: ScaleName, scale2: ScaleName };
    onScalesChange: (scales: { scale1: ScaleName, scale2: ScaleName }) => void;
}

export const ScaleComparator: React.FC<ScaleComparatorProps> = ({ 
    theme, rootNote, isComparing, onComparisonToggle, comparisonScales, onScalesChange 
}) => {
  const themeClasses = {
      dark: {
          bg: 'bg-gray-800',
          title: 'text-purple-400',
          text: 'text-gray-300',
          textMuted: 'text-gray-400',
          select: 'bg-gray-700 text-white',
          ringOffset: 'focus:ring-offset-gray-800',
          border: 'border-gray-700',
          switchBg: 'bg-gray-700',
          switchKnob: 'bg-white'
      },
      light: {
          bg: 'bg-white',
          title: 'text-purple-600',
          text: 'text-gray-700',
          textMuted: 'text-gray-500',
          select: 'bg-gray-200 text-gray-800',
          ringOffset: 'focus:ring-offset-white',
          border: 'border-gray-200',
          switchBg: 'bg-gray-300',
          switchKnob: 'bg-white'
      }
  }
  const currentTheme = themeClasses[theme];

  const scaleOptions = Object.keys(SCALES) as ScaleName[];

  const handleScale1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onScalesChange({ ...comparisonScales, scale1: e.target.value as ScaleName });
  };
  const handleScale2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onScalesChange({ ...comparisonScales, scale2: e.target.value as ScaleName });
  };

  const comparisonData = useMemo(() => {
    const rootIndex = NOTES.indexOf(rootNote as typeof NOTES[number]);
    const scale1 = SCALES[comparisonScales.scale1];
    const scale2 = SCALES[comparisonScales.scale2];

    const notes1 = new Set(scale1.intervals.map(i => NOTES[(rootIndex + i) % 12]));
    const notes2 = new Set(scale2.intervals.map(i => NOTES[(rootIndex + i) % 12]));

    const commonNotes = [...notes1].filter(note => notes2.has(note));
    const uniqueTo1 = [...notes1].filter(note => !notes2.has(note));
    const uniqueTo2 = [...notes2].filter(note => !notes1.has(note));

    return { commonNotes, uniqueTo1, uniqueTo2 };
  }, [rootNote, comparisonScales]);

  return (
    <div className={`${currentTheme.bg} p-4 rounded-lg shadow-lg transition-colors duration-300`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${currentTheme.title}`}>Comparador de Escalas</h3>
            <button
                type="button"
                onClick={() => onComparisonToggle(!isComparing)}
                className={`${isComparing ? 'bg-purple-500' : currentTheme.switchBg} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${currentTheme.ringOffset}`}
                role="switch"
                aria-checked={isComparing}
            >
                <span
                aria-hidden="true"
                className={`${isComparing ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full ${currentTheme.switchKnob} shadow ring-0 transition duration-200 ease-in-out`}
                />
            </button>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="scale1-select" className={`block text-sm font-medium ${currentTheme.textMuted} mb-1`}>Escala 1</label>
                 <select
                    id="scale1-select"
                    value={comparisonScales.scale1}
                    onChange={handleScale1Change}
                    className={`w-full p-2 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300 ${currentTheme.select}`}
                    >
                    {scaleOptions.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="scale2-select" className={`block text-sm font-medium ${currentTheme.textMuted} mb-1`}>Escala 2</label>
                 <select
                    id="scale2-select"
                    value={comparisonScales.scale2}
                    onChange={handleScale2Change}
                    className={`w-full p-2 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-300 ${currentTheme.select}`}
                    >
                    {scaleOptions.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
            </div>
        </div>
        
        <div className={`mt-4 pt-4 border-t ${currentTheme.border}`}>
            <h4 className={`text-md font-semibold ${currentTheme.title} mb-2`}>Análisis de Notas</h4>
            <div className={`space-y-2 text-sm ${currentTheme.text}`}>
                <p><span className="font-bold text-amber-400">Comunes:</span> {comparisonData.commonNotes.join(', ') || 'Ninguna'}</p>
                <p><span className="font-bold text-sky-500">Solo en {comparisonScales.scale1}:</span> {comparisonData.uniqueTo1.join(', ') || 'Ninguna'}</p>
                <p><span className="font-bold text-emerald-500">Solo en {comparisonScales.scale2}:</span> {comparisonData.uniqueTo2.join(', ') || 'Ninguna'}</p>
            </div>
        </div>
    </div>
  );
};
