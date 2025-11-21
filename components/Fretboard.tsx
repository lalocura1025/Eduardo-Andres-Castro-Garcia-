
import React, { useMemo } from 'react';
import { NOTES, FRET_COUNT, STANDARD_TUNING, Scale, INTERVAL_COLORS, Chord, ChordDisplayMode, ScaleName, Theme } from '../constants';
import { getNoteOnFret, getInterval, CagedPosition } from '../services/musicTheory';
import { playTone } from '../services/audio';

interface FretboardProps {
  selectedRoot: string;
  selectedScale: Scale;
  highlightedChord: Chord | null;
  inversion: number;
  chordDisplayMode: ChordDisplayMode;
  voicingMask: number[] | null;
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

// Inlays positions (standard guitar)
const INLAYS = [3, 5, 7, 9, 12, 15, 17, 19, 21];

// Map string index to visual thickness (px)
const GET_STRING_THICKNESS = (index: number) => {
    const thicknesses = [4.5, 3.5, 2.5, 2, 1.5, 1];
    return thicknesses[index];
};


export const Fretboard: React.FC<FretboardProps> = ({
  selectedRoot,
  selectedScale,
  highlightedChord,
  inversion,
  chordDisplayMode,
  voicingMask,
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
      wrapper: 'bg-gray-900 border-gray-700',
      fretboardBg: 'bg-[#2a2a2a]', // Slightly warmer dark gray for wood simulation
      fretColor: 'bg-gray-400',
      nutColor: 'bg-[#eecfa1]', // Bone nut color
      inlayColor: 'bg-gray-600',
      stringColor: 'bg-gray-300',
      noteTextRoot: 'text-white',
      noteText: 'text-gray-900',
    },
    light: {
      wrapper: 'bg-white border-gray-200',
      fretboardBg: 'bg-[#5d4037]', // Dark wood color
      fretColor: 'bg-gray-300',
      nutColor: 'bg-[#fff8e1]',
      inlayColor: 'bg-[#8d6e63]',
      stringColor: 'bg-gray-200',
      noteTextRoot: 'text-white',
      noteText: 'text-gray-900',
    },
  };
  const currentTheme = themeClasses[theme];

  const getNoteInfo = (stringIndex: number, fret: number) => {
    const stringNoteIndex = tuningIndices[stringIndex];
    const noteIndex = getNoteOnFret(stringNoteIndex, fret);
    const interval = getInterval(rootNoteIndex, noteIndex);
    
    const scaleNoteIndex = selectedScale.intervals.indexOf(interval);
    if (scaleNoteIndex === -1) return null;

    const intervalName = selectedScale.intervalNames[scaleNoteIndex];
    const isRoot = intervalName === 'R';
    const color = INTERVAL_COLORS[intervalName];

    return { noteName: NOTES[noteIndex], intervalName, color, isRoot, noteIndex, stringIndex };
  };

  const handleNoteClick = (noteIndex: number, stringIndex: number, fret: number) => {
      // Reverse indices array: [E4, B3, G3, D3, A2, E2]
      const baseOctaves = [4, 3, 3, 3, 2, 2];
      const openNoteIndex = tuningIndices[stringIndex];
      
      let currentOctave = baseOctaves[stringIndex];
      const distToC = (12 - openNoteIndex) % 12;
      if (fret >= distToC && openNoteIndex !== 0) {
          currentOctave += Math.floor((fret - distToC) / 12) + 1;
      } else if (openNoteIndex === 0) {
          currentOctave += Math.floor(fret/12);
      }
      
      playTone(
          440 * Math.pow(2, (noteIndex + (currentOctave - 4) * 12 - 9) / 12), 
          0.8,
          'triangle'
      );
  };

  const getComparisonNoteInfo = (noteName: string) => {
    if (comparisonData.commonNotes.includes(noteName)) return { color: 'bg-amber-400', label: 'C' };
    if (comparisonData.uniqueTo1.includes(noteName)) return { color: 'bg-sky-500', label: '1' };
    if (comparisonData.uniqueTo2.includes(noteName)) return { color: 'bg-emerald-500', label: '2' };
    return null;
  };
  
