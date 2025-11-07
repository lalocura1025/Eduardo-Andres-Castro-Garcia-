import React from 'react';
import {
  NOTES,
  SCALES,
  STANDARD_TUNING,
  FRET_COUNT,
  INTERVAL_COLORS,
  ScaleName,
} from '../constants';
import { getNoteOnFret, getInterval } from '../services/musicTheory';

interface FretboardProps {
  rootNote: string;
  selectedScale: ScaleName;
}

const FretMarkers = [3, 5, 7, 9, 12, 15, 17, 19, 21];

export const Fretboard: React.FC<FretboardProps> = ({ rootNote, selectedScale }) => {
  const rootNoteIndex = NOTES.indexOf(rootNote as typeof NOTES[number]);
  const scale = SCALES[selectedScale];
  const scaleIntervals = scale.intervals;
  const scaleIntervalNames = scale.intervalNames;
  
  const tuningIndices = STANDARD_TUNING.slice().reverse().map(note => NOTES.indexOf(note as typeof NOTES[number]));

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg overflow-x-auto">
      <div className="inline-block min-w-full font-mono">
        {/* Fret numbers */}
        <div className="flex text-center text-xs text-gray-400">
          <div className="w-10 flex-shrink-0" aria-hidden="true"></div> {/* Spacer for string names */}
          {Array.from({ length: FRET_COUNT + 1 }, (_, i) => (
            <div key={i} className="w-16 flex-shrink-0">
              {i}
            </div>
          ))}
        </div>
        
        {/* Strings and frets */}
        {tuningIndices.map((stringNoteIndex, stringIdx) => (
          <div key={stringIdx} className="flex items-center relative">
             <div className="w-10 text-center font-bold text-lg text-gray-400 flex-shrink-0">
               {NOTES[stringNoteIndex]}
             </div>
            
            {/* Guitar string line */}
            <div className="absolute top-1/2 left-10 right-0 h-0.5 bg-gray-600 z-0 transform -translate-y-1/2"></div>
            
            {Array.from({ length: FRET_COUNT + 1 }, (_, fret) => {
              const noteIndex = getNoteOnFret(stringNoteIndex, fret);
              const interval = getInterval(rootNoteIndex, noteIndex);
              const isInScale = scaleIntervals.includes(interval);
              
              const intervalNameIndex = scaleIntervals.indexOf(interval);
              const intervalName = isInScale ? scaleIntervalNames[intervalNameIndex] : null;

              return (
                <div key={fret} className="w-16 h-12 flex justify-center items-center relative flex-shrink-0">
                  {/* Fret wire */}
                  {fret > 0 && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-500 z-10"></div>}
                  
                  {/* Fret marker dots on the fretboard itself (often only on one string) */}
                  {stringIdx === 2 && FretMarkers.includes(fret) && (
                     <div className={`absolute -bottom-2 w-2.5 h-2.5 rounded-full bg-gray-500 ${fret === 12 ? 'hidden' : ''}`}></div>
                  )}
                  {stringIdx === 2 && fret === 12 && (
                     <>
                        <div className="absolute -bottom-2 -translate-x-2 w-2.5 h-2.5 rounded-full bg-gray-500"></div>
                        <div className="absolute -bottom-2 translate-x-2 w-2.5 h-2.5 rounded-full bg-gray-500"></div>
                     </>
                  )}

                  {isInScale && intervalName && (
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center 
                        text-white font-bold text-sm shadow-lg z-20
                        transform transition-transform hover:scale-110
                        ${INTERVAL_COLORS[intervalName] || 'bg-gray-600'}
                      `}
                      title={`${NOTES[noteIndex]} (${intervalName})`}
                    >
                      {intervalName === 'T' ? NOTES[noteIndex] : intervalName}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
