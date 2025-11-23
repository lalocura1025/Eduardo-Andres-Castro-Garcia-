
import { ScaleName } from '../constants';

export interface SoloNote {
  time: number;
  string: number;
  fret: number;
  duration: number;
}

export interface LessonEvent {
  startTime: number;
  endTime: number;
  root: string;
  scaleName: ScaleName;
  description: string;
  chordName?: string;
}

export interface Song {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  totalDuration: number;
  events: LessonEvent[];
  soloData?: SoloNote[];
  // New fields for Song Dashboard
  chords: string[]; // List of unique chords to display
  progression: string; // Text representation
  key: string;
}

const BAR_MS = 2400;

// --- DATA: MINOR SWING ---
export const MINOR_SWING_SOLO: SoloNote[] = [
  { time: 0, string: 5, fret: 5, duration: 200 },
  { time: 250, string: 4, fret: 7, duration: 200 }, 
  { time: 500, string: 3, fret: 5, duration: 200 },
  { time: 750, string: 2, fret: 5, duration: 200 },
  { time: 1000, string: 1, fret: 5, duration: 400 },
  { time: 1800, string: 1, fret: 8, duration: 180 },
  { time: 2000, string: 1, fret: 7, duration: 180 },
  { time: 2200, string: 1, fret: 5, duration: 180 },
  { time: 2400, string: 2, fret: 6, duration: 180 },
  { time: 2600, string: 2, fret: 5, duration: 800 },
];

export const MINOR_SWING_EVENTS: LessonEvent[] = [
  { startTime: 0, endTime: BAR_MS * 2, root: 'A', scaleName: 'Menor melódica', description: "Am6: Tónica. Usa Menor Melódica.", chordName: "Am6" },
  { startTime: BAR_MS * 2, endTime: BAR_MS * 4, root: 'D', scaleName: 'Dórico', description: "Dm6: Subdominante. D Dórico.", chordName: "Dm6" },
  { startTime: BAR_MS * 4, endTime: BAR_MS * 5, root: 'E', scaleName: 'Alterada (Super Locria)', description: "E7: Tensión Dominante.", chordName: "E7" },
  { startTime: BAR_MS * 5, endTime: BAR_MS * 6, root: 'A', scaleName: 'Menor melódica', description: "Resolución a Am.", chordName: "Am6" },
  { startTime: BAR_MS * 6, endTime: BAR_MS * 7, root: 'D', scaleName: 'Dórico', description: "Dm rápido.", chordName: "Dm7" },
  { startTime: BAR_MS * 7, endTime: BAR_MS * 8, root: 'A', scaleName: 'Menor melódica', description: "Am rápido.", chordName: "Am6" },
  { startTime: BAR_MS * 8, endTime: BAR_MS * 10, root: 'E', scaleName: 'Menor armónica', description: "Turnaround: E7 (Frigio Dominante).", chordName: "E7b9" }
];

// --- DATA: VALS EN VANO ---
const VALS_BAR = 1800;
export const VALS_EN_VANO_EVENTS: LessonEvent[] = [
    { startTime: 0, endTime: VALS_BAR * 4, root: 'A', scaleName: 'Menor armónica', description: "Am: Tónica. Ritmo de Vals. Usa Menor Armónica.", chordName: "Am" },
    { startTime: VALS_BAR * 4, endTime: VALS_BAR * 6, root: 'E', scaleName: 'Mixolidio', description: "E7: Dominante. Bordoneo.", chordName: "E7" },
    { startTime: VALS_BAR * 6, endTime: VALS_BAR * 8, root: 'A', scaleName: 'Menor melódica', description: "Am: Vuelta a tónica.", chordName: "Am" },
    { startTime: VALS_BAR * 8, endTime: VALS_BAR * 10, root: 'D', scaleName: 'Dórico', description: "Dm: Subdominante.", chordName: "Dm" },
    { startTime: VALS_BAR * 10, endTime: VALS_BAR * 12, root: 'G', scaleName: 'Mixolidio', description: "G7: Dominante secundario.", chordName: "G7" },
    { startTime: VALS_BAR * 12, endTime: VALS_BAR * 14, root: 'C', scaleName: 'Jónico (Mayor)', description: "C: Relativa Mayor.", chordName: "C" },
    { startTime: VALS_BAR * 14, endTime: VALS_BAR * 16, root: 'E', scaleName: 'Alterada (Super Locria)', description: "E7: Tensión fuerte.", chordName: "E7" },
    { startTime: VALS_BAR * 16, endTime: VALS_BAR * 18, root: 'A', scaleName: 'Menor armónica', description: "Am: Resolución.", chordName: "Am" },
];

