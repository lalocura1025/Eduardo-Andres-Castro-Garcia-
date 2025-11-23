
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Theme } from '../constants';

export type Subdivision = 'quarter' | 'eighth' | 'triplet';

interface MetronomeProps {
  isActive: boolean;
  bpm: number;
  subdivision: Subdivision;
  onBpmChange: (bpm: number) => void;
  onSubdivisionChange: (sub: Subdivision) => void;
  theme: Theme;
}

export const Metronome: React.FC<MetronomeProps> = ({
  isActive,
  bpm,
  subdivision,
  onBpmChange,
  onSubdivisionChange,
  theme,
}) => {
  const [beatCount, setBeatCount] = useState(0);
  const [pulseState, setPulseState] = useState<'none' | 'strong' | 'weak'>('none');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const timerIDRef = useRef<number | null>(null);
  const lookahead = 25.0; // milliseconds
  const scheduleAheadTime = 0.1; // seconds

  // Visual animation reset
  useEffect(() => {
    if (pulseState !== 'none') {
      const timer = setTimeout(() => {
        setPulseState('none');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pulseState]);

  const getInterval = useCallback(() => {
    const quarterNoteMs = 60000 / bpm;
    switch (subdivision) {
      case 'eighth': return quarterNoteMs / 2;
      case 'triplet': return quarterNoteMs / 3;
      case 'quarter':
      default: return quarterNoteMs;
    }
  }, [bpm, subdivision]);

  const playClick = (time: number, isStrong: boolean) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Config per specs: 1200Hz/50ms (Strong), 800Hz/30ms (Weak)
    osc.frequency.value = isStrong ? 1200 : 800;
    osc.type = 'sine';

    const duration = isStrong ? 0.05 : 0.03;

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(1, time + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.start(time);
    osc.stop(time + duration + 0.01);

    // Trigger visual pulse roughly in sync
    // Note: AudioContext time is different from JS time, but for visual feedback this is acceptable
    const delayMs = (time - ctx.currentTime) * 1000;
    setTimeout(() => {
      setPulseState(isStrong ? 'strong' : 'weak');
      setBeatCount(prev => {
          // Logic to reset count based on subdivision to keep "1" consistent?
          // For now simple incrementer
          return (prev + 1) % 12; 
      });
    }, Math.max(0, delayMs));
  };

  const scheduler = () => {
    if (!audioCtxRef.current) return;
    
    // while there are notes that will play this frame
    while (nextNoteTimeRef.current < audioCtxRef.current.currentTime + scheduleAheadTime) {
      // Determine if downbeat
      // Quarter: 1-2-3-4 (Strong on 1?) -> Usually metronomes accent every 4 quarters in 4/4
      // Let's assume 4/4 signature for the "Strong" click logic
      
      let isStrong = false;
      // Logic: We need a counter that persists. 
      // Since this runs in a loop, we can't rely solely on state 'beatCount' for logic inside the scheduler 
      // because state updates are async. We need a ref for the strict audio logic.
      // However, for this simple implementation, let's determine strength by current time or step.
      // Simplified: We will just pulse. 
      // Proper 4/4 accenting:
      // If quarter: 0 is strong, 1,2,3 weak.
      // If eighth: 0 strong, 1,2,3,4,5,6,7 weak? Or 0 strong, 2,4,6 medium?
      // Let's implement: Strong click on the "1" of a 4/4 bar.
      
      // We need to track the beat index inside the scheduler
      if (typeof (scheduler as any).beatIndex === 'undefined') {
          (scheduler as any).beatIndex = 0;
      }
      
      const idx = (scheduler as any).beatIndex;
      
      if (subdivision === 'quarter') {
          isStrong = idx % 4 === 0;
      } else if (subdivision === 'eighth') {
          isStrong = idx % 8 === 0; // 1 and 2 and 3 and 4 and
      } else if (subdivision === 'triplet') {
          isStrong = idx % 12 === 0; // 1 trip let 2 trip let...
      }

      playClick(nextNoteTimeRef.current, isStrong);
      
      // Advance time
      const secondsPerBeat = 60.0 / bpm;
      let interval = secondsPerBeat;
      if (subdivision === 'eighth') interval = secondsPerBeat / 2;
      if (subdivision === 'triplet') interval = secondsPerBeat / 3;
      
      nextNoteTimeRef.current += interval;
      (scheduler as any).beatIndex++;
    }
    
    timerIDRef.current = window.setTimeout(scheduler, lookahead);
  };

  useEffect(() => {
    if (isActive) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.1;
      (scheduler as any).beatIndex = 0; // Reset counter on start
      scheduler();
    } else {
      if (timerIDRef.current) window.clearTimeout(timerIDRef.current);
    }
    return () => {
      if (timerIDRef.current) window.clearTimeout(timerIDRef.current);
    };
  }, [isActive, bpm, subdivision]);


  const themeClasses = {
    dark: {
      bg: 'bg-gray-800',
      text: 'text-gray-200',
      border: 'border-gray-700',
      button: 'bg-gray-700 hover:bg-gray-600 text-white',
      activeSub: 'bg-cyan-600 text-white',
      inactiveSub: 'bg-gray-900 text-gray-400',
      strongPulse: 'bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)] scale-125',
      weakPulse: 'bg-blue-500/80 scale-110',
      idlePulse: 'bg-gray-600 scale-100',
    },
    light: {
      bg: 'bg-white',
      text: 'text-gray-800',
      border: 'border-gray-200',
      button: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
      activeSub: 'bg-cyan-500 text-white',
      inactiveSub: 'bg-gray-100 text-gray-500',
      strongPulse: 'bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-125',
      weakPulse: 'bg-blue-400 scale-110',
      idlePulse: 'bg-gray-300 scale-100',
    }
  };

  const currentTheme = themeClasses[theme];

  const handleBpmChange = (delta: number) => {
      const newBpm = Math.max(40, Math.min(300, bpm + delta));
      onBpmChange(newBpm);
  };

  return (
    <div className={`${currentTheme.bg} p-4 rounded-lg shadow-lg transition-colors duration-300 flex flex-col gap-4 border ${currentTheme.border}`}>
      <div className="flex items-center justify-between">
          {/* Visual Indicator */}
          <div className="flex items-center justify-center w-16">
              <div 
                className={`
                    w-6 h-6 rounded-full transition-all duration-100 ease-out
                    ${pulseState === 'strong' ? currentTheme.strongPulse : 
                      pulseState === 'weak' ? currentTheme.weakPulse : 
                      currentTheme.idlePulse}
                `}
              ></div>
          </div>

          {/* BPM Controls */}
          <div className="flex flex-col items-center flex-1">
              <span className={`text-xs uppercase font-bold tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Tempo</span>
              <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleBpmChange(-5)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${currentTheme.button}`}
                  >-</button>
                  <div className={`text-2xl font-mono font-bold w-12 text-center ${currentTheme.text}`}>{bpm}</div>
                  <button 
                    onClick={() => handleBpmChange(5)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${currentTheme.button}`}
                  >+</button>
              </div>
          </div>
      </div>

      {/* Subdivision Controls */}
      <div className="flex justify-center gap-2">
          <button 
            onClick={() => onSubdivisionChange('quarter')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${subdivision === 'quarter' ? currentTheme.activeSub : currentTheme.inactiveSub}`}
          >
              ♩ Negras
          </button>
          <button 
            onClick={() => onSubdivisionChange('eighth')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${subdivision === 'eighth' ? currentTheme.activeSub : currentTheme.inactiveSub}`}
          >
              ♪ Corcheas
          </button>
          <button 
             onClick={() => onSubdivisionChange('triplet')}
             className={`px-3 py-1 rounded text-sm font-medium transition-colors ${subdivision === 'triplet' ? currentTheme.activeSub : currentTheme.inactiveSub}`}
          >
              3 Tresillos
          </button>
      </div>
    </div>
  );
};
