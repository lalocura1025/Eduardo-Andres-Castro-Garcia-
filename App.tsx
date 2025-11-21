
import React, { useState, useMemo, useCallback } from 'react';
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
import { NOTES, SCALES, ScaleName, Chord as ChordType, ChordDisplayMode, Theme } from './constants';
import { getCagedPositions } from './services/musicTheory';

function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [selectedRoot, setSelectedRoot] = useState<string>('C');
  const [selectedScaleName, setSelectedScaleName] = useState<ScaleName>('Jónico (Mayor)');
  const [highlightedChord, setHighlightedChord] = useState<ChordType | null>(null);
  const [inversion, setInversion] = useState(0);
  const [chordDisplayMode, setChordDisplayMode] = useState<ChordDisplayMode>('all');
  const [voicingMask, setVoicingMask] = useState<number[] | null>(null); // Strings to show
  
  const [isCagedActive, setIsCagedActive] = useState(false);
  const [selectedCagedShapeIndex, setSelectedCagedShapeIndex] = useState<number | null>(0);
  
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonScales, setComparisonScales] = useState({ scale1: 'Jónico (Mayor)' as ScaleName, scale2: 'Pentatónica Mayor' as ScaleName });

  const selectedScale = SCALES[selectedScaleName];
  const notes = NOTES;

  const handleRootChange = useCallback((note: string) => {
    setSelectedRoot(note);
    setHighlightedChord(null);
  }, []);

  const handleScaleChange = useCallback((scaleName: ScaleName) => {
    setSelectedScaleName(scaleName);
    setHighlightedChord(null);
  }, []);

  const handleChordTypeChange = useCallback(() => {
    setHighlightedChord(null);
  }, []);
  
  const handleKeyFromCircle = useCallback((root: string, scale: ScaleName) => {
      setSelectedRoot(root);
      setSelectedScaleName(scale);
      setHighlightedChord(null);
  }, []);
  
  const toggleCaged = useCallback((isActive: boolean) => {
      setIsCagedActive(isActive);
      if (isActive && selectedCagedShapeIndex === null) {
          setSelectedCagedShapeIndex(0);
      }
      setHighlightedChord(null); // disable chord highlight when caged is active
  }, [selectedCagedShapeIndex]);
  
  const handleShapeSelect = useCallback((index: number) => {
      if (selectedCagedShapeIndex === index) {
          setSelectedCagedShapeIndex(null); // toggle off
      } else {
          setSelectedCagedShapeIndex(index);
      }
  }, [selectedCagedShapeIndex]);

  const handleSetHighlightedChord = (chord: ChordType | null) => {
      setHighlightedChord(chord);
      // If we clear the chord, also maybe clear voicing mask? 
      // Keeping voicing mask active allows exploring scale with fewer strings too if we wanted,
      // but primarily it is for chords.
  };
  
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

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const themeClasses = {
      dark: 'bg-gray-900 text-white',
      light: 'bg-gray-100 text-gray-900',
  }

  return (
    <div className={`min-h-screen ${themeClasses[theme]} transition-colors duration-300 font-sans`}>
      <header className="p-4 shadow-md bg-gray-800/50 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-cyan-400">Visualizador de Teoría Musical</h1>
         <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition">
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>
      <main className="p-4 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <RootNoteSelector notes={notes} selectedRoot={selectedRoot} onRootChange={handleRootChange} theme={theme} />
                <ScaleSelector scales={Object.values(SCALES)} selectedScale={selectedScaleName} onScaleChange={handleScaleChange} theme={theme} />
                <Legend selectedScale={selectedScale} theme={theme} />
            </div>
            <div className="lg:col-span-2">
                <Fretboard
                    selectedRoot={selectedRoot}
                    selectedScale={selectedScale}
                    highlightedChord={highlightedChord}
                    inversion={inversion}
                    chordDisplayMode={chordDisplayMode}
                    voicingMask={voicingMask}
                    cagedPositions={cagedPositions}
                    isCagedActive={isCagedActive}
                    selectedCagedShapeIndex={selectedCagedShapeIndex}
                    comparisonData={comparisonData}
                    theme={theme}
                />
            </div>
        </div>
        
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
            setVoicingMask={setVoicingMask}
            theme={theme}
        />
        
        <CircleOfFifths 
            theme={theme}
            currentRoot={selectedRoot}
            currentScaleName={selectedScaleName}
            onKeyChange={handleKeyFromCircle}
            onChordSelect={handleSetHighlightedChord}
        />

        <CagedSelector 
            theme={theme}
            isActive={isCagedActive}
            onToggle={toggleCaged}
            selectedShapeIndex={selectedCagedShapeIndex}
            onShapeSelect={handleShapeSelect}
        />
        
        <ScaleComparator
            theme={theme}
            rootNote={selectedRoot}
            isComparing={isComparing}
            onComparisonToggle={setIsComparing}
            comparisonScales={comparisonScales}
            onScalesChange={setComparisonScales}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PracticeTracker theme={theme} />
            <MusicQuiz theme={theme} />
        </div>

      </main>
    </div>
  );
}

export default App;
