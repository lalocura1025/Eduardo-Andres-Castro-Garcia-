export const NOTES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
] as const;

export type ScaleName = 'Jónico (Mayor)' | 'Dórico' | 'Frigio' | 'Lidio' | 'Mixolidio' | 'Eólico (Menor)' | 'Locrio' | 'Pentatónica Menor' | 'Pentatónica Mayor' | 'Blues';

export interface Scale {
  name: ScaleName;
  intervals: number[];
  intervalNames: string[];
}

export const SCALES: Record<ScaleName, Scale> = {
  'Jónico (Mayor)': {
    name: 'Jónico (Mayor)',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    intervalNames: ['T', '2M', '3M', '4J', '5J', '6M', '7M'],
  },
  'Dórico': {
    name: 'Dórico',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    intervalNames: ['T', '2M', '3m', '4J', '5J', '6M', '7m'],
  },
  'Frigio': {
    name: 'Frigio',
    intervals: [0, 1, 3, 5, 7, 8, 10],
    intervalNames: ['T', '2m', '3m', '4J', '5J', '6m', '7m'],
  },
  'Lidio': {
    name: 'Lidio',
    intervals: [0, 2, 4, 6, 7, 9, 11],
    intervalNames: ['T', '2M', '3M', '4A', '5J', '6M', '7M'],
  },
  'Mixolidio': {
    name: 'Mixolidio',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    intervalNames: ['T', '2M', '3M', '4J', '5J', '6M', '7m'],
  },
  'Eólico (Menor)': {
    name: 'Eólico (Menor)',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    intervalNames: ['T', '2M', '3m', '4J', '5J', '6m', '7m'],
  },
  'Locrio': {
    name: 'Locrio',
    intervals: [0, 1, 3, 5, 6, 8, 10],
    intervalNames: ['T', '2m', '3m', '4J', '5d', '6m', '7m'],
  },
  'Pentatónica Menor': {
    name: 'Pentatónica Menor',
    intervals: [0, 3, 5, 7, 10],
    intervalNames: ['T', '3m', '4J', '5J', '7m'],
  },
  'Pentatónica Mayor': {
    name: 'Pentatónica Mayor',
    intervals: [0, 2, 4, 7, 9],
    intervalNames: ['T', '2M', '3M', '5J', '6M'],
  },
  'Blues': {
      name: 'Blues',
      intervals: [0, 3, 5, 6, 7, 10],
      intervalNames: ['T', '3m', '4J', '4A/5d', '5J', '7m']
  }
};

export const STANDARD_TUNING = ['E', 'A', 'D', 'G', 'B', 'E']; // From low to high string
export const FRET_COUNT = 22;

export const INTERVAL_COLORS: { [key: string]: string } = {
  'T': 'bg-red-500', // Tónica
  '2m': 'bg-yellow-500',
  '2M': 'bg-yellow-400',
  '3m': 'bg-green-500',
  '3M': 'bg-green-400',
  '4J': 'bg-cyan-500',
  '4A': 'bg-cyan-400',
  '5d': 'bg-blue-600',
  '5J': 'bg-blue-500',
  '6m': 'bg-indigo-500',
  '6M': 'bg-indigo-400',
  '7m': 'bg-purple-500',
  '7M': 'bg-purple-400',
  '4A/5d': 'bg-blue-700' // blue note
};
