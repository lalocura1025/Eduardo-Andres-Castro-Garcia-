
import React, { useMemo, useState, useEffect } from 'react';
import { SCALES, ScaleName, Chord as ChordType, ChordDisplayMode, Theme, VOICING_MASKS, CHORD_FAMILIES } from '../constants';
import { getDiatonicChords, findVoicingPositions, VoicingNote, constructChord } from '../services/musicTheory';
import { playSpecificVoicing, playChordNotes } from '../services/audio';

interface DiatonicChordSelectorProps {
  rootNote: string;
  selectedScale: ScaleName;
  highlightedChord: ChordType | null;
  setHighlightedChord: (chord: ChordType | null) => void;
  onChordTypeChange: () => void;
  inversion: number;
  setInversion: (inversion: number) => void;
  chordDisplayMode: ChordDisplayMode;
  setChordDisplayMode: (mode: ChordDisplayMode) => void;
  voicingMask: number[] | null;
  setVoicingMask: (mask: number[] | null) => void;
  setExactVoicing: (notes: VoicingNote[] | null) => void;
  theme: Theme;
  // New prop to handle context switching from Explorer mode
  onChordAndScaleSelect?: (chord: ChordType, scale: ScaleName) => void;
}

const getRomanNumeral = (degree: number, quality: ChordType['quality']) => {
    const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    let numeral = numerals[degree];
    
    switch (quality) {
        case 'menor': return numeral.toLowerCase();
        case 'disminuido': return `${numeral.toLowerCase()}°`;
        case 'aumentado': return `${numeral}+`;
        case 'Maj7': return `${numeral}Δ7`;
        case 'm7': return `${numeral.toLowerCase()}m7`;
        case '7': return `${numeral}7`;
        case 'm7b5': return `${numeral.toLowerCase()}ø7`;
        case 'dim7': return `${numeral.toLowerCase()}°7`;
        default: return numeral;
    }
};

const getChordName = (chord: ChordType) => {
    const qualityMap: Record<string, string> = {
        'Mayor': '', 'menor': 'm', 'disminuido': 'dim', 'aumentado': 'aug',
        'Maj7': 'Maj7', 'm7': 'm7', '7': '7', 'm7b5': 'm7b5', 'dim7': 'dim7', 'aum7': 'aug7',
        'sus2': 'sus2', 'sus4': 'sus4', '6': '6', 'm6': 'm6', 'add9': 'add9', '7alt': '7alt'
    };
    return `${chord.root}${qualityMap[chord.quality] || ''}`;
}

