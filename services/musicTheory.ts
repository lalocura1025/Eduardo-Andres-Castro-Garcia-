import { NOTES, Scale, Chord, ChordQuality, FRET_COUNT, STANDARD_TUNING, MAJOR_CHORD_INTERVALS, CagedShapeName, CAGED_SHAPE_NAMES, PROGRESSIONS, Progression } from '../constants';

/**
 * Calculates the note on a specific fret of a string.
 */
export const getNoteOnFret = (stringNoteIndex: number, fretNumber: number): number => {
  return (stringNoteIndex + fretNumber) % 12;
};

/**
 * Calculates the interval in semitones between two notes.
 */
export const getInterval = (rootNoteIndex: number, targetNoteIndex: number): number => {
  return (targetNoteIndex - rootNoteIndex + 12) % 12;
};

/**
 * Constructs a chord object purely from root and intervals, ignoring current scale context.
 */
export const constructChord = (root: string, quality: ChordQuality, intervals: number[]): Chord => {
    const rootIndex = NOTES.indexOf(root as typeof NOTES[number]);
    const notes = intervals.map(interval => NOTES[(rootIndex + interval) % 12]);
    
    return {
        root,
        quality,
        notes,
        degree: 0 // Degree is irrelevant for non-diatonic construction
    };
};

/**
 * Parses a chord string (e.g., "Am6", "C#Maj7", "Em/G") into a Chord object.
 */
