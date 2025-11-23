import React, { useMemo } from 'react';
import { Scale, Chord, NOTES, ScaleName, CHORD_FAMILIES, SCALES } from '../constants';
import { getInterval } from '../services/musicTheory';

interface ImprovisationTipsProps {
    selectedRoot: string;
    selectedScale: Scale;
    highlightedChord: Chord | null;
    showImprovScale?: boolean;
    onToggleImprovScale?: (show: boolean) => void;
    improvScaleName?: ScaleName | null;
    onSelectImprovScale?: (scale: ScaleName) => void;
}

export const ImprovisationTips: React.FC<ImprovisationTipsProps> = ({ 
    selectedRoot, selectedScale, highlightedChord, 
    showImprovScale, onToggleImprovScale, improvScaleName, onSelectImprovScale 
}) => {
    const tips = useMemo(() => {
        if (!highlightedChord) return null;

        // 1. Identificar sugerencias basadas en CHORD_FAMILIES
        const familyMatch = CHORD_FAMILIES.find(f => f.chords.some(c => c.quality === highlightedChord.quality));
        const chordDef = familyMatch?.chords.find(c => c.quality === highlightedChord.quality);
        const suggestedScales = chordDef?.suggestedScales || [];

        // 2. Identificar contexto Diatónico (Modos Relativos)
        let diatonicMode = '';
        
        if (selectedScale.name === 'Jónico (Mayor)') {
            const rootIndex = NOTES.indexOf(selectedRoot as any);
            const chordRootIndex = NOTES.indexOf(highlightedChord.root as any);
            const interval = getInterval(rootIndex, chordRootIndex);
            const majorIntervals = SCALES['Jónico (Mayor)'].intervals;
            const degreeIndex = (majorIntervals as readonly number[]).indexOf(interval);
            
            if (degreeIndex !== -1) {
                 const modes = ['Jónico', 'Dórico', 'Frigio', 'Lidio', 'Mixolidio', 'Eólico', 'Locrio'];
                 diatonicMode = modes[degreeIndex];
            }
        } else if (selectedScale.name === 'Eólico (menor natural)') {
             const rootIndex = NOTES.indexOf(selectedRoot as any);
            const chordRootIndex = NOTES.indexOf(highlightedChord.root as any);
            const interval = getInterval(rootIndex, chordRootIndex);
            const minorIntervals = SCALES['Eólico (menor natural)'].intervals;
            const degreeIndex = (minorIntervals as readonly number[]).indexOf(interval);
            
            if (degreeIndex !== -1) {
                 const modes = ['Eólico', 'Locrio', 'Jónico', 'Dórico', 'Frigio', 'Lidio', 'Mixolidio'];
                 diatonicMode = modes[degreeIndex];
            }
        }

        return { suggestedScales, diatonicMode };

    }, [selectedRoot, selectedScale, highlightedChord]);

    if (!highlightedChord) return (
        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 text-center">
             <p className="text-gray-400 text-sm">Selecciona un acorde para ver sugerencias de improvisación y escalas completas.</p>
        </div>
    );

    return (
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-xl border border-cyan-500/30 shadow-lg relative overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                 
                 {/* CHORD INFO */}
                 <div className="text-center lg:text-left min-w-[120px]">
                     <h4 className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1">Acorde Actual</h4>
                     <div className="text-3xl font-black text-white">
                         {highlightedChord.root}<span className="text-cyan-300 text-xl">{highlightedChord.quality === 'Mayor' ? '' : highlightedChord.quality}</span>
                     </div>
                 </div>

                 <div className="h-12 w-px bg-gray-600 hidden lg:block"></div>

                 {/* SUGGESTIONS */}
                 <div className="flex-1 space-y-3 w-full">
                     <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Escalas Sugeridas</h4>
                        {tips?.diatonicMode && (
                             <span className="text-[10px] bg-indigo-900 text-indigo-200 px-2 rounded-full border border-indigo-700">
                                 Modo: {tips.diatonicMode}
                             </span>
                        )}
                     </div>
                     
                     <div className="flex flex-wrap gap-2">
                         {tips?.suggestedScales.map(s => {
                             const isActive = improvScaleName === s;
                             return (
                                 <button 
                                    key={s}
                                    onClick={() => onSelectImprovScale && onSelectImprovScale(s)}
                                    className={`
                                        text-sm px-3 py-1.5 rounded transition-all border
                                        ${isActive 
                                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg scale-105 font-bold' 
                                            : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'}
                                    `}
                                 >
                                     {s}
                                 </button>
                             )
                         })}
                     </div>
                 </div>

                 {/* TOGGLE SWITCH */}
                 <div className="flex flex-col items-center justify-center gap-2 bg-black/20 p-3 rounded-lg border border-white/5">
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">Ver Escala Completa</span>
                    <button
                        type="button"
                        onClick={() => onToggleImprovScale && onToggleImprovScale(!showImprovScale)}
                        className={`${showImprovScale ? 'bg-cyan-500' : 'bg-gray-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
                        role="switch"
                        aria-checked={showImprovScale}
                    >
                        <span
                        aria-hidden="true"
                        className={`${showImprovScale ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                    </button>
                 </div>
            </div>
            
            {showImprovScale && improvScaleName && (
                <div className="mt-3 pt-2 border-t border-white/10 text-center">
                    <p className="text-xs text-emerald-300">
                        <span className="font-bold">Visualizando: </span> Escala {improvScaleName} sobre {highlightedChord.root} (Notas Fantasma)
                    </p>
                </div>
            )}
        </div>
    )
}