  const getChordNoteInfo = (noteName: string, stringIndex: number) => {
    if (!highlightedChord) return { isChordNote: false, isChordRoot: false };
    
    // Voicing Mask logic: If set, strictly hide notes on strings NOT in the mask
    if (voicingMask && !voicingMask.includes(stringIndex)) {
        return { isChordNote: false, isChordRoot: false };
    }

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

  const cellWidth = 60;

  return (
    <div className={`p-1 rounded-xl shadow-2xl ${currentTheme.wrapper} overflow-hidden`}>
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className={`relative inline-block ${currentTheme.fretboardBg} pl-8 pr-4 py-8 min-w-full`} style={{ width: `${(FRET_COUNT + 1) * cellWidth}px` }}>
            
            {/* Fret Numbers (Top) */}
            <div className="flex absolute top-1 left-8 w-full pointer-events-none">
                {Array.from({ length: FRET_COUNT + 1 }).map((_, fret) => (
                    <div key={`num-${fret}`} className="text-xs opacity-50 font-mono w-[60px] text-center" style={{ color: theme === 'dark' ? '#aaa' : '#fff' }}>
                        {fret > 0 ? fret : ''}
                    </div>
                ))}
            </div>

            {/* Nut */}
            <div className={`absolute top-8 bottom-8 left-6 w-2 ${currentTheme.nutColor} z-10 shadow-sm`}></div>

            {/* Frets Wires */}
            {Array.from({ length: FRET_COUNT + 1 }).map((_, fret) => (
                fret > 0 && (
                    <div 
                        key={`fret-wire-${fret}`} 
                        className={`absolute top-8 bottom-8 w-1 ${currentTheme.fretColor} shadow-sm z-0`} 
                        style={{ left: `${8 + 22 + fret * cellWidth}px` }} // 8pad + 22nutOffset + ...
                    ></div>
                )
            ))}

            {/* Inlays (Dots) */}
            <div className="absolute top-0 left-8 w-full h-full pointer-events-none z-0">
                {INLAYS.map(fret => {
                     if (fret > FRET_COUNT) return null;
                     const isDouble = fret === 12;
                     const leftPos = (fret * cellWidth) - (cellWidth / 2) + 2;
                     return (
                        <div key={`inlay-${fret}`} className="absolute top-1/2 transform -translate-y-1/2 flex flex-col gap-8" style={{ left: `${leftPos}px` }}>
                            {isDouble ? (
                                <>
                                    <div className={`w-3 h-3 rounded-full ${currentTheme.inlayColor} opacity-60 -mt-6`}></div>
                                    <div className={`w-3 h-3 rounded-full ${currentTheme.inlayColor} opacity-60 mt-6`}></div>
                                </>
                            ) : (
                                <div className={`w-4 h-4 rounded-full ${currentTheme.inlayColor} opacity-60`}></div>
                            )}
                        </div>
                     )
                })}
            </div>

            {/* Strings and Notes */}
            <div className="relative z-10 flex flex-col justify-between h-[160px]">
                {tuningIndices.map((_, stringIndex) => (
                    <div key={`string-${stringIndex}`} className="relative flex items-center h-6">
                        {/* The String Line */}
                        <div 
                            className={`absolute left-0 w-full ${currentTheme.stringColor} shadow-sm`} 
                            style={{ height: `${GET_STRING_THICKNESS(5 - stringIndex)}px` }}
                        ></div>

                        {/* Notes on this string */}
                        {Array.from({ length: FRET_COUNT + 1 }).map((_, fret) => {
                            const noteInfo = getNoteInfo(stringIndex, fret);
                            const leftPos = fret * cellWidth;
                            
                            if (!noteInfo) {
                                return <div key={`empty-${stringIndex}-${fret}`} style={{ width: '60px' }}></div>;
                            }

                            const chordInfo = getChordNoteInfo(noteInfo.noteName, stringIndex);
                            const cagedInfo = getCagedNoteInfo(stringIndex, fret);
                            
                            let displayClass = '';
                            let noteLabel: string | null = noteInfo.intervalName;
                            let isDimmed = false;

                            if (comparisonData.isComparing) {
                                const compInfo = getComparisonNoteInfo(noteInfo.noteName);
                                if (compInfo) {
                                    displayClass = `${compInfo.color} opacity-100 shadow-md`;
                                    noteLabel = compInfo.label;
                                } else {
                                    isDimmed = true;
                                    displayClass = `${noteInfo.color}`;
                                }
                            } else if (isCagedActive) {
                                if (cagedInfo.isInShape) {
                                    displayClass = `${noteInfo.color} opacity-100 shadow-md scale-110`;
                                } else {
                                    isDimmed = true;
                                    displayClass = `${noteInfo.color}`;
                                }
                            }
                            else if (highlightedChord) {
                                if (chordInfo.isChordNote) {
                                    displayClass = `${noteInfo.color} ring-2 ring-white shadow-lg scale-110 z-20`;
                                    if (chordInfo.isChordRoot) {
                                        displayClass += ' ring-4 ring-yellow-300 z-30 scale-125';
                                    }
                                } else {
                                    // If mask is active, we really want to hide others almost completely
                                    isDimmed = true;
                                    displayClass = `${noteInfo.color}`;
                                }
                            } else {
                                displayClass = `${noteInfo.color} shadow-sm hover:scale-110 hover:brightness-110`;
                            }

                            return (
                                <div 
                                    key={`${stringIndex}-${fret}`} 
                                    className="absolute flex justify-center items-center cursor-pointer group"
                                    style={{ left: `${leftPos}px`, width: '60px' }}
                                    onClick={() => handleNoteClick(noteInfo.noteIndex, stringIndex, fret)}
                                >
                                    <div 
                                        className={`
                                            w-7 h-7 sm:w-8 sm:h-8 rounded-full flex justify-center items-center 
                                            font-bold text-xs sm:text-sm transition-all duration-150 select-none
                                            ${displayClass}
                                            ${isDimmed ? (voicingMask && highlightedChord ? 'opacity-5 scale-50' : 'opacity-20 scale-75') : 'opacity-100'}
                                        `}
                                    >
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
    </div>
  );
};
