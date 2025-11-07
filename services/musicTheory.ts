
import { NOTES } from '../constants';

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
