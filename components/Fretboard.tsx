import React, { useMemo } from 'react';
import { NOTES, FRET_COUNT, STANDARD_TUNING, Scale, IntervalName, INTERVAL_COLORS, Chord, ChordDisplayMode, ScaleName, Theme } from '../constants';
import { getNoteOnFret, getInterval, CagedPosition } from '../services/musicTheory';

interface FretboardProps {
  selectedRoot: string;
  selectedScale: Scale;
  highlightedChord: Chord | null;
  inversion: number;
  chordDisplayMode: ChordDisplayMode;
  cagedPositions: CagedPosition[];
  isCagedActive: boolean;
  selectedCagedShapeIndex: number | null;
  comparisonData: {
    isComparing: boolean;
    scale1: ScaleName;
    scale2: ScaleName;
    commonNotes: string[];
    uniqueTo1: string[];
    uniqueTo2: string[];
  };
  theme: Theme;
}

const FRET_MARKERS = [3, 5, 7, 9, 12, 15, 17, 19, 21];
const DOUBLE_MARKERS = [12];
const FRET_WIDTH = 90; // Ancho de cada espacio entre trastes

export const Fretboard: React.FC<FretboardProps> = ({
  selectedRoot,
  selectedScale,
  highlightedChord,
  inversion,
  chordDisplayMode,
  cagedPositions,
  isCagedActive,
  selectedCagedShapeIndex,
  comparisonData,
  theme,
}) => {
  const rootNoteIndex = useMemo(() => NOTES.indexOf(selectedRoot as typeof NOTES[number]), [selectedRoot]);
  const tuningIndices = useMemo(() => STANDARD_TUNING.slice().reverse().map(note => NOTES.indexOf(note as typeof NOTES[number])), []);

  const themeClasses = {
    dark: {
      fretboardBg: 'bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950',
      fretColor: 'bg-gray-400',
      stringColor: 'bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500',
      nutColor: 'bg-gray-100',
      markerColor: 'bg-gray-500/40',
      noteText: 'text-white',
      noteTextRoot: 'text-gray-900',
      fretNumberText: 'text-gray-300 font-semibold',
      borderColor: 'border-gray-700',
    },
    light: {
      fretboardBg: 'bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800',
      fretColor: 'bg-gray-500',
      stringColor: 'bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600',
      nutColor: 'bg-gray-900',
      markerColor: 'bg-gray-600/30',
      noteText: 'text-gray-900',
      noteTextRoot: 'text-white',
      fretNumberText: 'text-gray-700 font-semibold',
      borderColor: 'border-gray-600',
    },
  };

  const currentTheme = themeClasses[theme];

  const getNoteInfo = (stringIndex: number, fret: number): { noteName: string; intervalName: IntervalName | null; color: string; isRoot: boolean } | null => {
    const stringNoteIndex = tuningIndices[stringIndex];
    const noteIndex = getNoteOnFret(stringNoteIndex, fret);
    const interval = getInterval(rootNoteIndex, noteIndex);
    
    const scaleNoteIndex = selectedScale.intervals.indexOf(interval);
    if (scaleNoteIndex === -1) return null;

    const intervalName = selectedScale.intervalNames[scaleNoteIndex];
    const isRoot = intervalName === 'R';
    const color = INTERVAL_COLORS[intervalName];

    return { noteName: NOTES[noteIndex], intervalName, color, isRoot };
  };

  const getComparisonNoteInfo = (noteName: string) => {
    if (comparisonData.commonNotes.includes(noteName)) return { color: 'bg-amber-400', label: 'C' };
    if (comparisonData.uniqueTo1.includes(noteName)) return { color: 'bg-sky-500', label: '1' };
    if (comparisonData.uniqueTo2.includes(noteName)) return { color: 'bg-emerald-500', label: '2' };
    return null;
  };
  
  const getChordNoteInfo = (noteName: string) => {
    if (!highlightedChord) return { isChordNote: false, isChordRoot: false };
    
    const rotatedNotes = [...highlightedChord.notes.slice(inversion), ...highlightedChord.notes.slice(0, inversion)];
    const isChordNote = rotatedNotes.includes(noteName);
    const isChordRoot = noteName === highlightedChord.root;

    return { isChordNote, isChordRoot };
  };
  
  const getCagedNoteInfo = (stringIndex: number, fret: number) => {
    if (!isCagedActive || selectedCagedShapeIndex === null) return { isInShape: false };
    const shape = cagedPositions[selectedCagedShapeIndex];
    const isInShape = shape.notes.has(`${stringIndex}-${fret}`);
    return { isInShape };
  };

  return (
    <div className={`p-6 rounded-xl shadow-2xl ${currentTheme.fretboardBg} ${currentTheme.borderColor} border-2 overflow-x-auto`}>
      <div className="relative" style={{ width: `${(FRET_COUNT + 1) * FRET_WIDTH + 50}px`, minHeight: '300px' }}>
        
        {/* Fret Numbers - Arriba */}
        <div className="flex mb-2" style={{ marginLeft: '50px' }}>
          {Array.from({ length: FRET_COUNT + 1 }).map((_, fret) => (
            <div key={`fret-num-${fret}`} className={`text-center text-base ${currentTheme.fretNumberText}`} style={{ width: `${FRET_WIDTH}px` }}>
              {fret > 0 ? fret : ''}
            </div>
          ))}
        </div>

        {/* Contenedor del mástil */}
        <div className="relative" style={{ height: '240px', marginTop: '10px' }}>
          
          {/* Cejuela (Nut) - Línea vertical al inicio */}
          <div className={`absolute top-0 left-[48px] h-full ${currentTheme.nutColor} z-20`} style={{ width: '4px' }}></div>
          
          {/* Trastes (Frets) - Líneas verticales */}
          {Array.from({ length: FRET_COUNT + 1 }).map((_, fret) => (
            <div 
              key={`fret-${fret}`} 
              className={`absolute top-0 h-full ${currentTheme.fretColor} z-10`}
              style={{ 
                left: `${50 + fret * FRET_WIDTH}px`,
                width: fret === 0 ? '0px' : '2px'
              }}
            ></div>
          ))}

          {/* Marcadores de posición (dots) - Debajo del mástil */}
          <div className="absolute" style={{ top: '250px', left: '50px', width: `${FRET_COUNT * FRET_WIDTH}px` }}>
            {FRET_MARKERS.map(fret => {
              const isDouble = DOUBLE_MARKERS.includes(fret);
              return (
                <div 
                  key={`marker-${fret}`} 
                  className="absolute flex justify-center items-center gap-4"
                  style={{ 
                    left: `${(fret - 0.5) * FRET_WIDTH - FRET_WIDTH/2}px`,
                    width: `${FRET_WIDTH}px`
                  }}
                >
                  <div className={`w-4 h-4 rounded-full ${currentTheme.markerColor}`}></div>
                  {isDouble && <div className={`w-4 h-4 rounded-full ${currentTheme.markerColor}`}></div>}
                </div>
              );
            })}
          </div>

          {/* Cuerdas (Strings) - Líneas horizontales */}
          {tuningIndices.map((_, stringIndex) => {
            const stringThickness = 1 + (5 - stringIndex) * 0.5;
            return (
              <div 
                key={`string-${stringIndex}`} 
                className={`absolute left-[50px] ${currentTheme.stringColor} z-5`}
                style={{ 
                  top: `${20 + stringIndex * 40}px`,
                  width: `${FRET_COUNT * FRET_WIDTH}px`,
                  height: `${stringThickness}px`
                }}
              ></div>
            );
          })}

          {/* Notas - En el CENTRO de cada espacio entre trastes */}
          {tuningIndices.map((_, stringIndex) => (
            <div 
              key={`notes-on-string-${stringIndex}`} 
              className="absolute left-[50px] z-20"
              style={{ 
                top: `${20 + stringIndex * 40}px`,
                width: `${FRET_COUNT * FRET_WIDTH}px`,
                height: '40px'
              }}
            >
              <div className="relative w-full h-full flex items-center">
                {Array.from({ length: FRET_COUNT + 1 }).map((_, fret) => {
                  const noteInfo = getNoteInfo(stringIndex, fret);
                  if (!noteInfo) return null;
                  
                  let displayClass = '';
                  let noteLabel: string | null = noteInfo.intervalName;
                  const chordInfo = getChordNoteInfo(noteInfo.noteName);
                  const cagedInfo = getCagedNoteInfo(stringIndex, fret);
                  
                  if (comparisonData.isComparing) {
                    const compInfo = getComparisonNoteInfo(noteInfo.noteName);
                    if (compInfo) {
                      displayClass = `${compInfo.color} opacity-100 shadow-lg`;
                      noteLabel = compInfo.label;
                    } else {
                      displayClass = `opacity-20 ${noteInfo.color}`;
                    }
                  } else if (isCagedActive) {
                    if (cagedInfo.isInShape) {
                      displayClass = `${noteInfo.color} opacity-100 shadow-lg`;
                    } else {
                      displayClass = `opacity-20 ${noteInfo.color}`;
                    }
                  }
                  else if (highlightedChord) {
                    if (chordInfo.isChordNote) {
                      displayClass = `${noteInfo.color} ring-4 ring-white shadow-2xl`;
                      if (chordInfo.isChordRoot) {
                        displayClass += ' scale-125';
                      }
                    } else {
                      displayClass = `opacity-15 ${noteInfo.color}`;
                    }
                  } else {
                    displayClass = `${noteInfo.color} shadow-lg hover:scale-110 transition-transform`;
                  }
                  
                  return (
                    <div 
                      key={`${stringIndex}-${fret}`} 
                      className="absolute"
                      style={{
                        left: `${fret * FRET_WIDTH + FRET_WIDTH/2 - 20}px`,
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    >
                      <div className={`w-10 h-10 rounded-full flex justify-center items-center font-bold text-sm transition-all duration-200 ${displayClass}`}>
                        <span className={noteInfo.isRoot ? currentTheme.noteTextRoot : currentTheme.noteText}>
                          {noteLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
