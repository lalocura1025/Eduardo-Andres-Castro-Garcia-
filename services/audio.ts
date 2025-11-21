
import { NOTES } from '../constants';

// Frequency map for standard tuning reference (A4 = 440Hz)
// We calculate frequencies dynamically based on distance from A4
const getFrequency = (noteIndex: number, octave: number): number => {
  // C0 is index 0. A4 is C0 + 57 semitones (approx).
  // Let's simplify: We map our NOTES array to a base octave and adjust.
  // Base C (C3) approx 130.81 Hz
  const baseC3 = 130.81;
  const semitonesFromC3 = noteIndex + (octave - 3) * 12;
  return baseC3 * Math.pow(2, semitonesFromC3 / 12);
};

let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const playTone = (frequency: number, duration: number = 0.5, type: OscillatorType = 'triangle') => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);

  gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
};

export const playNote = (noteName: string, octave: number = 3) => {
  const noteIndex = NOTES.indexOf(noteName as any);
  if (noteIndex === -1) return;
  const frequency = getFrequency(noteIndex, octave);
  playTone(frequency, 1.5, 'sine'); // Softer tone for individual notes
};

export const playChordNotes = (notes: string[], startOctave: number = 3) => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  
  // Strum effect
  notes.forEach((note, index) => {
    setTimeout(() => {
      // Simple logic to keep notes somewhat close, assuming typical chord voicing
      // If the note index drops significantly, bump octave
      let actualOctave = startOctave;
      const rootIndex = NOTES.indexOf(notes[0] as any);
      const currentIndex = NOTES.indexOf(note as any);
      
      if (currentIndex < rootIndex && index > 0) {
          actualOctave++;
      }

      const frequency = getFrequency(currentIndex, actualOctave);
      playTone(frequency, 2.0, 'triangle');
    }, index * 50); // 50ms delay between strings for strumming effect
  });
};
