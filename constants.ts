
export type Theme = 'light' | 'dark';

export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export const FRET_COUNT = 15; 
export const STANDARD_TUNING = ['E', 'A', 'D', 'G', 'B', 'E'] as const;
export const STANDARD_TUNING_OCTAVES = [2, 2, 3, 3, 3, 4]; 

export const INTERVAL_NAMES = ['R', 'm2', 'M2', 'm3', 'M3', 'P4', 'TT', 'P5', 'm6', 'M6', 'm7', 'M7'] as const;
export type IntervalName = typeof INTERVAL_NAMES[number];

export const INTERVAL_FULL_NAMES: Record<IntervalName, string> = {
    'R': 'Raíz (Root)',
    'm2': 'Segunda menor',
    'M2': 'Segunda Mayor',
    'm3': 'Tercera menor',
    'M3': 'Tercera Mayor',
    'P4': 'Cuarta Perfecta',
    'TT': 'Tritono',
    'P5': 'Quinta Perfecta',
    'm6': 'Sexta menor',
    'M6': 'Sexta Mayor',
    'm7': 'Séptima menor',
    'M7': 'Séptima Mayor',
};

export const INTERVAL_COLORS: Record<IntervalName, string> = {
    'R': 'bg-rose-600',
    'm2': 'bg-orange-500',
    'M2': 'bg-amber-400',
    'm3': 'bg-emerald-500',
    'M3': 'bg-green-500',
    'P4': 'bg-sky-400',
    'TT': 'bg-indigo-500',
    'P5': 'bg-blue-600',
    'm6': 'bg-purple-500',
    'M6': 'bg-fuchsia-500',
    'm7': 'bg-pink-500',
    'M7': 'bg-red-400',
};

export interface Scale {
  name: ScaleName;
  intervals: readonly number[];
  intervalNames: readonly IntervalName[];
}

