
export type Genre = 'gypsy-jazz' | 'vals-peruano' | 'bolero' | 'tango' | 'swing';

export interface VoicingData {
    id: string;
    name: string;
    chordName: string; 
    genre: Genre;
    tags: string[]; 
    frets: number[]; // 6 numbers: 0=open, -1=mute. Low E (index 0) to High E (index 5)
                     // NOTE: Standard notation: E A D G B e
    description: string;
    difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
}

export const VOICING_LIBRARY: VoicingData[] = [
    // --- GYPSY JAZZ (MINOR SWING) ---
    {
        id: 'am6-shell',
        name: 'Am6 Shell Voicing',
        chordName: 'Am6',
        genre: 'gypsy-jazz',
        tags: ['Shell', 'Rítmico'],
        frets: [-1, 12, 10, 11, -1, -1], 
        description: "El voicing más clásico de Django. Percusivo y directo.",
        difficulty: 'Básico'
    },
    {
        id: 'am6-drop2',
        name: 'Am6 Drop 2',
        chordName: 'Am6',
        genre: 'gypsy-jazz',
        tags: ['Drop 2', 'Melódico'],
        frets: [-1, 12, 14, 11, 13, -1],
        description: "Sonido más abierto y moderno.",
        difficulty: 'Avanzado'
    },
    {
        id: 'dm6-shell',
        name: 'Dm6 Shell Voicing',
        chordName: 'Dm6',
        genre: 'gypsy-jazz',
        tags: ['Shell'],
        frets: [-1, 5, 3, 4, -1, -1],
        description: "Forma espejo del Am6 en cuerda 5.",
        difficulty: 'Básico'
    },
    {
        id: 'e7-b9',
        name: 'E7b9 (Dim Shape)',
        chordName: 'E7',
        genre: 'gypsy-jazz',
        tags: ['Dominante'],
        frets: [-1, 7, 6, 7, 6, -1],
        description: "Usamos la forma de G#dim7. Clásico de Django.",
        difficulty: 'Intermedio'
    },

    // --- VALS PERUANO ---
    {
        id: 'am-vals-open',
        name: 'Am Vals (Abierto)',
        chordName: 'Am',
        genre: 'vals-peruano',
        tags: ['Básico', 'Abierto'],
        frets: [-1, 0, 2, 2, 1, 0],
        description: "La posición fundamental. Ideal para rasgueos llenos.",
        difficulty: 'Básico'
    },
    {
        id: 'am-vals-inv',
        name: 'Am/C (Bajo en Do)',
        chordName: 'Am',
        genre: 'vals-peruano',
        tags: ['Inversión', 'Bajo Alternante'],
        frets: [-1, 3, 2, 2, 1, 0],
        description: "Fundamental para el bajo alternante (La... Do... La...)",
        difficulty: 'Intermedio'
    },
    {
        id: 'e7-vals-alt',
        name: 'E7 Bajo Alternante',
        chordName: 'E7',
        genre: 'vals-peruano',
        tags: ['Dominante', 'Ritmo'],
        frets: [0, 2, 2, 1, 3, 0],
        description: "Dedos listos para alternar bajos entre 6ta y 5ta cuerda.",
        difficulty: 'Básico'
    },
    {
        id: 'dm-vals-high',
        name: 'Dm Posición V',
        chordName: 'Dm',
        genre: 'vals-peruano',
        tags: ['Agudo'],
        frets: [-1, 5, 7, 7, 6, 5],
        description: "Cejilla en traste 5. Sonido percusivo para vals.",
        difficulty: 'Intermedio'
    },
    {
        id: 'g7-vals',
        name: 'G7 Abierto',
        chordName: 'G7',
        genre: 'vals-peruano',
        tags: ['Dominante'],
        frets: [3, 2, 0, 0, 0, 1],
        description: "Clásico G7. Enfatiza el bajo en Sol (traste 3).",
        difficulty: 'Básico'
    },
    {
        id: 'c-vals-bass',
        name: 'C (Bajo en Sol)',
        chordName: 'C',
        genre: 'vals-peruano',
        tags: ['Inversión'],
        frets: [3, 3, 2, 0, 1, 0],
        description: "C con bajo en G. Le da peso al acorde.",
        difficulty: 'Intermedio'
    },
    {
        id: 'em-g-vals',
        name: 'Em/G (Inversión)',
        chordName: 'Em',
        genre: 'vals-peruano',
        tags: ['Característico'],
        frets: [3, 2, 2, 0, 0, 0],
        description: "Muy característico del vals peruano. Bajo en Sol con Em.",
        difficulty: 'Intermedio'
    },

    // --- BOLERO ---
    {
        id: 'dm-bolero',
        name: 'Dm Bolero (Cejilla)',
        chordName: 'Dm',
        genre: 'bolero',
        tags: ['Cejilla'],
        frets: [-1, 5, 7, 7, 6, 5],
        description: "Cejilla sólida para arpegios de bolero.",
        difficulty: 'Intermedio'
    },
    {
        id: 'a7-bolero',
        name: 'A7b9 (Tenso)',
        chordName: 'A7',
        genre: 'bolero',
        tags: ['Tensión'],
        frets: [-1, 0, 2, 3, 2, 3],
        description: "A7 con novena bemol. Muy dramático.",
        difficulty: 'Avanzado'
    },
    
    // --- TANGO ---
    {
        id: 'gm-tango',
        name: 'Gm Marcato',
        chordName: 'Gm',
        genre: 'tango',
        tags: ['Staccato'],
        frets: [3, 5, 5, 3, 3, 3],
        description: "Cejilla completa. Usar para golpes secos (marcato).",
        difficulty: 'Intermedio'
    },
    {
        id: 'd7-tango',
        name: 'D7/F#',
        chordName: 'D7',
        genre: 'tango',
        tags: ['Inversión'],
        frets: [2, 0, 0, 2, 1, 2],
        description: "Bajo en Fa#. Conducción de bajos típica de Piazzolla.",
        difficulty: 'Intermedio'
    }
];