// --- DATA: BESAME MUCHO ---
const BOLERO_BAR = 2800;
export const BESAME_MUCHO_EVENTS: LessonEvent[] = [
    { startTime: 0, endTime: BOLERO_BAR * 4, root: 'D', scaleName: 'Eólico (menor natural)', description: "Dm: Bésame, bésame mucho...", chordName: "Dm" },
    { startTime: BOLERO_BAR * 4, endTime: BOLERO_BAR * 6, root: 'G', scaleName: 'Dórico', description: "Gm: Como si fuera esta noche...", chordName: "Gm" },
    { startTime: BOLERO_BAR * 6, endTime: BOLERO_BAR * 8, root: 'D', scaleName: 'Eólico (menor natural)', description: "Dm: La última vez.", chordName: "Dm" },
    { startTime: BOLERO_BAR * 8, endTime: BOLERO_BAR * 10, root: 'D', scaleName: 'Menor armónica', description: "D7: Que tengo miedo a perderte...", chordName: "D7" },
    { startTime: BOLERO_BAR * 10, endTime: BOLERO_BAR * 12, root: 'G', scaleName: 'Dórico', description: "Gm: Perderte después.", chordName: "Gm" },
    { startTime: BOLERO_BAR * 12, endTime: BOLERO_BAR * 14, root: 'A', scaleName: 'Mixolidio', description: "A7: Dominante.", chordName: "A7" },
    { startTime: BOLERO_BAR * 14, endTime: BOLERO_BAR * 16, root: 'D', scaleName: 'Menor melódica', description: "Dm: Resolución.", chordName: "Dm" },
];

// --- DATA: VALS ODIAME ---
const ODIAME_BAR = 1800;
export const VALS_ODIAME_EVENTS: LessonEvent[] = [
    { startTime: 0, endTime: ODIAME_BAR * 4, root: 'D', scaleName: 'Menor armónica', description: "Dm: Ódiame por piedad yo te lo pido...", chordName: "Dm" },
    { startTime: ODIAME_BAR * 4, endTime: ODIAME_BAR * 8, root: 'A', scaleName: 'Mixolidio', description: "A7: Ódiame sin medida ni clemencia.", chordName: "A7" },
    { startTime: ODIAME_BAR * 8, endTime: ODIAME_BAR * 12, root: 'D', scaleName: 'Menor armónica', description: "Dm: Odio quiero más que indiferencia...", chordName: "Dm" },
    { startTime: ODIAME_BAR * 12, endTime: ODIAME_BAR * 14, root: 'G', scaleName: 'Dórico', description: "Gm: El rencor hiere menos...", chordName: "Gm" },
    { startTime: ODIAME_BAR * 14, endTime: ODIAME_BAR * 16, root: 'D', scaleName: 'Menor armónica', description: "Dm: Que el olvido.", chordName: "Dm" },
    { startTime: ODIAME_BAR * 16, endTime: ODIAME_BAR * 18, root: 'A', scaleName: 'Mixolidio', description: "A7: Dominante", chordName: "A7" },
    { startTime: ODIAME_BAR * 18, endTime: ODIAME_BAR * 20, root: 'D', scaleName: 'Menor melódica', description: "Dm: Final.", chordName: "Dm" }
];


export const SONGS: Song[] = [
  {
    id: 'minor-swing',
    title: 'Minor Swing',
    genre: 'Gypsy Jazz',
    bpm: 190,
    totalDuration: BAR_MS * 10,
    events: MINOR_SWING_EVENTS,
    soloData: MINOR_SWING_SOLO,
    chords: ['Am6', 'Dm6', 'E7', 'Dm7', 'E7b9'],
    progression: 'i - iv - V',
    key: 'Am'
  },
  {
    id: 'vals-en-vano',
    title: 'Vals (Estilo Peruano)',
    genre: 'Vals Peruano',
    bpm: 160,
    totalDuration: VALS_BAR * 18,
    events: VALS_EN_VANO_EVENTS,
    chords: ['Am', 'E7', 'Dm', 'G7', 'C'],
    progression: 'i - V7 - i - iv - VII - III - V7 - i',
    key: 'Am'
  },
  {
    id: 'besame-mucho',
    title: 'Bésame Mucho',
    genre: 'Bolero',
    bpm: 90,
    totalDuration: BOLERO_BAR * 16,
    events: BESAME_MUCHO_EVENTS,
    chords: ['Dm', 'Gm', 'D7', 'A7'],
    progression: 'i - iv - i - V/iv - iv - V7 - i',
    key: 'Dm'
  },
  {
    id: 'odiame',
    title: 'Ódiame',
    genre: 'Vals Peruano',
    bpm: 170,
    totalDuration: ODIAME_BAR * 20,
    events: VALS_ODIAME_EVENTS,
    chords: ['Dm', 'A7', 'Gm'],
    progression: 'i - V7 - i - iv - i - V7 - i',
    key: 'Dm'
  }
];