export const SCALES = {
  'Jónico (Mayor)': { name: 'Jónico (Mayor)', intervals: [0, 2, 4, 5, 7, 9, 11], intervalNames: ['R', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'] },
  'Dórico': { name: 'Dórico', intervals: [0, 2, 3, 5, 7, 9, 10], intervalNames: ['R', 'M2', 'm3', 'P4', 'P5', 'M6', 'm7'] },
  'Frigio': { name: 'Frigio', intervals: [0, 1, 3, 5, 7, 8, 10], intervalNames: ['R', 'm2', 'm3', 'P4', 'P5', 'm6', 'm7'] },
  'Lidio': { name: 'Lidio', intervals: [0, 2, 4, 6, 7, 9, 11], intervalNames: ['R', 'M2', 'M3', 'TT', 'P5', 'M6', 'M7'] },
  'Mixolidio': { name: 'Mixolidio', intervals: [0, 2, 4, 5, 7, 9, 10], intervalNames: ['R', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7'] },
  'Eólico (menor natural)': { name: 'Eólico (menor natural)', intervals: [0, 2, 3, 5, 7, 8, 10], intervalNames: ['R', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'] },
  'Locrio': { name: 'Locrio', intervals: [0, 1, 3, 5, 6, 8, 10], intervalNames: ['R', 'm2', 'm3', 'P4', 'TT', 'm6', 'm7'] },
  'Menor armónica': { name: 'Menor armónica', intervals: [0, 2, 3, 5, 7, 8, 11], intervalNames: ['R', 'M2', 'm3', 'P4', 'P5', 'm6', 'M7'] },
  'Menor melódica': { name: 'Menor melódica', intervals: [0, 2, 3, 5, 7, 9, 11], intervalNames: ['R', 'M2', 'm3', 'P4', 'P5', 'M6', 'M7'] },
  'Lidia Dominante': { name: 'Lidia Dominante', intervals: [0, 2, 4, 6, 7, 9, 10], intervalNames: ['R', 'M2', 'M3', 'TT', 'P5', 'M6', 'm7'] },
  'Alterada (Super Locria)': { name: 'Alterada (Super Locria)', intervals: [0, 1, 3, 4, 6, 8, 10], intervalNames: ['R', 'm2', 'm3', 'M3', 'TT', 'm6', 'm7'] },
  'Pentatónica Mayor': { name: 'Pentatónica Mayor', intervals: [0, 2, 4, 7, 9], intervalNames: ['R', 'M2', 'M3', 'P5', 'M6'] },
  'Pentatónica menor': { name: 'Pentatónica menor', intervals: [0, 3, 5, 7, 10], intervalNames: ['R', 'm3', 'P4', 'P5', 'm7'] },
  'Blues': { name: 'Blues', intervals: [0, 3, 5, 6, 7, 10], intervalNames: ['R', 'm3', 'P4', 'TT', 'P5', 'm7'] },
} as const;

export type ScaleName = keyof typeof SCALES;

export type ChordQuality = 'Mayor' | 'menor' | 'disminuido' | 'aumentado' | 'Maj7' | 'm7' | '7' | 'm7b5' | 'dim7' | 'aum7';

export interface Chord {
    root: string;
    quality: ChordQuality;
    notes: string[];
    degree: number;
}

export type ChordDisplayMode = 'all' | 4 | 5 | 6; // 'all' or root on string 4, 5, or 6

export const MAJOR_CHORD_INTERVALS = [0, 4, 7]; 

export type CagedShapeName = 'C' | 'A' | 'G' | 'E' | 'D';
export const CAGED_SHAPE_NAMES: CagedShapeName[] = ['C', 'A', 'G', 'E', 'D'];
export const CAGED_COLORS: Record<CagedShapeName, { color: string, glow: string }> = {
    'C': { color: 'bg-rose-500', glow: 'ring-rose-400' },
    'A': { color: 'bg-blue-500', glow: 'ring-blue-400' },
    'G': { color: 'bg-green-500', glow: 'ring-green-400' },
    'E': { color: 'bg-amber-500', glow: 'ring-amber-400' },
    'D': { color: 'bg-purple-500', glow: 'ring-purple-400' },
};

export const CIRCLE_OF_FIFTHS_KEYS = [
  { major: 'C', minor: 'A', sig: '0', angle: 0 },
  { major: 'G', minor: 'E', sig: '1#', angle: 30 },
  { major: 'D', minor: 'B', sig: '2#', angle: 60 },
  { major: 'A', minor: 'F#', sig: '3#', angle: 90 },
  { major: 'E', minor: 'C#', sig: '4#', angle: 120 },
  { major: 'B', minor: 'G#', sig: '5#', angle: 150 },
  { major: 'F#', minor: 'D#', sig: '6#', angle: 180 },
  { major: 'C#', minor: 'A#', sig: '7#', angle: 210 }, 
  { major: 'G#', minor: 'F', sig: '5b', angle: 240 }, 
  { major: 'D#', minor: 'C', sig: '3b', angle: 270 }, 
  { major: 'A#', minor: 'G', sig: '2b', angle: 300 }, 
  { major: 'F', minor: 'D', sig: '1b', angle: 330 },
] as const;

export interface Progression {
    name: string;
    degrees: { roman: string, quality: ChordQuality, offset: number }[]; // offset is semitones from root
    mode: 'Major' | 'Minor';
}

export const PROGRESSIONS: Progression[] = [
    {
        name: "Jazz Standard (ii-V-I)",
        mode: 'Major',
        degrees: [
            { roman: 'ii', quality: 'm7', offset: 2 },
            { roman: 'V', quality: '7', offset: 7 },
            { roman: 'I', quality: 'Maj7', offset: 0 }
        ]
    },
    {
        name: "Pop Anthem (I-V-vi-IV)",
        mode: 'Major',
        degrees: [
            { roman: 'I', quality: 'Mayor', offset: 0 },
            { roman: 'V', quality: 'Mayor', offset: 7 },
            { roman: 'vi', quality: 'menor', offset: 9 },
            { roman: 'IV', quality: 'Mayor', offset: 5 }
        ]
    },
    {
        name: "R&B / Soul (I-vi-ii-V)",
        mode: 'Major',
        degrees: [
            { roman: 'I', quality: 'Maj7', offset: 0 },
            { roman: 'vi', quality: 'm7', offset: 9 },
            { roman: 'ii', quality: 'm7', offset: 2 },
            { roman: 'V', quality: '7', offset: 7 }
        ]
    },
    {
        name: "Cadencia Andaluza (Flamenco)",
        mode: 'Minor',
        degrees: [
            { roman: 'i', quality: 'menor', offset: 0 },
            { roman: 'bVII', quality: 'Mayor', offset: 10 },
            { roman: 'bVI', quality: 'Mayor', offset: 8 },
            { roman: 'V7', quality: '7', offset: 7 } // Phrygian dominant feel
        ]
    },
    {
        name: "Vals Peruano (Criollo)",
        mode: 'Minor',
        degrees: [
            { roman: 'i', quality: 'menor', offset: 0 },
            { roman: 'V7', quality: '7', offset: 7 },
            { roman: 'i', quality: 'menor', offset: 0 },
            { roman: 'iv', quality: 'menor', offset: 5 },
            { roman: 'V7', quality: '7', offset: 7 }
        ]
    }
];

// String sets for Voicings (0-indexed, 0 is High E, 5 is Low E)
// Drop 2 typically uses 4 strings.
export const VOICING_MASKS = {
    'all': null, // Show all
    'drop2_high': [0, 1, 2, 3], // E B G D
    'drop2_mid': [1, 2, 3, 4], // B G D A
    'drop2_low': [2, 3, 4, 5]  // G D A E
};
