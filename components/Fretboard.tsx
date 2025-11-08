
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
      fretboardBg: 'bg-gray-800',
      fretColor: 'border-gray-600',
      stringColor: 'bg-gray-500',
      nutColor: 'bg-gray-500',
      markerColor: 'bg-gray-600',
      noteText: 'text-white',
      noteTextRoot: 'text-gray-900',
      fretNumberText: 'text-gray-400',
    },
    light: {
      fretboardBg: 'bg-yellow-800/20',
      fretColor: 'border-gray-400',
      stringColor: 'bg-gray-400',
      nutColor: 'bg-gray-800',
      markerColor: 'bg-gray-400/50',
      noteText: 'text-gray-900',
      noteTextRoot: 'text-white',
      fretNumberText: 'text-gray-600',
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
    <div className={`p-4 rounded-lg shadow-lg ${currentTheme.fretboardBg} overflow-x-auto`}>
      <div className="relative inline-block" style={{ width: `${(FRET_COUNT + 1) * 70}px` }}>
        {/* Fret Numbers */}
        <div className="flex">
          <div className="w-[35px]"></div>
          {Array.from({ length: FRET_COUNT + 1 }).map((_, fret) => (
            <div key={`fret-num-${fret}`} className={`w-[70px] text-center text-sm ${currentTheme.fretNumberText}`}>
              {fret > 0 ? fret : ''}
            </div>
          ))}
        </div>

        {/* Frets and Strings */}
        <div className="relative">
          {/* Nut */}
          <div className={`absolute top-0 left-[30px] w-2 h-full ${currentTheme.nutColor} z-10 rounded-sm`}></div>
          
          {/* Frets */}
          {Array.from({ length: FRET_COUNT + 1 }).map((_, fret) => (
            <div key={`fret-${fret}`} className={`absolute top-0 h-full w-[2px] ${currentTheme.fretColor} border-l`} style={{ left: `${35 + fret * 70}px` }}></div>
          ))}

          {/* Strings */}
          {tuningIndices.map((_, stringIndex) => (
            <div key={`string-${stringIndex}`} className="relative h-[40px] flex items-center">
              <div className={`absolute left-0 w-full h-[${stringIndex / 2 + 1}px] ${currentTheme.stringColor}`}></div>
            </div>
          ))}

          {/* Fret Markers */}
           {FRET_MARKERS.map(fret => (
              <div key={`marker-${fret}`} className="absolute flex justify-center w-[70px]" style={{ left: `${(fret - 1) * 70}px`, top: '50%', transform: 'translateY(-50%)' }}>
                  <div className={`w-4 h-4 rounded-full ${currentTheme.markerColor} ${fret === 12 ? 'mr-12' : ''}`}></div>
                  {fret === 12 && <div className={`w-4 h-4 rounded-full ${currentTheme.markerColor}`}></div>}
              </div>
          ))}

          {/* Notes */}
          {tuningIndices.map((_, stringIndex) => (
            <div key={`notes-on-string-${stringIndex}`} className="relative h-[40px] flex items-center">
              {Array.from({ length: FRET_COUNT + 1 }).map((_, fret) => {
                const noteInfo = getNoteInfo(stringIndex, fret);
                if (!noteInfo) return <div key={`${stringIndex}-${fret}`} className="w-[70px] h-full" />;
                
                let displayClass = '';
                let noteLabel: string | null = noteInfo.intervalName;

                const chordInfo = getChordNoteInfo(noteInfo.noteName);
                const cagedInfo = getCagedNoteInfo(stringIndex, fret);
                
                if (comparisonData.isComparing) {
                    const compInfo = getComparisonNoteInfo(noteInfo.noteName);
                    if (compInfo) {
                        displayClass = `${compInfo.color} opacity-100`;
                        noteLabel = compInfo.label;
                    } else {
                        displayClass = `opacity-20 ${noteInfo.color}`;
                    }
                } else if (isCagedActive) {
                    if (cagedInfo.isInShape) {
                        displayClass = `${noteInfo.color} opacity-100`;
                    } else {
                        displayClass = `opacity-20 ${noteInfo.color}`;
                    }
                }
                else if (highlightedChord) {
                  if (chordInfo.isChordNote) {
                      displayClass = `${noteInfo.color} ring-2 ring-white ring-offset-2 ${theme === 'dark' ? 'ring-offset-gray-800' : 'ring-offset-yellow-800/20'}`;
                      if (chordInfo.isChordRoot) {
                          displayClass += ' scale-110';
                      }
                  } else {
                      displayClass = `opacity-20 ${noteInfo.color}`;
                  }
                } else {
                   displayClass = noteInfo.color;
                }
                
                return (
                  <div key={`${stringIndex}-${fret}`} className="w-[70px] h-full flex justify-center items-center">
                    <div className={`w-8 h-8 rounded-full flex justify-center items-center font-bold text-sm transition-all duration-200 ${displayClass}`}>
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
