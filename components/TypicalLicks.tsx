
import React, { useMemo } from 'react';
import { Theme } from '../constants';

interface TypicalLicksProps {
    genre: string;
    theme: Theme;
}

interface Lick {
    title: string;
    description: string;
    tab: string;
}

const LICKS_DATABASE: Record<string, Lick[]> = {
    'vals-peruano': [
        {
            title: 'Floreo Ascendente (Am)',
            description: 'Adorno clásico de entrada. Ejecutar rápido.',
            tab: `e|--0-1-3-5-3-1-0--
B|--1-3-5----------`
        },
        {
            title: 'Bordón Descendente',
            description: 'Línea de bajo característica en 6ta cuerda.',
            tab: `E|--5-3-2-0--------
  (La-Sol-Fa#-Mi)`
        },
        {
            title: 'Cromatismo Criollo',
            description: 'Paso cromático hacia la quinta (E).',
            tab: `e|--5-6-5-3-1-0----
B|--------------3-1`
        }
    ],
    'gypsy-jazz': [
        {
            title: 'Chromatic Enclosure',
            description: 'Rodear la nota objetivo (La).',
            tab: `G|--6-8-9-10-------
  (C#-D#-E-F -> Target)`
        },
        {
            title: 'Diminished Sweep',
            description: 'Sobre E7 (G#dim7 arpeggio).',
            tab: `e|-----4-7-10------
B|---3-6-9---------
G|-4-7-------------`
        }
    ],
    'bolero': [
        {
            title: 'Bajo de Bolero',
            description: 'Patrón de bajo tónica-quinta.',
            tab: `A|--0--------------
E|--------0--------
  (1.... 3.4..)`
        },
        {
            title: 'Requinto Trill',
            description: 'Trino rápido característico.',
            tab: `e|--5h6p5-5h6p5----`
        }
    ],
    'tango': [
        {
            title: 'Marcato Rhythmic',
            description: 'Golpes secos (staccato) en 1 y 3.',
            tab: `X--x--X--x--
(Chak... ... Chak...)`
        },
        {
            title: 'Arrastre (Sio)',
            description: 'Slide descendente rápido.',
            tab: `E|--12\0-----------`
        }
    ],
    'blues': [
        {
            title: 'Call & Response',
            description: 'Frase típica de B.B. King.',
            tab: `e|-----8b10r8-5----
B|--8--------------`
        }
    ]
};

export const TypicalLicks: React.FC<TypicalLicksProps> = ({ genre, theme }) => {
    const themeClasses = {
        dark: {
            bg: 'bg-gray-800/50',
            border: 'border-gray-700',
            title: 'text-yellow-400',
            text: 'text-gray-300',
            tabBg: 'bg-gray-900',
            tabText: 'text-green-400'
        },
        light: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            title: 'text-yellow-700',
            text: 'text-gray-700',
            tabBg: 'bg-white',
            tabText: 'text-gray-800'
        }
    };
    const currentTheme = themeClasses[theme];

    const licks = useMemo(() => {
        // Fallback for genres like 'gypsy-jazz' that might be passed differently
        const key = Object.keys(LICKS_DATABASE).find(k => genre.includes(k)) || 'gypsy-jazz';
        return LICKS_DATABASE[key] || [];
    }, [genre]);

    if (licks.length === 0) return null;

    return (
        <div className={`p-4 rounded-xl border ${currentTheme.bg} ${currentTheme.border}`}>
            <h3 className={`font-bold uppercase tracking-widest text-xs mb-3 ${currentTheme.title}`}>
                Licks y Punteos Típicos
            </h3>
            <div className="space-y-4">
                {licks.map((lick, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                        <div className="flex justify-between items-baseline">
                            <span className={`font-bold text-sm ${currentTheme.text}`}>{lick.title}</span>
                        </div>
                        <p className={`text-xs italic opacity-80 ${currentTheme.text} mb-1`}>{lick.description}</p>
                        <pre className={`p-2 rounded font-mono text-xs overflow-x-auto ${currentTheme.tabBg} ${currentTheme.tabText}`}>
                            {lick.tab}
                        </pre>
                    </div>
                ))}
            </div>
        </div>
    );
};
