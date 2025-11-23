
import React, { useState, useMemo } from 'react';
import { VOICING_LIBRARY, Genre, VoicingData } from '../data/voicings';
import { Theme, NOTES, STANDARD_TUNING } from '../constants';
import { getNoteOnFret, VoicingNote } from '../services/musicTheory';
import { playSpecificVoicing } from '../services/audio';

interface VoicingLibraryProps {
    theme: Theme;
    onSelectVoicing: (voicing: VoicingNote[]) => void;
}

const GENRES: { id: Genre; label: string; icon: string }[] = [
    { id: 'gypsy-jazz', label: 'Gypsy Jazz', icon: '🎻' },
    { id: 'vals-peruano', label: 'Vals Peruano', icon: '🇵🇪' },
    { id: 'bolero', label: 'Bolero', icon: '🌹' },
    { id: 'tango', label: 'Tango', icon: '💃' },
];

export const VoicingLibrary: React.FC<VoicingLibraryProps> = ({ theme, onSelectVoicing }) => {
    const [selectedGenre, setSelectedGenre] = useState<Genre>('gypsy-jazz');
    const [selectedChordFilter, setSelectedChordFilter] = useState<string | null>(null);

    const themeClasses = {
        dark: {
            bg: 'bg-gray-800',
            cardBg: 'bg-gray-700',
            cardHover: 'hover:bg-gray-600',
            text: 'text-gray-200',
            textMuted: 'text-gray-400',
            accent: 'text-cyan-400',
            border: 'border-gray-600',
            buttonPrimary: 'bg-cyan-600 hover:bg-cyan-500 text-white',
            buttonSecondary: 'bg-gray-600 hover:bg-gray-500 text-gray-200',
            tabActive: 'bg-cyan-500/20 text-cyan-400 border-cyan-500',
            tabInactive: 'text-gray-400 border-transparent hover:text-gray-200',
            tag: 'bg-gray-900 text-gray-400'
        },
        light: {
            bg: 'bg-white',
            cardBg: 'bg-gray-50',
            cardHover: 'hover:bg-gray-100',
            text: 'text-gray-800',
            textMuted: 'text-gray-500',
            accent: 'text-cyan-600',
            border: 'border-gray-200',
            buttonPrimary: 'bg-cyan-500 hover:bg-cyan-400 text-white',
            buttonSecondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
            tabActive: 'bg-cyan-50 text-cyan-600 border-cyan-600',
            tabInactive: 'text-gray-500 border-transparent hover:text-gray-700',
            tag: 'bg-gray-200 text-gray-600'
        }
    };
    const currentTheme = themeClasses[theme];

    // Filter voicings
    const filteredVoicings = useMemo(() => {
        return VOICING_LIBRARY.filter(v => v.genre === selectedGenre);
    }, [selectedGenre]);

    // Get unique chord names for the filter tabs
    const availableChords = useMemo(() => {
        const chords = new Set(filteredVoicings.map(v => v.chordName));
        return Array.from(chords);
    }, [filteredVoicings]);

    // Final list to display
    const displayVoicings = useMemo(() => {
        if (!selectedChordFilter) return filteredVoicings;
        return filteredVoicings.filter(v => v.chordName === selectedChordFilter);
    }, [filteredVoicings, selectedChordFilter]);

    // Convert fret array [-1, 5, 7...] to VoicingNote[]
    const convertToVoicingNotes = (frets: number[]): VoicingNote[] => {
        // frets array is typically Low E (index 0 in array?) to High E?
        // Let's assume the definition in data/voicings.ts is: [Low E, A, D, G, B, High E]
        // But our app uses String 0 = High E.
        // So we need to map correctly.
        // In data/voicings.ts I wrote comments like "Low E to High E".
        // Let's verify standard notation convention. usually strings 654321.
        
        const voicingNotes: VoicingNote[] = [];
        
        // Iterate standard strings 6 to 1 (indices 0 to 5 in the frets array)
        frets.forEach((fret, i) => {
            // map array index i (0=Low E) to app string index (5=Low E, 0=High E)
            // Array: [Low E(0), A(1), D(2), G(3), B(4), High E(5)]
            // App String Index: Low E is 5. High E is 0.
            const appStringIndex = 5 - i; 

            if (fret >= 0) {
                 // Calculate note name
                 const tuningNote = STANDARD_TUNING[i]; // standard tuning array is ['E','A','D','G','B','E'] (Low to High? No constants.ts says High to Low?)
                 // constants.ts: STANDARD_TUNING = ['E', 'A', 'D', 'G', 'B', 'E'] (Wait, usually E A D G B e is Low to High)
                 // Let's check constants.ts... 
                 // It says: export const STANDARD_TUNING = ['E', 'A', 'D', 'G', 'B', 'E'] as const;
                 // And usages: tuningIndices = STANDARD_TUNING.slice().reverse()...
                 // Usually string 0 in code is top (High E).
                 
                 // Let's rely on `getNoteOnFret` which takes `stringNoteIndex`.
                 // Note: In `Fretboard.tsx`, stringIndex 0 is top.
                 // So `STANDARD_TUNING` in constants seems to be High to Low? or Low to High?
                 // Let's check `getNoteInfo`: `tuningIndices[stringIndex]`.
                 // If stringIndex 0 is High E, and typical tuning is E.
                 
                 // Let's assume the `frets` array in my data is [Low E, ... High E].
                 // And App String 5 is Low E.
                 
                 const openNoteStr = STANDARD_TUNING[5 - appStringIndex]; // This is getting confusing.
                 // Let's use `NOTES.indexOf` on the known tuning.
                 // Standard Tuning: E(Low), A, D, G, B, E(High)
                 // App String 5: Low E.
                 // App String 0: High E.
                 
                 // My Data `frets[0]` is Low E. -> App String 5.
                 
                 // Get open note for App String 5:
                 const openNoteIndex = [4, 9, 2, 7, 11, 4][5 - appStringIndex]; // E A D G B E indices roughly
                 // Better: use the helper logic.
                 
                 // Let's just use hardcoded standard tuning indices for calculation to be safe.
                 // E A D G B E -> [4, 9, 2, 7, 11, 4]
                 const tuning = [4, 9, 2, 7, 11, 4]; // Low E to High E
                 const stringOpenNote = tuning[i]; // i=0 is Low E
                 
                 const noteIndex = getNoteOnFret(stringOpenNote, fret);
                 const noteName = NOTES[noteIndex];
                 
                 voicingNotes.push({
                     string: appStringIndex,
                     fret: fret,
                     noteName: noteName,
                     interval: '' // Calculated elsewhere if needed
                 });
            }
        });
        
        return voicingNotes;
    };

    const handlePlay = (v: VoicingData) => {
        const notes = convertToVoicingNotes(v.frets);
        playSpecificVoicing(notes);
    };

    const handleVisualize = (v: VoicingData) => {
        const notes = convertToVoicingNotes(v.frets);
        playSpecificVoicing(notes);
        onSelectVoicing(notes);
    };

    return (
        <div className={`rounded-xl shadow-lg border ${currentTheme.border} ${currentTheme.bg} overflow-hidden`}>
            {/* HEADER */}
            <div className="p-4 border-b border-gray-600/20 bg-gradient-to-r from-gray-900 to-gray-800">
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-bold text-white tracking-tight">📚 Biblioteca de Voicings Profesionales</h2>
                    <span className="text-xs bg-cyan-500 text-gray-900 px-2 py-0.5 rounded font-bold uppercase">Beta</span>
                </div>
                
                {/* GENRE TABS */}
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {GENRES.map(g => (
                        <button
                            key={g.id}
                            onClick={() => { setSelectedGenre(g.id); setSelectedChordFilter(null); }}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap
                                ${selectedGenre === g.id ? 'bg-cyan-500 text-gray-900 shadow-md transform scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                            `}
                        >
                            <span>{g.icon}</span>
                            {g.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* CHORD FILTER */}
            <div className={`p-4 border-b ${currentTheme.border} ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold uppercase tracking-wider ${currentTheme.textMuted}`}>Filtrar Acorde:</span>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedChordFilter(null)}
                            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${!selectedChordFilter ? currentTheme.buttonPrimary : currentTheme.buttonSecondary}`}
                        >
                            Todos
                        </button>
                        {availableChords.map(c => (
                            <button
                                key={c}
                                onClick={() => setSelectedChordFilter(c)}
                                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${selectedChordFilter === c ? currentTheme.buttonPrimary : currentTheme.buttonSecondary}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* VOICING GRID */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                {displayVoicings.length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500 italic">
                        No hay voicings disponibles para esta categoría aún.
                    </div>
                )}
                
                {displayVoicings.map((voicing) => (
                    <div 
                        key={voicing.id} 
                        className={`
                            group relative rounded-lg p-4 border transition-all duration-300
                            ${currentTheme.cardBg} ${currentTheme.border} ${currentTheme.cardHover}
                            hover:shadow-xl hover:border-cyan-500/50
                        `}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className={`font-bold text-lg ${currentTheme.text} group-hover:text-cyan-500 transition-colors`}>
                                    {voicing.name}
                                </h3>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {voicing.tags.map(tag => (
                                        <span key={tag} className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${currentTheme.tag}`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className={`text-xs font-bold px-2 py-1 rounded ${voicing.difficulty === 'Básico' ? 'bg-green-500/20 text-green-500' : voicing.difficulty === 'Intermedio' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>
                                {voicing.difficulty}
                            </div>
                        </div>

                        <p className={`text-sm mb-4 ${currentTheme.textMuted} line-clamp-2`}>
                            {voicing.description}
                        </p>

                        <div className="flex gap-2 mt-auto">
                            <button
                                onClick={() => handleVisualize(voicing)}
                                className={`flex-1 py-2 rounded font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 ${currentTheme.buttonPrimary}`}
                            >
                                <span>👁️</span> Visualizar
                            </button>
                            <button
                                onClick={() => handlePlay(voicing)}
                                className={`px-3 rounded font-bold transition-colors ${currentTheme.buttonSecondary}`}
                                title="Solo Escuchar"
                            >
                                🔊
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