export const DiatonicChordSelector: React.FC<DiatonicChordSelectorProps> = ({ 
    rootNote, selectedScale, highlightedChord, setHighlightedChord,
    onChordTypeChange, inversion, setInversion,
    chordDisplayMode, setChordDisplayMode, 
    voicingMask, setVoicingMask, setExactVoicing,
    theme, onChordAndScaleSelect
}) => {
  const [chordType, setChordType] = useState<'triads' | 'sevenths'>('triads');
  const [activeTab, setActiveTab] = useState<'diatonic' | 'explorer'>('diatonic');
  
  const scale = SCALES[selectedScale];

  const chords = useMemo(() => {
    return getDiatonicChords(rootNote, scale, chordType);
  }, [rootNote, scale, chordType]);
  
  // Logic to calculate and play specific voicing based on mask and inversion
  const processAndPlayChord = (chord: ChordType, inv: number, mask: number[] | null) => {
      if (mask) {
          const shapes = findVoicingPositions(chord, mask);
          
          if (shapes.length > 0) {
              const shapeIndex = inv % shapes.length;
              const selectedShape = shapes[shapeIndex];
              setExactVoicing(selectedShape);
              playSpecificVoicing(selectedShape);
          } else {
              setExactVoicing(null);
              playChordNotes(chord.notes);
          }
      } else {
          setExactVoicing(null);
          playChordNotes(chord.notes);
      }
  };

  useEffect(() => {
      if (highlightedChord && voicingMask) {
          processAndPlayChord(highlightedChord, inversion, voicingMask);
      }
  }, [inversion]);

  const handleChordClick = (chord: ChordType) => {
    // Toggle off if same
    if (highlightedChord?.root === chord.root && highlightedChord?.quality === chord.quality) {
      setHighlightedChord(null);
      setExactVoicing(null);
      setInversion(0);
    } else {
      setHighlightedChord(chord);
      setInversion(0);
      processAndPlayChord(chord, 0, voicingMask);
    }
  };
  
  // Special Handler for Explorer Mode
  const handleExplorerClick = (quality: ChordType['quality'], intervals: number[], suggestedScale: ScaleName) => {
      // 1. Construct chord
      const newChord = constructChord(rootNote, quality, intervals);
      
      // 2. Play and Visualize
      handleChordClick(newChord);
      
      // 3. Switch Scale Context if prop provided
      if (onChordAndScaleSelect) {
          onChordAndScaleSelect(newChord, suggestedScale);
      }
  };
  
  const handleChordTypeSwitch = (type: 'triads' | 'sevenths') => {
      if (chordType !== type) {
          setChordType(type);
          onChordTypeChange();
      }
  };

  const themeClasses = {
      dark: {
          bg: 'bg-gray-800',
          title: 'text-cyan-400',
          textMuted: 'text-gray-400',
          toggleBg: 'bg-gray-700',
          toggleText: 'text-gray-300',
          button: 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white focus:ring-gray-500',
          buttonSelected: 'bg-cyan-500 text-gray-900 shadow-md scale-105 focus:ring-cyan-400',
          ringOffset: 'focus:ring-offset-gray-800',
          border: 'border-gray-700',
          subHeader: 'text-cyan-300/80',
          tabActive: 'border-b-2 border-cyan-400 text-cyan-400',
          tabInactive: 'text-gray-400 hover:text-gray-200'
      },
      light: {
          bg: 'bg-white',
          title: 'text-cyan-600',
          textMuted: 'text-gray-500',
          toggleBg: 'bg-gray-200',
          toggleText: 'text-gray-500',
          button: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400',
          buttonSelected: 'bg-cyan-500 text-gray-900 shadow-md scale-105 focus:ring-cyan-400',
          ringOffset: 'focus:ring-offset-white',
          border: 'border-gray-200',
          subHeader: 'text-cyan-700/80',
          tabActive: 'border-b-2 border-cyan-600 text-cyan-600',
          tabInactive: 'text-gray-500 hover:text-gray-700'
      }
  }
  const currentTheme = themeClasses[theme];

  const voicingOptions = [
      { label: 'Full Mástil', mask: VOICING_MASKS.all },
      { label: 'Drop 2 (High)', mask: VOICING_MASKS.drop2_high },
      { label: 'Drop 2 (Mid)', mask: VOICING_MASKS.drop2_mid },
      { label: 'Drop 2 (Low)', mask: VOICING_MASKS.drop2_low },
  ];
  
  const inversionLabels = voicingMask 
    ? ['Pos 1', 'Pos 2', 'Pos 3', 'Pos 4', 'Pos 5']
    : (chordType === 'triads' ? ['Fund.', '1ra', '2da'] : ['Fund.', '1ra', '2da', '3ra']);

  return (
    <div className={`${currentTheme.bg} p-4 rounded-lg shadow-lg transition-colors duration-300 min-h-[300px]`}>
        
        {/* TABS HEADER */}
        <div className="flex items-center justify-between border-b border-gray-600/30 mb-4">
            <div className="flex gap-6">
                <button 
                    onClick={() => setActiveTab('diatonic')}
                    className={`pb-2 px-1 font-bold text-sm uppercase tracking-wide transition-colors ${activeTab === 'diatonic' ? currentTheme.tabActive : currentTheme.tabInactive}`}
                >
                    Escala Actual
                </button>
                <button 
                    onClick={() => setActiveTab('explorer')}
                    className={`pb-2 px-1 font-bold text-sm uppercase tracking-wide transition-colors ${activeTab === 'explorer' ? currentTheme.tabActive : currentTheme.tabInactive}`}
                >
                    Diccionario / Explorador
                </button>
            </div>
            
            {activeTab === 'diatonic' && (
                <div className={`flex items-center ${currentTheme.toggleBg} rounded-full p-0.5 scale-90`}>
                    <button 
                        onClick={() => handleChordTypeSwitch('triads')}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${chordType === 'triads' ? 'bg-cyan-500 text-gray-900' : currentTheme.toggleText}`}
                    >
                        Tríadas
                    </button>
                    <button 
                        onClick={() => handleChordTypeSwitch('sevenths')}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${chordType === 'sevenths' ? 'bg-cyan-500 text-gray-900' : currentTheme.toggleText}`}
                    >
                        Séptimas
                    </button>
                </div>
            )}
        </div>

        {/* CONTENT: DIATONIC MODE */}
        {activeTab === 'diatonic' && (
            <>
                {chords.length === 0 ? (
                    <p className={`text-center ${currentTheme.textMuted} py-8`}>La formación de acordes no es aplicable a esta escala.</p>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-4 text-center">
                        {chords.map((chord) => {
                            const isSelected = highlightedChord?.root === chord.root && highlightedChord?.quality === chord.quality;
                            return (
                            <button 
                                key={`${chord.root}-${chord.quality}`} 
                                onClick={() => handleChordClick(chord)}
                                className={`
                                    p-3 rounded-md flex flex-col items-center justify-center transition-all duration-200 ease-in-out transform focus:outline-none
                                    focus:ring-2 focus:ring-offset-2 ${currentTheme.ringOffset}
                                    ${isSelected ? currentTheme.buttonSelected : currentTheme.button}
                                `}
                            >
                                <div className="text-xl font-bold">{getRomanNumeral(chord.degree, chord.quality)}</div>
                                <div className="text-md text-sm mt-1">{getChordName(chord)}</div>
                            </button>
                            )
                        })}
                    </div>
                )}
            </>
        )}

        {/* CONTENT: EXPLORER MODE */}
        {activeTab === 'explorer' && (
            <div className="space-y-6">
                <p className={`text-sm ${currentTheme.textMuted} mb-2`}>
                    Selecciona una cualidad de acorde para <span className="text-cyan-500 font-bold">verlo</span> y <span className="text-cyan-500 font-bold">ajustar la escala</span> automáticamente para improvisar.
                    <br/><span className="text-xs opacity-70">Tónica actual: <strong>{rootNote}</strong></span>
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {CHORD_FAMILIES.map((family) => (
                        <div key={family.label} className="space-y-2">
                            <h4 className={`text-xs font-bold uppercase tracking-wider ${family.color}`}>{family.label}</h4>
                            <div className="flex flex-wrap gap-2">
                                {family.chords.map((def) => {
                                    const isSelected = highlightedChord?.root === rootNote && highlightedChord?.quality === def.quality;
                                    return (
                                        <button
                                            key={def.quality}
                                            onClick={() => handleExplorerClick(def.quality, def.intervals, def.suggestedScales[0])}
                                            className={`
                                                px-3 py-2 rounded text-sm font-bold transition-all hover:scale-105
                                                ${isSelected ? 'bg-cyan-500 text-gray-900 shadow-lg ring-2 ring-cyan-400' : currentTheme.button}
                                            `}
                                            title={`Escala sugerida: ${def.suggestedScales[0]}`}
                                        >
                                            {rootNote}{def.quality === 'Mayor' ? '' : (def.quality === 'menor' ? 'm' : def.quality)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      
      {/* CONTROLS: VOICING & INVERSION (Shared) */}
      {highlightedChord && (
          <div className={`mt-6 border-t ${currentTheme.border} pt-4 flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-top-2 duration-300`}>
              <div className="flex-1">
                   <h4 className={`text-xs uppercase tracking-wide font-bold ${currentTheme.subHeader} mb-2 text-center md:text-left`}>
                      Voicing (Cuerdas)
                  </h4>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      {voicingOptions.map((opt, idx) => {
                          const isActive = (opt.mask === null && voicingMask === null) || (opt.mask === voicingMask);
                          return (
                            <button 
                                key={idx}
                                onClick={() => setVoicingMask(opt.mask)}
                                className={`
                                    px-2 py-1.5 rounded-md text-xs font-medium transition-colors duration-200
                                    ${isActive ? 'bg-cyan-500 text-gray-900' : currentTheme.button}
                                `}
                            >
                                {opt.label}
                            </button>
                          )
                      })}
                  </div>
              </div>

              <div className="flex-1">
                  <h4 className={`text-xs uppercase tracking-wide font-bold ${currentTheme.subHeader} mb-2 text-center md:text-left`}>
                      {voicingMask ? 'Posición en Mástil' : 'Inversión Teórica'}
                  </h4>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      {inversionLabels.map((label, index) => (
                          <button 
                            key={index}
                            onClick={() => setInversion(index)}
                            className={`
                                px-2 py-1.5 rounded-md text-xs font-medium transition-colors duration-200
                                ${inversion === index ? 'bg-cyan-500 text-gray-900' : currentTheme.button}
                            `}
                          >
                              {label}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
