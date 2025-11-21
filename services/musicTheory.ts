
import { NOTES, Scale, Chord, ChordQuality, FRET_COUNT, STANDARD_TUNING, MAJOR_CHORD_INTERVALS, CagedShapeName, CAGED_SHAPE_NAMES, PROGRESSIONS, Progression } from '../constants';

/**
 * Calculates the note on a specific fret of a string.
 * @param stringNoteIndex - The index of the open string note from the NOTES array.
 * @param fretNumber - The number of the fret (0 for open string).
 * @returns The index of the resulting note in the NOTES array.
 */
export const getNoteOnFret = (stringNoteIndex: number, fretNumber: number): number => {
  return (stringNoteIndex + fretNumber) % 12;
};

/**
 * Calculates the interval in semitones between two notes.
 * @param rootNoteIndex - The index of the root note.
 * @param targetNoteIndex - The index of the target note.
 * @returns The interval in semitones (0-11).
 */
export const getInterval = (rootNoteIndex: number, targetNoteIndex: number): number => {
  return (targetNoteIndex - rootNoteIndex + 12) % 12;
};

/**
 * Calculates the diatonic chords for a given root note and scale.
 * @param rootNote - The root note of the scale.
 * @param scale - The scale object.
 * @param chordType - Whether to generate 'triads' or 'sevenths'.
 * @returns An array of Chord objects.
 */
export const getDiatonicChords = (rootNote: string, scale: Scale, chordType: 'triads' | 'sevenths'): Chord[] => {
  // This function is only designed for 7-note scales (diatonic)
  if (scale.intervals.length !== 7) {
    return [];
  }

  const rootNoteIndex = NOTES.indexOf(rootNote as typeof NOTES[number]);
  const scaleNotes = scale.intervals.map(interval => NOTES[(rootNoteIndex + interval) % 12]);
  const chords: Chord[] = [];

  for (let i = 0; i < scaleNotes.length; i++) {
    const chordRoot = scaleNotes[i];
    const third = scaleNotes[(i + 2) % scaleNotes.length];
    const fifth = scaleNotes[(i + 4) % scaleNotes.length];
    const seventh = scaleNotes[(i + 6) % scaleNotes.length];
    
    const rootIndex = NOTES.indexOf(chordRoot as typeof NOTES[number]);
    
    const intervalToThird = getInterval(rootIndex, NOTES.indexOf(third as typeof NOTES[number]));
    const intervalToFifth = getInterval(rootIndex, NOTES.indexOf(fifth as typeof NOTES[number]));

    let quality: ChordQuality | null = null;
    let notes: string[] = [chordRoot, third, fifth];

    if (chordType === 'sevenths') {
        const intervalToSeventh = getInterval(rootIndex, NOTES.indexOf(seventh as typeof NOTES[number]));
        notes.push(seventh);

        if (intervalToThird === 4 && intervalToFifth === 7 && intervalToSeventh === 11) quality = 'Maj7';
        else if (intervalToThird === 3 && intervalToFifth === 7 && intervalToSeventh === 10) quality = 'm7';
        else if (intervalToThird === 4 && intervalToFifth === 7 && intervalToSeventh === 10) quality = '7';
        else if (intervalToThird === 3 && intervalToFifth === 6 && intervalToSeventh === 10) quality = 'm7b5';
        else if (intervalToThird === 3 && intervalToFifth === 6 && intervalToSeventh === 9) quality = 'dim7';
        else if (intervalToThird === 4 && intervalToFifth === 8 && intervalToSeventh === 10) quality = 'aum7';

    } else { // Triads
        if (intervalToThird === 4 && intervalToFifth === 7) quality = 'Mayor';
        else if (intervalToThird === 3 && intervalToFifth === 7) quality = 'menor';
        else if (intervalToThird === 3 && intervalToFifth === 6) quality = 'disminuido';
        else if (intervalToThird === 4 && intervalToFifth === 8) quality = 'aumentado';
    }

    if (quality) {
      chords.push({ root: chordRoot, quality, notes, degree: i });
    }
  }
  return chords;
};

