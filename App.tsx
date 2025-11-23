
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { RootNoteSelector } from './components/RootNoteSelector';
import { ScaleSelector } from './components/ScaleSelector';
import { Fretboard } from './components/Fretboard';
import { Legend } from './components/Legend';
import { DiatonicChordSelector } from './components/DiatonicChordSelector';
import { CircleOfFifths } from './components/CircleOfFifths';
import { CagedSelector } from './components/CagedSelector';
import { ScaleComparator } from './components/ScaleComparator';
import { PracticeTracker } from './components/PracticeTracker';
import { MusicQuiz } from './components/MusicQuiz';
import { Metronome, Subdivision } from './components/Metronome';
import { NOTES, SCALES, ScaleName, Chord as ChordType, ChordDisplayMode, Theme, CHORD_FAMILIES } from './constants';
import { getCagedPositions, VoicingNote, parseChord } from './services/musicTheory';
import { SONGS } from './data/songs';
import { playNoteByStringFret, playChordNotes } from './services/audio';
import { ImprovisationTips } from './components/ImprovisationTips';
import { VoicingLibrary } from './components/VoicingLibrary';
import { TypicalLicks } from './components/TypicalLicks';
import { HarmonyPanel } from './components/HarmonyPanel'; 
import { ChordComparator } from './components/ChordComparator'; 

