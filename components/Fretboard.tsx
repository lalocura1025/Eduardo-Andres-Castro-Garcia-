import React, { useMemo } from 'react';
import { NOTES, FRET_COUNT, STANDARD_TUNING, Scale, IntervalName, INTERVAL_COLORS, Chord, ChordDisplayMode, ScaleName, SCALES, Theme } from '../constants';
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
      fretboardBg: 'bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950',
      fretColor: 'bg-gray-400',
      stringColor: 'bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400',
      nutColor: 'bg-gray-100',
      markerColor: 'bg-gray-500/40',
      noteText: 'text-white',
      noteTextRoot: 'text-gray-900',
      fretNumberText: 'text-gray-300 font-semibold',
      borderColor: 'border-gray-700',
    },
    light: {
      fretboardBg: 'bg-gradient-to-b from-amber-800 via-amber-700 to-amber-800',
      fretColor: 'bg-gray-500',
      stringColor: 'bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500',
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
      <div className="relative inline-block" style={{ width: `${(FRET_COUNT + 1) * 80 + 40}px` }}>
        {/* Fret Numbers */}
        <div className="flex mb-2">
          <div className="w-[40px]"></div>
          {Array.from({ length: FRET_COUNT + 1 }).map((_, fret) => (
            <div key={`fret-num-${fret}`} className={`w-[80px] text-center text-base ${currentTheme.fretNumberText}`}>
              {fret > 0 ? fret : ''}
            </div>
          ))}
        </div>

        {/* Fretboard Container */}
        <div className="relative" style={{ height: '240px' }}>
          {/* Nut (Cejuela) */}
          <div className={`absolute top-0 left-[38px] w-[4px] h-full ${currentTheme.nutColor} z-20 rounded-sm shadow-lg`}></div>
          
          {/* Frets (Trastes) */}
          {Array.from({ length: FRET_COUNT + 1 }).map((_, fret) => (
            <div 
              key={`fret-${fret}`} 
              className={`absolute top-0 h-full ${currentTheme.fretColor} shadow-sm`}
              style={{ 
                left: `${42 + fret * 80}px`,
                width: fret === 0 ? '0px' : '3px'
              }}
            ></div>
          ))}

          {/* Fret Markers (Puntos de posición) */}
          {FRET_MARKERS.map(fret => {
            const isDouble = DOUBLE_MARKERS.includes(fret);
            return (
              <div 
                key={`marker-${fret}`} 
                className="absolute flex justify-center items-center gap-6 w-[80px]"
                style={{ 
                  left: `${(fret - 0.5) * 80}px`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 5
                }}
              >
                <div className={`w-5 h-5 rounded-full ${currentTheme.markerColor} shadow-inner`}></div>
                {isDouble && <div className={`w-5 h-5 rounded-full ${currentTheme.markerColor} shadow-inner`}></div>}
              </div>
            );
          })}

          {/* Strings (Cuerdas) */}
          {tuningIndices.map((_, stringIndex) => {
            const stringThickness = 1 + (5 - stringIndex) * 0.4;
            return (
              <div 
                key={`string-${stringIndex}`} 
                className="absolute left-0 w-full"
                style={{ 
                  top: `${20 + stringIndex * 40}px`,
                  zIndex: 8
                }}
              >
                <div 
                  className={`w-full ${currentTheme.stringColor} shadow-sm`}
                  style={{ height: `${stringThickness}px` }}
                ></div>
              </div>
            );
          })}

          {/* Notes (Notas) */}
          {tuningIndices.map((_, stringIndex) => (
            <div 
              key={`notes-on-string-${stringIndex}`} 
              className="absolute left-0 w-full flex items-center"
              style={{ 
                top: `${20 + stringIndex * 40}px`,
                height: '40px',
                zIndex: 10
              }}
            >
              {Array.from({ length: FRET_COUNT + 1 }).map((_, fret) => {
                const noteInfo = getNoteInfo(stringIndex, fret);
                if (!noteInfo) return <div key={`${stringIndex}-${fret}`} className="w-[80px] h-full" />;
                
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
                  <div key={`${stringIndex}-${fret}`} className="w-[80px] h-full flex justify-center items-center">
                    <div className={`w-10 h-10 rounded-full flex justify-center items-center font-bold text-sm transition-all duration-200 ${displayClass}`}>
                      <span className={noteInfo.isRoot ? currentTheme.noteTextRoot : currentTheme.noteText}>
                        {noteLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