export const parseChord = (chordName: string): Chord | null => {
    if (!chordName) return null;

    // Handle slash chords (e.g., "Em/G") - just take the chord part for now, 
    // though in a full implementation we'd handle the bass note inversion.
    const parts = chordName.split('/');
    const cleanName = parts[0]; 

    // Regex to separate Root from Quality
    // Matches: [A-G] followed optionally by # or b
    const match = cleanName.match(/^([A-G][#b]?)(.*)$/);
    if (!match) return null;

    const root = match[1];
    const qualityStr = match[2];

    let quality: ChordQuality = 'Mayor'; // Default
    let intervals = [0, 4, 7]; // Default Major

    // Map common suffixes to qualities and intervals
    switch (qualityStr) {
        case '': 
        case 'Maj': 
            quality = 'Mayor'; intervals = [0, 4, 7]; break;
        case 'm': 
        case 'min':
            quality = 'menor'; intervals = [0, 3, 7]; break;
        case '7': 
            quality = '7'; intervals = [0, 4, 7, 10]; break;
        case 'Maj7': 
        case 'maj7':
            quality = 'Maj7'; intervals = [0, 4, 7, 11]; break;
        case 'm7': 
        case 'min7':
            quality = 'm7'; intervals = [0, 3, 7, 10]; break;
        case 'm6': 
            quality = 'm6'; intervals = [0, 3, 7, 9]; break;
        case '6': 
            quality = '6'; intervals = [0, 4, 7, 9]; break;
        case 'dim': 
        case 'dim7': 
        case '°':
            quality = 'dim7'; intervals = [0, 3, 6, 9]; break;
        case 'm7b5': 
        case 'ø':
            quality = 'm7b5'; intervals = [0, 3, 6, 10]; break;
        case 'sus4': 
            quality = 'sus4'; intervals = [0, 5, 7]; break;
        case 'sus2': 
            quality = 'sus2'; intervals = [0, 2, 7]; break;
        case 'aug': 
        case '+':
            quality = 'aumentado'; intervals = [0, 4, 8]; break;
        case '7b9':
            quality = '7'; intervals = [0, 4, 7, 10, 13]; break; // Treat as 7 for base, extensions handled by generic logic if needed
        default:
            // Fallback heuristics
            if (qualityStr.includes('m')) { quality = 'menor'; intervals = [0, 3, 7]; }
            else if (qualityStr.includes('7')) { quality = '7'; intervals = [0, 4, 7, 10]; }
            break;
    }

    return constructChord(root, quality, intervals);
};

/**
 * Calculates the diatonic chords for a given root note and scale.
 */
export const getDiatonicChords = (rootNote: string, scale: Scale, chordType: 'triads' | 'sevenths'): Chord[] => {
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
        switch(degree.quality) {
            case 'Mayor': intervals = [0, 4, 7]; break;
            case 'menor': intervals = [0, 3, 7]; break;
            case 'Maj7': intervals = [0, 4, 7, 11]; break;
            case 'm7': intervals = [0, 3, 7, 10]; break;
            case '7': intervals = [0, 4, 7, 10]; break;
            default: intervals = [0, 4, 7]; 
        }
        
        const notes = intervals.map(i => NOTES[(noteIndex + i) % 12]);
        
        return {
            root: chordRoot,
            quality: degree.quality,
            notes: notes,
            degree: 0, 
            roman: degree.roman
        };
    });
};

export interface CagedPosition {
  shapeName: CagedShapeName;
  notes: Set<string>;
}

export const getCagedPositions = (rootNote: string): CagedPosition[] => {
    const rootNoteIndex = NOTES.indexOf(rootNote as typeof NOTES[number]);
    const majorChordNoteIndices = MAJOR_CHORD_INTERVALS.map(i => (rootNoteIndex + i) % 12);
    const tuningIndices = STANDARD_TUNING.slice().reverse().map(note => NOTES.indexOf(note as typeof NOTES[number]));

    const allMajorChordNotes = new Map<string, number>(); 
    tuningIndices.forEach((stringNoteIndex, stringIdx) => {
        for (let fret = 0; fret <= FRET_COUNT; fret++) {
            const noteIndex = getNoteOnFret(stringNoteIndex, fret);
            if (majorChordNoteIndices.includes(noteIndex)) {
                allMajorChordNotes.set(`${stringIdx}-${fret}`, noteIndex);
            }
        }
    });

    const rootNotePositions: { s: number, f: number }[] = [];
    allMajorChordNotes.forEach((noteIndex, key) => {
        if (noteIndex === rootNoteIndex) {
            const [s, f] = key.split('-').map(Number);
            rootNotePositions.push({ s, f });
        }
    });
    rootNotePositions.sort((a, b) => a.f - b.f || a.s - b.s);

    if (rootNotePositions.length === 0) return [];
    
    const positions: CagedPosition[] = [];
    const fretRanges: { name: CagedShapeName, start: number, end: number }[] = [];
    
    let lastFret = -1;
    for (const rootPos of rootNotePositions) {
        if (rootPos.f > lastFret) {
            if (fretRanges.length < 5) {
                fretRanges.push({ name: CAGED_SHAPE_NAMES[fretRanges.length], start: rootPos.f, end: rootPos.f + 4 });
                lastFret = rootPos.f + 1; 
            } else break;
        }
    }
     if (fretRanges.length > 0 && fretRanges.length < 5) {
        let startFret = fretRanges[fretRanges.length - 1].start + 3;
        while(fretRanges.length < 5) {
            fretRanges.push({ name: CAGED_SHAPE_NAMES[fretRanges.length], start: startFret, end: startFret + 4 });
            startFret += 3;
        }
    }

    fretRanges.forEach(range => {
        const positionNotes = new Set<string>();
        allMajorChordNotes.forEach((_, key) => {
            const [, fret] = key.split('-').map(Number);
            const effectiveStart = range.start > 0 ? range.start -1 : 0;
            if (fret >= effectiveStart && fret <= range.end) {
                positionNotes.add(key);
            }
        });
        positions.push({ shapeName: range.name, notes: positionNotes });
    });
    
    while (positions.length < 5) {
        positions.push({ shapeName: CAGED_SHAPE_NAMES[positions.length], notes: new Set() });
    }
    
    return positions.slice(0, 5);
};

export interface VoicingNote {
    string: number; // 0 to 5 (high E to low E)
    fret: number;
    noteName: string;
    interval: string;
}

// Algorithm to find playable shapes
export const findVoicingPositions = (chord: Chord, mask: number[]): VoicingNote[][] => {
    if (!mask || mask.length === 0) return [];

    const tuningIndices = STANDARD_TUNING.slice().reverse().map(note => NOTES.indexOf(note as typeof NOTES[number]));
    const rootIndex = NOTES.indexOf(chord.root as typeof NOTES[number]);

    // 1. Map all possible locations of chord notes on the allowed strings
    const candidates: { [stringIdx: number]: VoicingNote[] } = {};
    
    mask.forEach(stringIdx => {
        candidates[stringIdx] = [];
        const openNoteIndex = tuningIndices[stringIdx];
        
        // Scan frets 0-15
        for (let fret = 0; fret <= 15; fret++) {
            const currentNoteIndex = getNoteOnFret(openNoteIndex, fret);
            const currentNoteName = NOTES[currentNoteIndex];
            
            if (chord.notes.includes(currentNoteName)) {
                // Determine interval relative to root
                let intervalIdx = getInterval(rootIndex, currentNoteIndex);
                // Rough mapping back to interval names
                candidates[stringIdx].push({
                    string: stringIdx,
                    fret: fret,
                    noteName: currentNoteName,
                    interval: '' 
                });
            }
        }
    });

    // 2. Find combinations (One note per string in the mask)
    const shapes: VoicingNote[][] = [];
    
    const search = (stringIndexIdx: number, currentShape: VoicingNote[]) => {
        if (stringIndexIdx >= mask.length) {
            shapes.push([...currentShape]);
            return;
        }

        const currentStringIdx = mask[stringIndexIdx];
        const possibleNotes = candidates[currentStringIdx];

        for (const note of possibleNotes) {
            let valid = true;
            if (currentShape.length > 0) {
                const minFret = Math.min(...currentShape.map(n => n.fret).filter(f => f > 0));
                const maxFret = Math.max(...currentShape.map(n => n.fret).filter(f => f > 0));
                
                const newMin = note.fret > 0 ? Math.min(minFret, note.fret) : minFret;
                const newMax = note.fret > 0 ? Math.max(maxFret, note.fret) : maxFret;

                if ((newMax - newMin) > 4) valid = false; 
            }

            if (valid) {
                search(stringIndexIdx + 1, [...currentShape, note]);
            }
        }
    };

    search(0, []);

    // 3. Sort shapes by average fret (position on neck)
    shapes.sort((a, b) => {
        const avgA = a.reduce((sum, n) => sum + n.fret, 0) / a.length;
        const avgB = b.reduce((sum, n) => sum + n.fret, 0) / b.length;
        return avgA - avgB;
    });
    
    // Filter: If it's a 7th chord and 4 strings, we strictly prefer shapes that have ALL 4 notes
    if (chord.notes.length === 4 && mask.length === 4) {
        const strictShapes = shapes.filter(shape => {
            const uniqueNotes = new Set(shape.map(n => n.noteName));
            return uniqueNotes.size === 4;
        });
        if (strictShapes.length > 0) return strictShapes;
    }

    return shapes;
};