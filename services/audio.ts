
import { NOTES, STANDARD_TUNING_OCTAVES, STANDARD_TUNING } from '../constants';
import { VoicingNote } from './musicTheory';

// Frequency map for standard tuning reference (A4 = 440Hz)
const getFrequency = (noteIndex: number, octave: number): number => {
  // Base C0 = 16.35 Hz (Approx)
  const baseFreq = 16.3516; // C0
  const totalSemitones = noteIndex + (octave * 12);
  return baseFreq * Math.pow(2, totalSemitones / 12);
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

  gainNode.gain.setValueAtTime(0.0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05); // Attack
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration); // Decay

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
};

export const playNote = (noteName: string, octave: number = 3) => {
  const noteIndex = NOTES.indexOf(noteName as any);
  if (noteIndex === -1) return;
  const frequency = getFrequency(noteIndex, octave);
  playTone(frequency, 1.5, 'sine'); 
};

export const playNoteByStringFret = (stringIndex: number, fret: number, durationMs: number = 500) => {
    // stringIndex 0 is High E, 5 is Low E
    const openNoteName = STANDARD_TUNING[5-stringIndex]; 
    const openOctave = STANDARD_TUNING_OCTAVES[5-stringIndex];
    
    const openNoteIndex = NOTES.indexOf(openNoteName as any);
    // Calculate total semitones from C0 for absolute pitch
    const totalSemitonesFromC0 = (openOctave * 12) + openNoteIndex + fret;
    
    const freq = 16.3516 * Math.pow(2, totalSemitonesFromC0 / 12);
    
    playTone(freq, durationMs / 1000, 'triangle');
};

export const playChordNotes = (notes: string[], startOctave: number = 3) => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  
  notes.forEach((note, index) => {
    setTimeout(() => {
      let actualOctave = startOctave;
      const rootIndex = NOTES.indexOf(notes[0] as any);
      const currentIndex = NOTES.indexOf(note as any);
      
      if (currentIndex < rootIndex && index > 0) {
          actualOctave++;
      }

      const frequency = getFrequency(currentIndex, actualOctave);
      playTone(frequency, 2.0, 'triangle');
    }, index * 50); 
  });
};

// New function for exact fretboard voicings
export const playSpecificVoicing = (voicing: VoicingNote[]) => {
    // Sort by low strings (high index) to high strings (low index) for strumming direction usually,
    // but voicing mask usually provides arrays like [0,1,2,3] (high E to D).
    // Guitar strum is usually Low to High (String 6 -> 1).
    
    // Sort voicing by string index descending (5 -> 0) for Downstroke effect
    const sortedVoicing = [...voicing].sort((a, b) => b.string - a.string);

    sortedVoicing.forEach((v, i) => {
        setTimeout(() => {
            playNoteByStringFret(v.string, v.fret, 2500);
        }, i * 40); // Strum speed
    });
}
