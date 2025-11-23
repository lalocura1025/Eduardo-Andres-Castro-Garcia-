
import React, { useMemo } from 'react';
import { NOTES, FRET_COUNT, STANDARD_TUNING, Scale, INTERVAL_COLORS, Chord, ChordDisplayMode, ScaleName, Theme, SCALES } from '../constants';
import { getNoteOnFret, getInterval, CagedPosition, VoicingNote } from '../services/musicTheory';
import { playTone } from '../services/audio';

interface FretboardProps {
  selectedRoot: string;
  selectedScale: Scale;
  highlightedChord: Chord | null;
  comparisonChord?: Chord | null; // NEW: Chord for comparison
  inversion: number;
  chordDisplayMode: ChordDisplayMode;
  voicingMask: number[] | null;
  exactVoicing: VoicingNote[] | null;
  playingNote: { stringIndex: number, fret: number } | null;
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
  showImprovScale?: boolean;
  improvScaleName?: ScaleName | null;
}

const INLAYS = [3, 5, 7, 9, 12, 15, 17, 19, 21];

const GET_STRING_THICKNESS = (index: number) => {
    const t = [1, 1.5, 2, 3, 4, 5]; 
    return t[index];
};

export const Fretboard: React.FC<FretboardProps> = ({
  selectedRoot,
  selectedScale,
  highlightedChord,
  comparisonChord,
  inversion,
  chordDisplayMode,
  voicingMask,
  exactVoicing,
  playingNote,
  cagedPositions,
  isCagedActive,
  selectedCagedShapeIndex,
  comparisonData,
  theme,
  showImprovScale,
  improvScaleName
}) => {
  const rootNoteIndex = useMemo(() => NOTES.indexOf(selectedRoot as typeof NOTES[number]), [selectedRoot]);
  const tuningIndices = useMemo(() => STANDARD_TUNING.slice().reverse().map(note => NOTES.indexOf(note as typeof NOTES[number])), []);

  // Pre-calculate ghost note indices if enabled
  const ghostNotes = useMemo(() => {
      if (!showImprovScale || !improvScaleName || !highlightedChord) return new Set<number>();
      
      const scale = SCALES[improvScaleName];
      const chordRootIndex = NOTES.indexOf(highlightedChord.root as any);
      
      const noteIndices = new Set<number>();
      scale.intervals.forEach(interval => {
          noteIndices.add((chordRootIndex + interval) % 12);
      });
      return noteIndices;
  }, [showImprovScale, improvScaleName, highlightedChord]);

  // Helper to get Interval Label (e.g. "b3") relative to a specific root
  const getRelativeIntervalName = (targetNoteIndex: number, rootNoteStr: string) => {
      const rIndex = NOTES.indexOf(rootNoteStr as any);
      const interval = getInterval(rIndex, targetNoteIndex);
      
      // Map semitones to standard interval names for chords
      const map: Record<number, string> = {
          0: 'R', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4', 6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7'
      };
      return map[interval] || '?';
  };

  const currentWood = theme === 'dark' ? {
        background: `repeating-linear-gradient(90deg, #2d1b14, #2d1b14 2px, #382218 3px, #2d1b14 4px), radial-gradient(circle at 50% 50%, rgba(0,0,0,0), rgba(0,0,0,0.4))`,
        backgroundColor: '#3e2723',
        boxShadow: 'inset 0 0 20px #000',
        borderTop: '4px solid #1a100c',
        borderBottom: '4px solid #1a100c'
    } : {
        background: `repeating-linear-gradient(90deg, #5d4037, #5d4037 2px, #6d4c41 3px, #5d4037 4px), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0.1))`,
        backgroundColor: '#795548',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)',
        borderTop: '4px solid #3e2723',
        borderBottom: '4px solid #3e2723'
    };

  const fretStyle = {
      background: 'linear-gradient(180deg, #999 0%, #eee 40%, #fff 50%, #999 100%)',
      boxShadow: '2px 0 3px rgba(0,0,0,0.4), -1px 0 1px rgba(0,0,0,0.2)'
  };

  const inlayStyle = {
      background: 'radial-gradient(circle, #fff 20%, #ddd 80%, #aaa 100%)',
      boxShadow: '0 0 2px rgba(0,0,0,0.5)'
  };

  const getStringStyle = (index: number) => {
      const thickness = GET_STRING_THICKNESS(index);
      const isWound = index >= 3; 
      const background = isWound ? 'repeating-linear-gradient(45deg, #999, #999 1px, #555 2px, #333 2px)' : 'linear-gradient(0deg, #888, #fff, #888)';
      return { height: `${thickness}px`, background, boxShadow: '0 2px 3px rgba(0,0,0,0.6)' };
  };

  const getNoteInfo = (stringIndex: number, fret: number) => {
    const stringNoteIndex = tuningIndices[stringIndex];
    const noteIndex = getNoteOnFret(stringNoteIndex, fret);
    const interval = getInterval(rootNoteIndex, noteIndex);
    const scaleNoteIndex = selectedScale.intervals.indexOf(interval);
    
    // Default Scale Logic
    if (scaleNoteIndex === -1) {
        return { 
            noteName: NOTES[noteIndex], 
            intervalName: '', 
            color: 'bg-gray-500', 
            isRoot: false, 
            noteIndex, 
            stringIndex 
        };
    }

    const intervalName = selectedScale.intervalNames[scaleNoteIndex];
    const isRoot = intervalName === 'R';
    const color = INTERVAL_COLORS[intervalName];

    return { noteName: NOTES[noteIndex], intervalName, color, isRoot, noteIndex, stringIndex };
  };

  const handleNoteClick = (noteIndex: number, stringIndex: number, fret: number) => {
      const baseOctaves = [4, 3, 3, 3, 2, 2];
      const openNoteIndex = tuningIndices[stringIndex];
      let currentOctave = baseOctaves[stringIndex];
      const distToC = (12 - openNoteIndex) % 12;
      if (fret >= distToC && openNoteIndex !== 0) currentOctave += Math.floor((fret - distToC) / 12) + 1;
      else if (openNoteIndex === 0) currentOctave += Math.floor(fret/12);
      
      playTone(440 * Math.pow(2, (noteIndex + (currentOctave - 4) * 12 - 9) / 12), 0.8, 'triangle');
  };

  const getComparisonNoteInfo = (noteName: string) => {
    if (comparisonData.commonNotes.includes(noteName)) return { color: 'bg-amber-400', label: 'C' };
    if (comparisonData.uniqueTo1.includes(noteName)) return { color: 'bg-sky-500', label: '1' };
    if (comparisonData.uniqueTo2.includes(noteName)) return { color: 'bg-emerald-500', label: '2' };
    return null;
  };
  
  // Logic for Chord Comparator
  const getChordComparisonInfo = (noteName: string) => {
      if (!highlightedChord || !comparisonChord) return null;
      
      const inBase = highlightedChord.notes.includes(noteName);
      const inComp = comparisonChord.notes.includes(noteName);
      
      if (inBase && inComp) return { color: 'bg-yellow-400', label: getRelativeIntervalName(NOTES.indexOf(noteName as any), highlightedChord.root) };
      if (inBase && !inComp) return { color: 'bg-red-500', label: '-' };
      if (!inBase && inComp) return { color: 'bg-green-500', label: '+' };
      
      return null;
  };

  const cellWidth = 75; 

  return (
    <div className={`p-2 rounded-xl shadow-2xl ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} overflow-hidden`}>
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="relative inline-block pl-10 pr-8 py-10 min-w-full" style={{ width: `${(FRET_COUNT + 1) * cellWidth}px`, ...currentWood }}>
            
            {/* Nut & Frets */}
            <div className="absolute top-0 bottom-0 left-8 w-4 z-10 shadow-md" style={{ background: 'linear-gradient(90deg, #e3d6c5, #fff, #e3d6c5)' }}></div>
            <div className="flex absolute top-2 left-8 w-full pointer-events-none z-20">
                {Array.from({ length: FRET_COUNT + 1 }).map((_, fret) => (
                    <div key={`num-${fret}`} className="text-xs opacity-70 font-bold font-mono w-[75px] text-center drop-shadow-md" style={{ color: '#fff' }}>{fret > 0 ? fret : ''}</div>
                ))}
            </div>
            {Array.from({ length: FRET_COUNT + 1 }).map((_, fret) => fret > 0 && (
                <div key={`fret-wire-${fret}`} className="absolute top-0 bottom-0 w-2 z-0" style={{ left: `${8 + 35 + fret * cellWidth}px`, ...fretStyle }}></div>
            ))}
            <div className="absolute top-0 left-8 w-full h-full pointer-events-none z-0">
                {INLAYS.map(fret => {
                     if (fret > FRET_COUNT) return null;
                     const leftPos = (fret * cellWidth) - (cellWidth / 2) + 4; 
                     return <div key={`inlay-${fret}`} className="absolute top-1/2 transform -translate-y-1/2 flex flex-col gap-16" style={{ left: `${leftPos}px` }}>
                            {fret === 12 ? <><div className="w-4 h-4 rounded-full opacity-90 -mt-8" style={inlayStyle}></div><div className="w-4 h-4 rounded-full opacity-90 mt-8" style={inlayStyle}></div></> : <div className="w-5 h-5 rounded-full opacity-90" style={inlayStyle}></div>}
                        </div>
                })}
            </div>

            {/* Strings and Notes */}
            <div className="relative z-10 flex flex-col justify-between h-[180px]">
                {tuningIndices.map((_, stringIndex) => (
                    <div key={`string-${stringIndex}`} className="relative flex items-center h-8">
                        <div className="absolute left-0 w-full" style={getStringStyle(stringIndex)}></div>
                        {Array.from({ length: FRET_COUNT + 1 }).map((_, fret) => {
                            const noteInfo = getNoteInfo(stringIndex, fret);
                            const leftPos = fret * cellWidth;
                            
                            const isPlaying = playingNote?.stringIndex === stringIndex && playingNote?.fret === fret;
                            const isGhostNote = ghostNotes.has(noteInfo.noteIndex);
                            const exactVoicingNote = exactVoicing?.find(v => v.string === stringIndex && v.fret === fret);

                            let displayClass = '';
                            let noteLabel = noteInfo.intervalName;
                            let isDimmed = false;
                            let isGhost = false;
                            
                            // PRIORITY RENDERER
                            
                            // 1. Playing Note
                            if (isPlaying) {
                                displayClass = `bg-cyan-400 text-black ring-4 ring-white shadow-[0_0_30px_rgba(34,211,238,1)] z-50 scale-125 font-bold`;
                                noteLabel = noteInfo.noteName;
                            }
                            // 2. Exact Voicing
                            else if (exactVoicing) {
                                if (exactVoicingNote) {
                                    // Calculate interval relative to highlighted chord root for display
                                    const ivLabel = highlightedChord ? getRelativeIntervalName(noteInfo.noteIndex, highlightedChord.root) : noteInfo.intervalName;
                                    displayClass = `${noteInfo.color} ring-2 ring-white shadow-[0_0_15px_rgba(255,255,255,0.8)] scale-110 z-30 text-white`;
                                    noteLabel = ivLabel; 
                                    if (ivLabel === 'R') displayClass += ' ring-4 ring-yellow-300 scale-125 z-40';
                                } else {
                                    isDimmed = true; 
                                    displayClass = `${noteInfo.color}`;
                                }
                            }
                            // 3. Chord Comparator
                            else if (comparisonChord && highlightedChord) {
                                const compInfo = getChordComparisonInfo(noteInfo.noteName);
                                if (compInfo) {
                                    displayClass = `${compInfo.color} opacity-100 shadow-md text-white scale-110 z-20`;
                                    noteLabel = compInfo.label;
                                } else {
                                    isDimmed = true;
                                    displayClass = `${noteInfo.color}`;
                                }
                            }
                            // 4. Highlighted Chord (Standard)
                            else if (highlightedChord) {
                                const rotatedNotes = [...highlightedChord.notes.slice(inversion), ...highlightedChord.notes.slice(0, inversion)];
                                if (rotatedNotes.includes(noteInfo.noteName) && (!voicingMask || voicingMask.includes(stringIndex))) {
                                    const ivLabel = getRelativeIntervalName(noteInfo.noteIndex, highlightedChord.root);
                                    displayClass = `${noteInfo.color} ring-2 ring-white shadow-lg scale-110 z-20 text-white`;
                                    noteLabel = ivLabel; // SHOW CHORD INTERVALS
                                    if (ivLabel === 'R') displayClass += ' ring-4 ring-yellow-300 z-30 scale-125';
                                } else if (showImprovScale && isGhostNote) {
                                    isGhost = true;
                                    const scale = SCALES[improvScaleName || 'Jónico (Mayor)'];
                                    const scaleIdx = (scale.intervals as readonly number[]).indexOf(getInterval(NOTES.indexOf(highlightedChord.root as any), noteInfo.noteIndex));
                                    const ivName = scaleIdx !== -1 ? scale.intervalNames[scaleIdx] : '';
                                    displayClass = `bg-gray-600/50 border-2 border-white/30 text-white z-10`;
                                    noteLabel = ivName;
                                } else {
                                    isDimmed = true;
                                    displayClass = `${noteInfo.color}`;
                                }
                            } 
                            // 5. Scale Comparison
                            else if (comparisonData.isComparing) {
                                const compInfo = getComparisonNoteInfo(noteInfo.noteName);
                                if (compInfo) {
                                    displayClass = `${compInfo.color} opacity-100 shadow-md text-white`;
                                    noteLabel = compInfo.label;
                                } else {
                                    isDimmed = true;
                                    displayClass = `${noteInfo.color}`;
                                }
                            }
                            // 6. Default
                            else {
                                if (noteInfo.intervalName === '') displayClass = 'bg-transparent text-transparent'; 
                                else displayClass = `${noteInfo.color} text-white shadow-md hover:scale-110 border border-white/20`;
                            }

                            if (isDimmed) {
                                if (exactVoicing) displayClass += ' opacity-0';
                                else displayClass += ' opacity-20 scale-50';
                            }

                            if (noteInfo.intervalName === '' && !isPlaying && !isGhost) return null;

                            return (
                                <div 
                                    key={`${stringIndex}-${fret}`} 
                                    className="absolute flex justify-center items-center cursor-pointer group"
                                    style={{ left: `${leftPos}px`, width: `${cellWidth}px` }}
                                    onClick={() => handleNoteClick(noteInfo.noteIndex, stringIndex, fret)}
                                >
                                    <div className={`w-8 h-8 rounded-full flex justify-center items-center font-bold text-xs shadow-sm transition-all duration-200 select-none ${displayClass}`}>
                                        <span className={noteLabel === 'R' ? 'text-white font-black' : 'text-white font-medium'}>{noteLabel}</span>
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
