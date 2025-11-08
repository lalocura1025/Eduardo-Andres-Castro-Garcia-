
import React, { useMemo, useState } from 'react';
import { SCALES, ScaleName, Chord as ChordType, ChordDisplayMode, Theme } from '../constants';
import { getDiatonicChords } from '../services/musicTheory';

interface DiatonicChordSelectorProps {
  rootNote: string;
  selectedScale: ScaleName;
  highlightedChord: ChordType | null;
  setHighlightedChord: (chord: ChordType | null) => void;
  onChordTypeChange: () => void;
  inversion: number;
  setInversion: (inversion: number) => void;
  chordDisplayMode: ChordDisplayMode;
  setChordDisplayMode: (mode: ChordDisplayMode) => void;
  theme: Theme;
}

const getRomanNumeral = (degree: number, quality: ChordType['quality']) => {
    const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    let numeral = numerals[degree];
    
    switch (quality) {
        case 'menor':
            return numeral.toLowerCase();
        case 'disminuido':
            return `${numeral.toLowerCase()}°`;
        case 'aumentado':
            return `${numeral}+`;
        case 'Maj7':
            return `${numeral}Δ7`;
        case 'm7':
            return `${numeral.toLowerCase()}m7`;
        case '7':
            return `${numeral}7`;
        case 'm7b5':
            return `${numeral.toLowerCase()}ø7`;
        case 'dim7':
            return `${numeral.toLowerCase()}°7`;
        default:
            return numeral;
    }
};

const getChordName = (chord: ChordType) => {
    const qualityMap = {
        'Mayor': '',
        'menor': 'm',
        'disminuido': 'dim',
        'aumentado': 'aug',
        'Maj7': 'Maj7',
        'm7': 'm7',
        '7': '7',
        'm7b5': 'm7b5',
        'dim7': 'dim7',
        'aum7': 'aug7'
    };
    return `${chord.root}${qualityMap[chord.quality] || ''}`;
}


