import React, { useState } from 'react';
import { Fretboard } from './components/Fretboard';
import { RootNoteSelector } from './components/RootNoteSelector';
import { ScaleSelector } from './components/ScaleSelector';
import { Legend } from './components/Legend';
import { NOTES, SCALES } from './constants';

const App: React.FC = () => {
  const [rootNote, setRootNote] = useState<string>('C');
  const [scale, setScale] = useState<keyof typeof SCALES>('Jónico (Mayor)');

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyan-400 tracking-tight">
            Mástil Interactivo de Guitarra
          </h1>
          <p className="text-md sm:text-lg text-gray-400 mt-2">
            Selecciona una tónica y una escala para visualizar los intervalos en el mástil.
          </p>
        </header>

        <main>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <RootNoteSelector
              notes={NOTES}
              selectedRoot={rootNote}
              onRootChange={setRootNote}
            />
            <ScaleSelector
              scales={Object.values(SCALES)}
              selectedScale={scale}
              onScaleChange={setScale}
            />
          </div>
          
          <Legend selectedScale={SCALES[scale]} />

          <div className="mt-8">
            <Fretboard rootNote={rootNote} selectedScale={scale} />
          </div>
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Creado para explorar escalas, acordes y teoría musical de forma visual.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;