function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [selectedRoot, setSelectedRoot] = useState<string>('C');
  const [selectedScaleName, setSelectedScaleName] = useState<ScaleName>('Jónico (Mayor)');
  const [highlightedChord, setHighlightedChord] = useState<ChordType | null>(null);
  const [comparisonChord, setComparisonChord] = useState<ChordType | null>(null); 
  const [inversion, setInversion] = useState(0);
  const [chordDisplayMode, setChordDisplayMode] = useState<ChordDisplayMode>('all');
  const [voicingMask, setVoicingMask] = useState<number[] | null>(null); 
  const [exactVoicing, setExactVoicing] = useState<VoicingNote[] | null>(null);
  
  const [showImprovScale, setShowImprovScale] = useState(false);
  const [improvScaleName, setImprovScaleName] = useState<ScaleName | null>(null);

  const [playingNote, setPlayingNote] = useState<{stringIndex: number, fret: number} | null>(null);
  const [isPlayingSolo, setIsPlayingSolo] = useState(false);
  
  const [currentSongId, setCurrentSongId] = useState<string>(SONGS[0].id);
  
  // --- LESSON ENGINE STATE ---
  const [isLessonActive, setIsLessonActive] = useState(false);
  const [isLessonPaused, setIsLessonPaused] = useState(false);
  const [lessonPlaybackSpeed, setLessonPlaybackSpeed] = useState(1.0); // 0.5, 1.0, 1.5
  const [lessonCurrentTime, setLessonCurrentTime] = useState(0); // Internal accumulator in ms
  const [lessonDurationProgress, setLessonDurationProgress] = useState(0); // 0-100% for current bar
  
  const [lessonText, setLessonText] = useState("Selecciona una canción e inicia");
  const [currentLessonChord, setCurrentLessonChord] = useState<string>("");
  const [nextLessonChord, setNextLessonChord] = useState<string>(""); // Preview next chord
  
  const [isLoopingProgression, setIsLoopingProgression] = useState(false);
  const [progressionQueue, setProgressionQueue] = useState<(ChordType & { roman: string })[]>([]);
  const [currentProgressionIndex, setCurrentProgressionIndex] = useState(0);
  const [beatsPerChord, setBeatsPerChord] = useState(4);

  const lessonFrameRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  // ---------------------------

  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [bpm, setBpm] = useState(100);
  const [subdivision, setSubdivision] = useState<Subdivision>('quarter');
  
  const [isCagedActive, setIsCagedActive] = useState(false);
  const [selectedCagedShapeIndex, setSelectedCagedShapeIndex] = useState<number | null>(0);
  
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonScales, setComparisonScales] = useState({ scale1: 'Jónico (Mayor)' as ScaleName, scale2: 'Pentatónica Mayor' as ScaleName });

  const selectedScale = SCALES[selectedScaleName];
  const notes = NOTES;
  
  const currentSong = useMemo(() => SONGS.find(s => s.id === currentSongId) || SONGS[0], [currentSongId]);

  useEffect(() => {
      if (highlightedChord) {
          const familyMatch = CHORD_FAMILIES.find(f => f.chords.some(c => c.quality === highlightedChord.quality));
          const chordDef = familyMatch?.chords.find(c => c.quality === highlightedChord.quality);
          
          if (chordDef && chordDef.suggestedScales.length > 0) {
              setImprovScaleName(chordDef.suggestedScales[0]);
          }
      } else {
          setImprovScaleName(null);
      }
      setComparisonChord(null); // Reset comparison when base chord changes
  }, [highlightedChord?.root, highlightedChord?.quality]);

  useEffect(() => {
      return () => {
          if (lessonFrameRef.current) cancelAnimationFrame(lessonFrameRef.current);
      }
  }, []);
  
  useEffect(() => {
      setBpm(currentSong.bpm);
      if (currentSong.events.length > 0) {
          setSelectedRoot(currentSong.events[0].root);
      }
  }, [currentSong]);

  const handleRootChange = useCallback((note: string) => {
    setSelectedRoot(note);
    setHighlightedChord(null);
    setExactVoicing(null);
  }, []);

  const handleScaleChange = useCallback((scaleName: ScaleName) => {
    setSelectedScaleName(scaleName);
    setHighlightedChord(null);
    setExactVoicing(null);
  }, []);

  const handleChordTypeChange = useCallback(() => {
    setHighlightedChord(null);
    setExactVoicing(null);
  }, []);
  
  const handleKeyFromCircle = useCallback((root: string, scale: ScaleName) => {
      setSelectedRoot(root);
      setSelectedScaleName(scale);
      setHighlightedChord(null);
      setExactVoicing(null);
  }, []);
  
  const handleChordAndScaleSelect = useCallback((chord: ChordType, scale: ScaleName) => {
      setSelectedRoot(chord.root);
      setSelectedScaleName(scale);
      setHighlightedChord(chord);
      setIsCagedActive(false);
  }, []);
  
  const toggleCaged = useCallback((isActive: boolean) => {
      setIsCagedActive(isActive);
      if (isActive && selectedCagedShapeIndex === null) {
          setSelectedCagedShapeIndex(0);
      }
      setHighlightedChord(null);
      setExactVoicing(null);
  }, [selectedCagedShapeIndex]);
  
  const handleShapeSelect = useCallback((index: number) => {
      if (selectedCagedShapeIndex === index) {
          setSelectedCagedShapeIndex(null); 
      } else {
          setSelectedCagedShapeIndex(index);
      }
  }, [selectedCagedShapeIndex]);

  const handleSetHighlightedChord = (chord: ChordType | null) => {
      setHighlightedChord(chord);
      if (!chord) setExactVoicing(null);
  };
  
  const handleVoicingMaskChange = (mask: number[] | null) => {
      setVoicingMask(mask);
      setExactVoicing(null); 
  }
  
  const handleVoicingSelect = (voicing: VoicingNote[]) => {
      setExactVoicing(voicing);
      setHighlightedChord(null);
  };

  const startProgressionLoop = (chords: (ChordType & { roman: string })[]) => {
      if (chords.length === 0) return;
      setIsLessonActive(false);
      setIsPlayingSolo(false);
      setProgressionQueue(chords);
      setCurrentProgressionIndex(0);
      setIsLoopingProgression(true);
      setIsMetronomeActive(true);
      
      const firstChord = chords[0];
      setHighlightedChord(firstChord);
      setShowImprovScale(true);
      // Need to reset timer mechanism for loop if using standard lesson engine, 
      // but loop has its own engine below.
      lastFrameTimeRef.current = Date.now();
      playChordNotes(firstChord.notes);
  };

  const stopProgressionLoop = () => {
      setIsLoopingProgression(false);
      setIsMetronomeActive(false);
      setHighlightedChord(null);
      setProgressionQueue([]);
  };

  const handleToggleMetronome = () => {
      setIsMetronomeActive(!isMetronomeActive);
  };
  
  const handleSongChordClick = (chordName: string) => {
      const chord = parseChord(chordName);
      if (chord) {
          setHighlightedChord(chord);
          playChordNotes(chord.notes);
          setShowImprovScale(true);
      }
  };

  // --- PROGRESSION LOOP ENGINE ---
  useEffect(() => {
      if (!isLoopingProgression || progressionQueue.length === 0) return;

      const loop = () => {
          const now = Date.now();
          const secondsPerBeat = 60 / bpm;
          const msPerBeat = secondsPerBeat * 1000;
          const msPerChord = msPerBeat * beatsPerChord;
          // Reuse lessonCurrentTime for consistent logic? Or simpler dedicated logic
          // Lets use dedicated for stability
          const elapsed = now - lastFrameTimeRef.current;
          
          // Just cycle based on system time for simplicity in this specific mode
          // But we need to track start.
          // Re-implementing correctly:
          const totalLoopDuration = msPerChord * progressionQueue.length;
          // We need a ref for start time of loop
          // Hack: use lessonCurrentTime as accumulator
          // But this useEffect runs on every render if dependencies change.
          
          // Let's stick to the previous working simple loop for Circle of Fifths
          // Re-instating the logic that was replaced
          // This loop needs a start time ref.
          // Re-using lessonCurrentTime state isn't ideal for 60fps loop.
          
          // Let's assume startProgressionLoop set lessonCurrentTime = Date.now()
          // We need a separate ref for loop start to avoid re-renders
      };
      
      // The previous loop implementation was:
      const startTime = Date.now();
      const loopFrame = () => {
          const now = Date.now();
          const secondsPerBeat = 60 / bpm;
          const msPerBeat = secondsPerBeat * 1000;
          const msPerChord = msPerBeat * beatsPerChord;
          
          const elapsed = now - startTime;
          const totalLoopDuration = msPerChord * progressionQueue.length;
          const loopElapsed = elapsed % totalLoopDuration;
          const newIndex = Math.floor(loopElapsed / msPerChord);
          
          if (newIndex !== currentProgressionIndex) {
              setCurrentProgressionIndex(newIndex);
              const chord = progressionQueue[newIndex];
              setHighlightedChord(chord);
              playChordNotes(chord.notes);
          }
          lessonFrameRef.current = requestAnimationFrame(loopFrame);
      }
      
      loopFrame();
      return () => { if (lessonFrameRef.current) cancelAnimationFrame(lessonFrameRef.current); }
  }, [isLoopingProgression, progressionQueue, currentProgressionIndex, bpm, beatsPerChord]);


  // --- SOLO PLAYER ENGINE ---
  const playSolo = () => {
    if (isPlayingSolo || isLessonActive || !currentSong.soloData) return;
    if (currentSong.events.length > 0) {
        setSelectedRoot(currentSong.events[0].root);
        setSelectedScaleName(currentSong.events[0].scaleName);
    }
    setIsPlayingSolo(true);
    currentSong.soloData.forEach((note) => {
      setTimeout(() => {
        setPlayingNote({ stringIndex: note.string, fret: note.fret });
        playNoteByStringFret(note.string, note.fret, note.duration);
      }, note.time);
      setTimeout(() => {
        setPlayingNote((prev) => prev?.stringIndex === note.string && prev?.fret === note.fret ? null : prev);
      }, note.time + note.duration);
    });
    const totalDuration = currentSong.soloData[currentSong.soloData.length - 1].time + 1000;
    setTimeout(() => setIsPlayingSolo(false), totalDuration);
  };


  // --- GUIDED LESSON ENGINE (New & Improved) ---
  const startLesson = () => {
      setIsLessonActive(true);
      setIsLessonPaused(false);
      setIsPlayingSolo(false);
      setIsLoopingProgression(false);
      setHighlightedChord(null);
      setExactVoicing(null);
      setIsMetronomeActive(true);
      setLessonCurrentTime(0);
      lastFrameTimeRef.current = Date.now();
      setLessonDurationProgress(0);
  };

  const stopLesson = () => {
      setIsLessonActive(false);
      setIsLessonPaused(false);
      setIsMetronomeActive(false);
      setLessonText("Lección finalizada.");
      setCurrentLessonChord("");
      setNextLessonChord("");
      setLessonDurationProgress(0);
  };

  const togglePauseLesson = () => {
      setIsLessonPaused(!isLessonPaused);
      // Reset lastFrameTime so we don't jump when unpausing
      lastFrameTimeRef.current = Date.now();
  };

  useEffect(() => {
      if (!isLessonActive) return;

      const loop = () => {
          const now = Date.now();
          const delta = now - lastFrameTimeRef.current;
          lastFrameTimeRef.current = now;

          if (!isLessonPaused) {
              // Advance time based on speed
              setLessonCurrentTime(prev => {
                  let nextTime = prev + (delta * lessonPlaybackSpeed);
                  if (nextTime >= currentSong.totalDuration) {
                      nextTime = 0; // Loop song
                  }
                  return nextTime;
              });
          }
          
          lessonFrameRef.current = requestAnimationFrame(loop);
      };

      lessonFrameRef.current = requestAnimationFrame(loop);
      return () => { if (lessonFrameRef.current) cancelAnimationFrame(lessonFrameRef.current); }
  }, [isLessonActive, isLessonPaused, lessonPlaybackSpeed, currentSong.totalDuration]);

  // React to lessonCurrentTime changes to update UI (Events)
  useEffect(() => {
      if (!isLessonActive) return;

      const currentEventIndex = currentSong.events.findIndex(e => lessonCurrentTime >= e.startTime && lessonCurrentTime < e.endTime);
      
      if (currentEventIndex !== -1) {
          const currentEvent = currentSong.events[currentEventIndex];
          const nextEvent = currentSong.events[(currentEventIndex + 1) % currentSong.events.length];

          // Calculate Progress for Bar
          const eventDuration = currentEvent.endTime - currentEvent.startTime;
          const eventElapsed = lessonCurrentTime - currentEvent.startTime;
          const progress = Math.min(100, Math.max(0, (eventElapsed / eventDuration) * 100));
          setLessonDurationProgress(progress);

          // Update Texts
          setLessonText(currentEvent.description);
          
          // Update Chord
          const chordName = currentEvent.chordName || "";
          if (chordName !== currentLessonChord) {
              setCurrentLessonChord(chordName);
              // Trigger visual update
              const chord = parseChord(chordName);
              if (chord) {
                  setHighlightedChord(chord);
                  playChordNotes(chord.notes);
              }
              // Sync Context
              if (currentEvent.root !== selectedRoot) setSelectedRoot(currentEvent.root);
              if (currentEvent.scaleName !== selectedScaleName) setSelectedScaleName(currentEvent.scaleName);
              setShowImprovScale(true); // Always show scale in lesson
          }

          if (nextEvent) {
              setNextLessonChord(nextEvent.chordName || "");
          }
      }
  }, [lessonCurrentTime, isLessonActive, currentSong]);


  const cagedPositions = useMemo(() => getCagedPositions(selectedRoot), [selectedRoot]);

  const comparisonData = useMemo(() => {
    const rootIndex = NOTES.indexOf(selectedRoot as typeof NOTES[number]);
    const scale1 = SCALES[comparisonScales.scale1];
    const scale2 = SCALES[comparisonScales.scale2];
    const notes1 = new Set(scale1.intervals.map(i => NOTES[(rootIndex + i) % 12]));
    const notes2 = new Set(scale2.intervals.map(i => NOTES[(rootIndex + i) % 12]));
    const commonNotes = [...notes1].filter(note => notes2.has(note));
    const uniqueTo1 = [...notes1].filter(note => !notes2.has(note));
    const uniqueTo2 = [...notes2].filter(note => !notes1.has(note));
    return { isComparing, scale1: comparisonScales.scale1, scale2: comparisonScales.scale2, commonNotes, uniqueTo1, uniqueTo2 };
  }, [selectedRoot, comparisonScales, isComparing]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  
  const themeClasses = { dark: 'bg-gray-900 text-white', light: 'bg-gray-100 text-gray-900' }

  return (
    <div className={`min-h-screen ${themeClasses[theme]} transition-colors duration-300 font-sans`}>
      <header className="p-4 shadow-md bg-gray-800/80 flex flex-col xl:flex-row justify-between items-center gap-4 sticky top-0 z-50 backdrop-blur-md border-b border-gray-700">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center font-bold text-black text-xl">🎸</div>
            <h1 className="text-xl md:text-2xl font-bold text-cyan-400 tracking-tight">MasterGuitar AI</h1>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-3 bg-gray-900/50 p-2 rounded-xl border border-gray-700">
             <select 
                className="bg-gray-800 text-white text-sm font-bold py-2 px-4 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 outline-none"
                value={currentSongId}
                onChange={(e) => setCurrentSongId(e.target.value)}
                disabled={isLessonActive || isLoopingProgression}
             >
                 {SONGS.map(s => <option key={s.id} value={s.id}>{s.title} ({s.genre})</option>)}
             </select>
             
             {/* MAIN ACTION BUTTON */}
             <button 
                onClick={isLessonActive ? stopLesson : startLesson}
                disabled={isPlayingSolo || isLoopingProgression}
                className={`px-6 py-2 rounded-lg font-bold transition-all duration-200 shadow-lg flex items-center gap-2 text-sm uppercase tracking-wide
                    ${isLessonActive ? 'bg-red-500 text-white ring-2 ring-red-400' : 'bg-green-600 hover:bg-green-500 text-white hover:scale-105'}
                    ${(isPlayingSolo || isLoopingProgression) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
               {isLessonActive ? '⏹ Detener Lección' : '▶️ LECCIÓN GUIADA'}
            </button>
            
            {isLoopingProgression && (
                 <button onClick={stopProgressionLoop} className="px-6 py-2 rounded-lg font-bold transition-all text-sm uppercase bg-red-500 text-white animate-pulse">
                    ⏹ Detener Bucle
                </button>
            )}
        </div>

        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition shadow-sm">
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      {/* SONG DASHBOARD - CHORD STRIP */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b py-3 px-4 shadow-inner`}>
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center gap-4">
              <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Acordes de: <span className="text-cyan-500">{currentSong.title}</span>
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                  {currentSong.chords && currentSong.chords.map((chordName) => {
                      const isActive = highlightedChord && (highlightedChord.root + (highlightedChord.quality === 'Mayor' ? '' : (highlightedChord.quality === 'menor' ? 'm' : highlightedChord.quality)) === chordName);
                      return (
                          <button
                            key={chordName}
                            onClick={() => handleSongChordClick(chordName)}
                            className={`
                                px-4 py-2 rounded-md font-bold text-sm transition-all shadow-sm
                                ${isActive 
                                    ? 'bg-cyan-500 text-gray-900 ring-2 ring-cyan-300 scale-105' 
                                    : theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                            `}
                          >
                              {chordName}
                          </button>
                      )
                  })}
              </div>
          </div>
      </div>

      <main className="p-4 space-y-6 max-w-[1600px] mx-auto">
        
        {/* GUIDED LESSON / LOOP HUD */}
        {(isLessonActive || isLoopingProgression) && (
            <div className="w-full bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 border-2 border-cyan-400/30 rounded-xl p-6 shadow-2xl relative overflow-hidden">
                {/* Progress Bar Background */}
                <div 
                    className="absolute bottom-0 left-0 h-1 bg-cyan-500 transition-all duration-300 ease-linear z-0" 
                    style={{ width: `${isLoopingProgression ? 100 : lessonDurationProgress}%` }}
                ></div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    
                    {/* Controls (Left) */}
                    <div className="flex flex-col gap-2">
                        <h2 className="text-xs uppercase tracking-[0.2em] text-cyan-300 font-bold mb-1">
                            {isLoopingProgression ? 'Bucle de Práctica' : 'Lección en curso'}
                        </h2>
                        
                        {isLessonActive && (
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={togglePauseLesson}
                                    className={`px-4 py-2 rounded font-bold text-sm flex items-center gap-2 border ${isLessonPaused ? 'bg-amber-500 border-amber-400 text-black' : 'bg-gray-700 border-gray-500 text-white'}`}
                                >
                                    {isLessonPaused ? '▶️ Reanudar' : '⏸ Pausar / Practicar'}
                                </button>
                                
                                <div className="flex items-center bg-gray-800 rounded px-2 py-1 border border-gray-600">
                                    <span className="text-xs text-gray-400 mr-2">Velocidad:</span>
                                    <select 
                                        value={lessonPlaybackSpeed} 
                                        onChange={(e) => setLessonPlaybackSpeed(Number(e.target.value))}
                                        className="bg-transparent text-white font-bold text-sm outline-none cursor-pointer"
                                    >
                                        <option value={0.5}>0.5x (Lento)</option>
                                        <option value={1.0}>1.0x (Normal)</option>
                                        <option value={1.5}>1.5x (Rápido)</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Current Chord (Center) */}
                    <div className="flex items-center gap-8">
                        <div className="text-center">
                            <span className="text-xs text-gray-400 uppercase tracking-wide block mb-1">Acorde Actual</span>
                            <div className="text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                                {isLoopingProgression ? progressionQueue[currentProgressionIndex]?.root : currentLessonChord}
                            </div>
                        </div>
                        
                        {/* Next Chord Preview */}
                        {!isLoopingProgression && nextLessonChord && (
                            <div className="text-center opacity-50 hidden sm:block">
                                <span className="text-xs text-gray-400 uppercase tracking-wide block mb-1">Siguiente</span>
                                <div className="text-3xl font-bold text-white">
                                    {nextLessonChord}
                                </div>
                                <div className="text-xl">➡️</div>
                            </div>
                        )}
                    </div>

                    {/* Description (Right) */}
                    <div className="text-right max-w-md hidden lg:block bg-black/20 p-3 rounded-lg border border-white/5">
                         <p className="text-md font-medium text-indigo-100 italic">"{lessonText}"</p>
                         <div className="text-xs text-cyan-300 mt-1 font-bold">
                             {isLessonPaused ? '⏸ LECCIÓN PAUSADA: Practica la escala mostrada.' : 'Escucha y sigue los cambios.'}
                         </div>
                    </div>
                </div>
            </div>
        )}
      
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <h3 className="text-gray-400 text-xs font-bold uppercase mb-4 tracking-widest">Teoría Fundamental</h3>
                    <div className="space-y-4">
                        <RootNoteSelector notes={notes} selectedRoot={selectedRoot} onRootChange={handleRootChange} theme={theme} />
                        <ScaleSelector scales={Object.values(SCALES)} selectedScale={selectedScaleName} onScaleChange={handleScaleChange} theme={theme} />
                    </div>
                </div>
                
                <Metronome isActive={isMetronomeActive} bpm={bpm} subdivision={subdivision} onBpmChange={setBpm} onSubdivisionChange={setSubdivision} theme={theme} />
                <TypicalLicks genre={currentSong.genre.toLowerCase().includes('vals') ? 'vals-peruano' : currentSong.genre.toLowerCase().includes('bolero') ? 'bolero' : currentSong.genre.toLowerCase().includes('tango') ? 'tango' : 'gypsy-jazz'} theme={theme} />
            </div>

            <div className="lg:col-span-9 space-y-6 order-1 lg:order-2">
                <div className="flex flex-col gap-4">
                    <ImprovisationTips selectedRoot={selectedRoot} selectedScale={selectedScale} highlightedChord={highlightedChord} showImprovScale={showImprovScale} onToggleImprovScale={setShowImprovScale} improvScaleName={improvScaleName} onSelectImprovScale={setImprovScaleName} />
                    
                    <HarmonyPanel chord={highlightedChord} theme={theme} />
                </div>

                <Fretboard
                    selectedRoot={selectedRoot}
                    selectedScale={selectedScale}
                    highlightedChord={highlightedChord}
                    comparisonChord={comparisonChord} // Pass comparator
                    inversion={inversion}
                    chordDisplayMode={chordDisplayMode}
                    voicingMask={voicingMask}
                    exactVoicing={exactVoicing} 
                    playingNote={playingNote}
                    cagedPositions={cagedPositions}
                    isCagedActive={isCagedActive}
                    selectedCagedShapeIndex={selectedCagedShapeIndex}
                    comparisonData={comparisonData}
                    showImprovScale={showImprovScale}
                    improvScaleName={improvScaleName}
                    theme={theme}
                />
                
                <div className="flex flex-col gap-6">
                    <Legend selectedScale={selectedScale} theme={theme} />
                    <VoicingLibrary theme={theme} onSelectVoicing={handleVoicingSelect} />

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <DiatonicChordSelector 
                            rootNote={selectedRoot} 
                            selectedScale={selectedScaleName}
                            highlightedChord={highlightedChord}
                            setHighlightedChord={handleSetHighlightedChord}
                            onChordTypeChange={handleChordTypeChange}
                            inversion={inversion}
                            setInversion={setInversion}
                            chordDisplayMode={chordDisplayMode}
                            setChordDisplayMode={setChordDisplayMode}
                            voicingMask={voicingMask}
                            setVoicingMask={handleVoicingMaskChange}
                            setExactVoicing={setExactVoicing}
                            theme={theme}
                            onChordAndScaleSelect={handleChordAndScaleSelect}
                        />
                        {highlightedChord && (
                            <ChordComparator 
                                baseChord={highlightedChord}
                                comparisonChord={comparisonChord}
                                onComparisonChange={setComparisonChord}
                                rootNote={selectedRoot}
                                theme={theme}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CircleOfFifths theme={theme} currentRoot={selectedRoot} currentScaleName={selectedScaleName} onKeyChange={handleKeyFromCircle} onChordSelect={handleSetHighlightedChord} onStartLoop={startProgressionLoop} isLooping={isLoopingProgression} />
            <div className="space-y-6">
                <CagedSelector theme={theme} isActive={isCagedActive} onToggle={toggleCaged} selectedShapeIndex={selectedCagedShapeIndex} onShapeSelect={handleShapeSelect} />
                <ScaleComparator theme={theme} rootNote={selectedRoot} isComparing={isComparing} onComparisonToggle={setIsComparing} comparisonScales={comparisonScales} onScalesChange={setComparisonScales} />
            </div>
            <div className="space-y-6">
                <PracticeTracker theme={theme} />
                <MusicQuiz theme={theme} />
            </div>
        </div>
      </main>
    </div>
  );
}

export default App;