export const DiatonicChordSelector: React.FC<DiatonicChordSelectorProps> = ({ 
    rootNote, selectedScale, highlightedChord, setHighlightedChord,
    onChordTypeChange, inversion, setInversion,
    chordDisplayMode, setChordDisplayMode, theme
}) => {
  const [chordType, setChordType] = useState<'triads' | 'sevenths'>('triads');
  const scale = SCALES[selectedScale];

  const chords = useMemo(() => {
    return getDiatonicChords(rootNote, scale, chordType);
  }, [rootNote, scale, chordType]);
  
  const handleChordClick = (chord: ChordType) => {
    if (highlightedChord?.root === chord.root && highlightedChord?.quality === chord.quality) {
      setHighlightedChord(null); // Toggle off if the same chord is clicked
      setInversion(0);
      setChordDisplayMode('all');
    } else {
      setHighlightedChord(chord);
      setInversion(0);
      setChordDisplayMode('all');
    }
  };
  
  const handleChordTypeSwitch = (type: 'triads' | 'sevenths') => {
      if (chordType !== type) {
          setChordType(type);
          onChordTypeChange();
      }
  };

  const inversionLabels = chordType === 'triads'
    ? ['Fundamental', '1ra Inversión', '2da Inversión']
    : ['Fundamental', '1ra Inversión', '2da Inversión', '3ra Inversión'];

  const themeClasses = {
      dark: {
          bg: 'bg-gray-800',
          title: 'text-cyan-400',
          textMuted: 'text-gray-400',
          toggleBg: 'bg-gray-700',
          toggleText: 'text-gray-300',
          button: 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white focus:ring-gray-500',
          buttonSelected: 'bg-cyan-500 text-gray-900 shadow-md scale-105 focus:ring-cyan-400',
          ringOffset: 'focus:ring-offset-gray-800',
          border: 'border-gray-700',
      },
      light: {
          bg: 'bg-white',
          title: 'text-cyan-600',
          textMuted: 'text-gray-500',
          toggleBg: 'bg-gray-200',
          toggleText: 'text-gray-500',
          button: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400',
          buttonSelected: 'bg-cyan-500 text-gray-900 shadow-md scale-105 focus:ring-cyan-400',
          ringOffset: 'focus:ring-offset-white',
          border: 'border-gray-200',
      }
  }
  const currentTheme = themeClasses[theme];


  if (chords.length === 0) {
    return (
       <div className={`${currentTheme.bg} p-4 rounded-lg shadow-lg transition-colors duration-300`}>
         <h3 className={`text-lg font-semibold text-center ${currentTheme.title} mb-2`}>Acordes Diatónicos</h3>
         <p className={`text-center ${currentTheme.textMuted}`}>La formación de acordes no es aplicable a esta escala.</p>
       </div>
    );
  }

  const positionOptions: {label: string, value: ChordDisplayMode}[] = [
      {label: 'Todas', value: 'all'},
      {label: '6ª Cuerda', value: 6},
      {label: '5ª Cuerda', value: 5},
      {label: '4ª Cuerda', value: 4},
  ];

  return (
    <div className={`${currentTheme.bg} p-4 rounded-lg shadow-lg transition-colors duration-300`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-semibold ${currentTheme.title}`}>Acordes Diatónicos</h3>
            {/* Chord Type Toggle */}
            <div className={`flex items-center ${currentTheme.toggleBg} rounded-full p-1`}>
                <button 
                    onClick={() => handleChordTypeSwitch('triads')}
                    className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${chordType === 'triads' ? 'bg-cyan-500 text-gray-900' : currentTheme.toggleText}`}
                >
                    Tríadas
                </button>
                <button 
                    onClick={() => handleChordTypeSwitch('sevenths')}
                    className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${chordType === 'sevenths' ? 'bg-cyan-500 text-gray-900' : currentTheme.toggleText}`}
                >
                    Séptimas
                </button>
            </div>
        </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-4 text-center">
        {chords.map((chord) => {
            const isSelected = highlightedChord?.root === chord.root && highlightedChord?.quality === chord.quality;
            
            return (
              <button 
                key={`${chord.root}-${chord.quality}`} 
                onClick={() => handleChordClick(chord)}
                className={`
                    p-3 rounded-md flex flex-col items-center justify-center transition-all duration-200 ease-in-out transform focus:outline-none
                    focus:ring-2 focus:ring-offset-2 ${currentTheme.ringOffset}
                    ${isSelected 
                        ? currentTheme.buttonSelected 
                        : currentTheme.button
                    }
                `}
              >
                 <div className="text-xl font-bold">{getRomanNumeral(chord.degree, chord.quality)}</div>
                 <div className="text-md text-sm mt-1">{getChordName(chord)}</div>
              </button>
            )
        })}
      </div>
      
      {highlightedChord && (
          <div className={`mt-6 border-t ${currentTheme.border} pt-4 space-y-4`}>
              <div>
                  <h4 className={`text-md font-semibold text-center ${currentTheme.title} mb-3`}>
                      Inversiones para {getChordName(highlightedChord)}
                  </h4>
                  <div className="flex flex-wrap justify-center gap-2">
                      {inversionLabels.map((label, index) => (
                          <button 
                            key={index}
                            onClick={() => setInversion(index)}
                            className={`
                                px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                                ${inversion === index 
                                    ? 'bg-cyan-500 text-gray-900'
                                    : currentTheme.button
                                }
                            `}
                          >
                              {label} ({highlightedChord.notes[index]})
                          </button>
                      ))}
                  </div>
              </div>

              <div>
                  <h4 className={`text-md font-semibold text-center ${currentTheme.title} mb-3`}>
                      Posición del Bajo
                  </h4>
                  <div className="flex flex-wrap justify-center gap-2">
                      {positionOptions.map(({label, value}) => (
                          <button 
                            key={value}
                            onClick={() => setChordDisplayMode(value)}
                            className={`
                                px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                                ${chordDisplayMode === value 
                                    ? 'bg-cyan-500 text-gray-900'
                                    : currentTheme.button
                                }
                            `}
                          >
                              {label}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};