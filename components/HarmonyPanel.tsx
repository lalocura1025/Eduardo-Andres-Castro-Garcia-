
import React, { useMemo } from 'react';
import { Chord, Theme } from '../constants';

interface HarmonyPanelProps {
  chord: Chord | null;
  theme: Theme;
}

const CHORD_DESCRIPTIONS: Record<string, { sound: string, usage: string, sub: string }> = {
    'Mayor': { 
        sound: "Brillante, estable, feliz.", 
        usage: "Grado I (Tónica), IV (Subdominante) o V (Dominante). Base de la música occidental.", 
        sub: "Maj7, 6, add9" 
    },
    'menor': { 
        sound: "Triste, melancólico, serio.", 
        usage: "Grado ii, iii, vi. Tónica en tonalidades menores.", 
        sub: "m7, m6, m9" 
    },
    'Maj7': { 
        sound: "Jazzy, soñador, sofisticado, nostálgico.", 
        usage: "Grado I o IV en Jazz/Lo-Fi. Evita usarlo como V (demasiado estable).", 
        sub: "6/9, Lidio (si es IV)" 
    },
    'm7': { 
        sound: "Suave, moderno, 'mellow'. Menos triste que la tríada menor.", 
        usage: "El bloque de construcción del Jazz (ii).", 
        sub: "m9, m11" 
    },
    '7': { 
        sound: "Tenso, expectante, 'bluesy'. Pide resolver.", 
        usage: "Grado V (Dominante). Empuja hacia la tónica (I). Fundamental en Blues.", 
        sub: "9, 13, 7alt, Mixolidio" 
    },
    'm7b5': { 
        sound: "Oscuro, misterioso, inestable.", 
        usage: "Grado ii en tonalidades menores (ii-V-i). Grado vii en mayores.", 
        sub: "Locrio, Dim7" 
    },
    'dim7': { 
        sound: "Dramático, terrorífico, muy inestable.", 
        usage: "Acorde de paso cromático. Puede resolver a 4 lugares distintos.", 
        sub: "Cualquier inversión de sí mismo (simétrico)" 
    },
    'm6': { 
        sound: "Dórico, misterioso (estilo James Bond/Gypsy).", 
        usage: "Tónica en Gypsy Jazz. Subdominante en escalas menores.", 
        sub: "m7, m6/9" 
    },
    '6': {
        sound: "Dulce, estable, 'antiguo' (Swing/Beatles).",
        usage: "Alternativa a Maj7 cuando la melodía choca con la 7ma mayor.",
        sub: "Maj7"
    }
};

export const HarmonyPanel: React.FC<HarmonyPanelProps> = ({ chord, theme }) => {
    const themeClasses = {
        dark: {
            bg: 'bg-indigo-900/40',
            border: 'border-indigo-500/30',
            title: 'text-indigo-300',
            text: 'text-gray-300',
            accent: 'text-white'
        },
        light: {
            bg: 'bg-indigo-50',
            border: 'border-indigo-200',
            title: 'text-indigo-700',
            text: 'text-gray-700',
            accent: 'text-black'
        }
    };
    const currentTheme = themeClasses[theme];

    if (!chord) return null;

    const info = CHORD_DESCRIPTIONS[chord.quality] || { 
        sound: "Sonido complejo.", 
        usage: "Depende del contexto.", 
        sub: "-" 
    };

    return (
        <div className={`p-4 rounded-xl border ${currentTheme.bg} ${currentTheme.border} shadow-lg space-y-3 animate-in fade-in slide-in-from-bottom-2`}>
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                <h3 className={`font-bold uppercase tracking-widest text-xs ${currentTheme.title}`}>
                    Entender la Armonía
                </h3>
                <span className={`font-black text-xl ${currentTheme.accent}`}>
                    {chord.root}{chord.quality === 'Mayor' ? '' : (chord.quality === 'menor' ? 'm' : chord.quality)}
                </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                    <span className="block text-xs font-bold opacity-60 uppercase mb-1">Carácter</span>
                    <p className={`${currentTheme.text} italic`}>"{info.sound}"</p>
                </div>
                <div>
                    <span className="block text-xs font-bold opacity-60 uppercase mb-1">Función Típica</span>
                    <p className={currentTheme.text}>{info.usage}</p>
                </div>
                <div>
                    <span className="block text-xs font-bold opacity-60 uppercase mb-1">Sustituciones</span>
                    <p className={currentTheme.text}>{info.sub}</p>
                </div>
            </div>

            <div className="pt-2">
                <span className="block text-xs font-bold opacity-60 uppercase mb-1">Fórmula (Notas)</span>
                <div className="flex gap-2">
                    {chord.notes.map((note, idx) => (
                        <span key={idx} className="bg-indigo-500 text-white px-2 py-1 rounded text-xs font-bold shadow-sm">
                            {note}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
