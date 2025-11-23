
import React from 'react';
import { Chord, Theme, CHORD_FAMILIES, ChordQuality } from '../constants';
import { constructChord } from '../services/musicTheory';

interface ChordComparatorProps {
  baseChord: Chord | null;
  comparisonChord: Chord | null;
  onComparisonChange: (chord: Chord | null) => void;
  rootNote: string;
  theme: Theme;
}

export const ChordComparator: React.FC<ChordComparatorProps> = ({ 
    baseChord, comparisonChord, onComparisonChange, rootNote, theme 
}) => {
    const themeClasses = {
        dark: {
            bg: 'bg-gray-800',
            title: 'text-pink-400',
            text: 'text-gray-300',
            select: 'bg-gray-700 text-white border-gray-600',
            active: 'bg-pink-900/30 border-pink-500/50'
        },
        light: {
            bg: 'bg-white',
            title: 'text-pink-600',
            text: 'text-gray-700',
            select: 'bg-gray-100 text-gray-800 border-gray-300',
            active: 'bg-pink-50 border-pink-200'
        }
    };
    const currentTheme = themeClasses[theme];

    if (!baseChord) return null;

    const handleCompareSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (!val) {
            onComparisonChange(null);
            return;
        }
        
        // Find definition to construct chord
        // Format: QUALITY|INTERVALS_JOINED
        const [quality, intervalsStr] = val.split('|');
        const intervals = intervalsStr.split(',').map(Number);
        
        const newChord = constructChord(rootNote, quality as ChordQuality, intervals);
        onComparisonChange(newChord);
    };

    return (
        <div className={`p-4 rounded-lg shadow-md border transition-colors ${currentTheme.bg} ${comparisonChord ? currentTheme.active : 'border-transparent'}`}>
            <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-bold uppercase tracking-wide ${currentTheme.title}`}>
                    Comparar Acordes
                </h3>
                {comparisonChord && (
                     <button 
                        onClick={() => onComparisonChange(null)}
                        className="text-xs text-red-400 hover:text-red-300 underline"
                     >
                         Limpiar
                     </button>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className={`text-xs ${currentTheme.text}`}>Comparar <strong>{baseChord.root}{baseChord.quality}</strong> con:</label>
                <select 
                    className={`w-full p-2 text-sm rounded border focus:outline-none focus:ring-2 focus:ring-pink-400 ${currentTheme.select}`}
                    onChange={handleCompareSelect}
                    value={comparisonChord ? `${comparisonChord.quality}|${CHORD_FAMILIES.find(f => f.chords.some(c => c.quality === comparisonChord.quality))?.chords.find(c => c.quality === comparisonChord.quality)?.intervals.join(',')}` : ""}
                >
                    <option value="">-- Seleccionar --</option>
                    {CHORD_FAMILIES.map(family => (
                        <optgroup key={family.label} label={family.label}>
                            {family.chords.map(def => (
                                <option key={def.quality} value={`${def.quality}|${def.intervals.join(',')}`}>
                                    {rootNote}{def.quality}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </div>
            
            {comparisonChord && (
                <div className="mt-3 text-xs space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <span className={currentTheme.text}>Notas Comunes</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className={currentTheme.text}>Solo en {baseChord.root}{baseChord.quality}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className={currentTheme.text}>Solo en {comparisonChord.root}{comparisonChord.quality}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
