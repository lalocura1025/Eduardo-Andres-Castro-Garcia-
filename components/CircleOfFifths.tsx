import React, { useState } from 'react';
import { CIRCLE_OF_FIFTHS_KEYS, ScaleName, Theme, PROGRESSIONS, Progression, Chord } from '../constants';
import { getProgressionChords } from '../services/musicTheory';
import { playChordNotes } from '../services/audio';

interface CircleOfFifthsProps {
  currentRoot: string;
  currentScaleName: ScaleName;
  onKeyChange: (root: string, scale: ScaleName) => void;
  onChordSelect: (chord: Chord | null) => void;
  theme: Theme;
  // New Props for Looping
  onStartLoop?: (chords: (Chord & { roman: string })[]) => void;
  isLooping?: boolean;
}

export const CircleOfFifths: React.FC<CircleOfFifthsProps> = React.memo(({ 
    currentRoot, currentScaleName, onKeyChange, onChordSelect, theme, onStartLoop, isLooping 
}) => {
  const [selectedProgressionIndex, setSelectedProgressionIndex] = useState<number | null>(null);
  const [beatsPerChord, setBeatsPerChord] = useState(4); // Local state for control

  const themeClasses = {
    dark: {
      bg: 'bg-gray-800',
      title: 'text-cyan-400',
      subTitle: 'text-cyan-200',
      circleBg: 'bg-gray-700/50',
      keyBg: 'bg-gray-700',
      keyText: 'text-gray-300',
      majorKeySelected: 'bg-cyan-500 text-gray-900 ring-cyan-400',
      minorKeySelected: 'bg-purple-500 text-white ring-purple-400',
      keySignatureText: 'text-gray-400',
      select: 'bg-gray-700 text-white border-gray-600',
      progCard: 'bg-gray-700 border-gray-600'
    },
    light: {
      bg: 'bg-white',
      title: 'text-cyan-600',
      subTitle: 'text-cyan-800',
      circleBg: 'bg-gray-200/50',
      keyBg: 'bg-gray-200',
      keyText: 'text-gray-700',
      majorKeySelected: 'bg-cyan-500 text-gray-900 ring-cyan-400',
      minorKeySelected: 'bg-purple-500 text-white ring-purple-400',
      keySignatureText: 'text-gray-500',
      select: 'bg-gray-100 text-gray-800 border-gray-300',
      progCard: 'bg-gray-50 border-gray-200'
    }
  };
  const currentTheme = themeClasses[theme];

  const CIRCLE_RADIUS = 160; 
  const KEY_ITEM_WIDTH = 90; 

  const handleProgressionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      setSelectedProgressionIndex(val === "" ? null : Number(val));
  };

  const isMinorContext = currentScaleName.includes('menor') || currentScaleName.includes('Eólico');
  
  const progressionChords = selectedProgressionIndex !== null 
      ? getProgressionChords(currentRoot, PROGRESSIONS[selectedProgressionIndex]) 
      : [];

  return (
    <div className={`${currentTheme.bg} p-4 rounded-lg shadow-lg transition-colors duration-300`}>
      <h3 className={`text-lg font-semibold text-center ${currentTheme.title} mb-4`}>Círculo de Quintas & Compositor</h3>
      
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          
          {/* The Circle */}
          <div className="relative flex-shrink-0" style={{ width: `${CIRCLE_RADIUS * 2 + KEY_ITEM_WIDTH}px`, height: `${CIRCLE_RADIUS * 2 + KEY_ITEM_WIDTH}px` }}>
            <div className={`absolute inset-0 border-4 border-dashed rounded-full ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} m-auto`} 
                style={{ width: `${CIRCLE_RADIUS * 2}px`, height: `${CIRCLE_RADIUS * 2}px` }}></div>
            
            {CIRCLE_OF_FIFTHS_KEYS.map(key => {
                const isMajorSelected = currentRoot === key.major && currentScaleName === 'Jónico (Mayor)';
                const isMinorSelected = currentRoot === key.minor && currentScaleName === 'Eólico (menor natural)';
                
                const angleRad = (key.angle - 90) * (Math.PI / 180);
                const x = Math.cos(angleRad) * CIRCLE_RADIUS + (CIRCLE_RADIUS + KEY_ITEM_WIDTH/2);
                const y = Math.sin(angleRad) * CIRCLE_RADIUS + (CIRCLE_RADIUS + KEY_ITEM_WIDTH/2);

                const keyWrapperStyle: React.CSSProperties = {
                    position: 'absolute',
                    left: `${x}px`,
                    top: `${y}px`,
                    width: `${KEY_ITEM_WIDTH}px`,
                    transform: 'translate(-50%, -50%)',
                };

                return (
                <div key={key.major} style={keyWrapperStyle}>
                    <div className={`${currentTheme.keyBg} rounded-lg p-2 flex flex-col items-center shadow-md bg-opacity-90 backdrop-blur-sm`}>
                    <button 
                        onClick={() => onKeyChange(key.major, 'Jónico (Mayor)')}
                        className={`
                        w-16 h-8 rounded-md text-lg font-bold transition-all duration-200 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 
                        ${isMajorSelected 
                            ? currentTheme.majorKeySelected 
                            : `${currentTheme.keyText} hover:bg-cyan-500/50`}
                        ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}`
                        }
                    >
                        {key.major}
                    </button>

                    <div className={`text-xs font-mono my-1 ${currentTheme.keySignatureText}`}>{key.sig}</div>

                    <button 
                        onClick={() => onKeyChange(key.minor, 'Eólico (menor natural)')}
                        className={`
                        w-16 h-8 rounded-md text-md font-bold transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-offset-2
                        ${isMinorSelected 
                            ? currentTheme.minorKeySelected 
                            : `${currentTheme.keyText} hover:bg-purple-500/50`}
                        ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}`
                        }
                    >
                        {key.minor}m
                    </button>
                    </div>
                </div>
                );
            })}
          </div>

          {/* Progression Generator */}
          <div className="w-full max-w-md space-y-4">
             <div className={`p-4 rounded-lg border ${currentTheme.progCard}`}>
                <h4 className={`font-bold mb-2 ${currentTheme.subTitle}`}>Generador de Progresiones</h4>
                <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Selecciona un estilo para ver sus acordes en la tonalidad actual ({currentRoot} {isMinorContext ? 'Menor' : 'Mayor'}).
                </p>
                
                <select 
                    className={`w-full p-2 rounded border mb-4 outline-none focus:ring-2 focus:ring-cyan-500 ${currentTheme.select}`}
                    onChange={handleProgressionChange}
                    value={selectedProgressionIndex === null ? "" : selectedProgressionIndex}
                >
                    <option value="">-- Selecciona un estilo --</option>
                    {PROGRESSIONS.map((prog, idx) => (
                        <option key={idx} value={idx}>{prog.name}</option>
                    ))}
                </select>

                {selectedProgressionIndex !== null && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                            {progressionChords.map((chord, i) => {
                                const isActive = isLooping && progressionChords.indexOf(chord) === 0; // Simplified visual check, improved in App
                                return (
                                <button 
                                    key={i}
                                    onClick={() => {
                                        playChordNotes(chord.notes);
                                        onChordSelect(chord);
                                    }}
                                    className={`p-2 rounded text-center transition-transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center border-2 border-transparent
                                        ${isActive ? 'border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : ''}
                                        ${theme === 'dark' ? 'bg-cyan-900/50 hover:bg-cyan-800 text-cyan-100' : 'bg-cyan-100 hover:bg-cyan-200 text-cyan-900'}
                                    `}
                                >
                                    <span className="text-xs opacity-70 font-bold mb-1">{chord.roman}</span>
                                    <span className="font-bold text-sm">{chord.root}{chord.quality === 'Mayor' ? '' : (chord.quality === 'menor' ? 'm' : chord.quality)}</span>
                                </button>
                                );
                            })}
                        </div>
                        
                        <div className="flex gap-2 items-center mb-2">
                             <label className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Compases por Acorde:</label>
                             <select 
                                value={beatsPerChord} 
                                onChange={(e) => setBeatsPerChord(Number(e.target.value))}
                                className={`p-1 rounded text-xs ${currentTheme.select}`}
                             >
                                 <option value={2}>2</option>
                                 <option value={4}>4</option>
                                 <option value={8}>8</option>
                             </select>
                        </div>

                        {/* Start Loop Button */}
                        {onStartLoop && (
                            <button 
                                onClick={() => onStartLoop(progressionChords)}
                                disabled={isLooping}
                                className={`w-full py-3 rounded font-bold uppercase tracking-wider shadow-lg transition-all
                                    ${isLooping 
                                        ? 'bg-green-600 text-white cursor-default animate-pulse ring-2 ring-green-400' 
                                        : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-105'}
                                `}
                            >
                                {isLooping ? '🔄 Reproduciendo Bucle...' : '▶️ Practicar en Bucle'}
                            </button>
                        )}
                    </>
                )}
             </div>
             <div className={`text-xs italic text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                 Tip: Activa el bucle para practicar improvisación continua.
             </div>
          </div>

      </div>
    </div>
  );
});