export const getProgressionChords = (rootNote: string, progression: Progression): (Chord & { roman: string })[] => {
    const rootIndex = NOTES.indexOf(rootNote as typeof NOTES[number]);
    
    return progression.degrees.map(degree => {
        const noteIndex = (rootIndex + degree.offset) % 12;
        const chordRoot = NOTES[noteIndex];
        
        // Build notes based on quality
        let intervals: number[] = [];
        // Simplified interval mapping for display purposes
        switch(degree.quality) {
            case 'Mayor': intervals = [0, 4, 7]; break;
            case 'menor': intervals = [0, 3, 7]; break;
            case 'Maj7': intervals = [0, 4, 7, 11]; break;
            case 'm7': intervals = [0, 3, 7, 10]; break;
            case '7': intervals = [0, 4, 7, 10]; break;
            default: intervals = [0, 4, 7]; // Fallback
        }
        
        const notes = intervals.map(i => NOTES[(noteIndex + i) % 12]);
        
        return {
            root: chordRoot,
            quality: degree.quality,
            notes: notes,
            degree: 0, // Not strictly needed for progression view
            roman: degree.roman
        };
    });
};

export interface CagedPosition {
  shapeName: CagedShapeName;
  notes: Set<string>; // 'stringIdx-fret'
}

export const getCagedPositions = (rootNote: string): CagedPosition[] => {
    const rootNoteIndex = NOTES.indexOf(rootNote as typeof NOTES[number]);
    const majorChordNoteIndices = MAJOR_CHORD_INTERVALS.map(i => (rootNoteIndex + i) % 12);
    const tuningIndices = STANDARD_TUNING.slice().reverse().map(note => NOTES.indexOf(note as typeof NOTES[number]));

    // 1. Find all major chord notes across the entire fretboard
    const allMajorChordNotes = new Map<string, number>(); // key: 'stringIdx-fret', value: noteIndex
    tuningIndices.forEach((stringNoteIndex, stringIdx) => {
        for (let fret = 0; fret <= FRET_COUNT; fret++) {
            const noteIndex = getNoteOnFret(stringNoteIndex, fret);
            if (majorChordNoteIndices.includes(noteIndex)) {
                allMajorChordNotes.set(`${stringIdx}-${fret}`, noteIndex);
            }
        }
    });

    // 2. Find all root note positions to use as anchors
    const rootNotePositions: { s: number, f: number }[] = [];
    allMajorChordNotes.forEach((noteIndex, key) => {
        if (noteIndex === rootNoteIndex) {
            const [s, f] = key.split('-').map(Number);
            rootNotePositions.push({ s, f });
        }
    });
    rootNotePositions.sort((a, b) => a.f - b.f || a.s - b.s);

    if (rootNotePositions.length === 0) return [];
    
    // 3. Define the 5 positions based on fret ranges anchored by root notes
    const positions: CagedPosition[] = [];
    const fretRanges: { name: CagedShapeName, start: number, end: number }[] = [];
    
    let lastFret = -1;
    // Iterate through root notes to define the start of each range
    for (const rootPos of rootNotePositions) {
        if (rootPos.f > lastFret) {
            if (fretRanges.length < 5) {
                // Heuristic: each CAGED shape covers about 4-5 frets
                fretRanges.push({ name: CAGED_SHAPE_NAMES[fretRanges.length], start: rootPos.f, end: rootPos.f + 4 });
                lastFret = rootPos.f + 1; // Ensure next anchor is further down
            } else break;
        }
    }
    // Add C-shape-like position at the end wrapping around
     if (fretRanges.length > 0 && fretRanges.length < 5) {
        let startFret = fretRanges[fretRanges.length - 1].start + 3;
        while(fretRanges.length < 5) {
            fretRanges.push({ name: CAGED_SHAPE_NAMES[fretRanges.length], start: startFret, end: startFret + 4 });
            startFret += 3;
        }
    }


    // 4. Group all chord notes into the 5 fret ranges
    fretRanges.forEach(range => {
        const positionNotes = new Set<string>();
        allMajorChordNotes.forEach((_, key) => {
            const [, fret] = key.split('-').map(Number);
            // Use a slightly wider net to catch notes just outside the main anchor
            const effectiveStart = range.start > 0 ? range.start -1 : 0;
            if (fret >= effectiveStart && fret <= range.end) {
                positionNotes.add(key);
            }
        });
        positions.push({ shapeName: range.name, notes: positionNotes });
    });
    
    // Ensure we have exactly 5 positions, even if it means some are empty
    while (positions.length < 5) {
        positions.push({ shapeName: CAGED_SHAPE_NAMES[positions.length], notes: new Set() });
    }
    
    return positions.slice(0, 5);
};
