import React from 'react';
import { CIRCLE_OF_FIFTHS_KEYS, ScaleName, Theme } from '../constants';

interface CircleOfFifthsProps {
  currentRoot: string;
  currentScaleName: ScaleName;
  onKeyChange: (root: string, scale: ScaleName) => void;
  theme: Theme;
}

export const CircleOfFifths: React.FC<CircleOfFifthsProps> = React.memo(({ currentRoot, currentScaleName, onKeyChange, theme }) => {
  const themeClasses = {
    dark: {
      bg: 'bg-gray-800',
      title: 'text-cyan-400',
      circleBg: 'bg-gray-700/50',
      keyBg: 'bg-gray-700',
      keyText: 'text-gray-300',
      majorKeySelected: 'bg-cyan-500 text-gray-900 ring-cyan-400',
      minorKeySelected: 'bg-purple-500 text-white ring-purple-400',
      keySignatureText: 'text-gray-400',
    },
    light: {
      bg: 'bg-white',
      title: 'text-cyan-600',
      circleBg: 'bg-gray-200/50',
      keyBg: 'bg-gray-200',
      keyText: 'text-gray-700',
      majorKeySelected: 'bg-cyan-500 text-gray-900 ring-cyan-400',
      minorKeySelected: 'bg-purple-500 text-white ring-purple-400',
      keySignatureText: 'text-gray-500',
    }
  };
  const currentTheme = themeClasses[theme];

  const CIRCLE_RADIUS = 160; // in pixels
  const KEY_ITEM_WIDTH = 90; // in pixels

  return (
    <div className={`${currentTheme.bg} p-4 rounded-lg shadow-lg transition-colors duration-300`}>
      <h3 className={`text-lg font-semibold text-center ${currentTheme.title} mb-4`}>Círculo de Quintas Interactivo</h3>
      <div className="flex justify-center items-center py-8">
        <div 
          className="relative rounded-full"
          style={{ width: `${CIRCLE_RADIUS * 2 + KEY_ITEM_WIDTH}px`, height: `${CIRCLE_RADIUS * 2 + KEY_ITEM_WIDTH}px` }}
        >
           <div className={`absolute inset-0 border-4 border-dashed rounded-full ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}></div>
          {CIRCLE_OF_FIFTHS_KEYS.map(key => {
            const isMajorSelected = currentRoot === key.major && currentScaleName === 'Jónico (Mayor)';
            const isMinorSelected = currentRoot === key.minor && currentScaleName === 'Eólico (menor natural)';
            
            const keyWrapperStyle: React.CSSProperties = {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `rotate(${key.angle}deg) translate(${CIRCLE_RADIUS}px) rotate(-${key.angle}deg)`,
              width: `${KEY_ITEM_WIDTH}px`,
              marginLeft: `-${KEY_ITEM_WIDTH / 2}px`,
            };

            return (
              <div key={key.major} style={keyWrapperStyle}>
                <div className={`${currentTheme.keyBg} rounded-lg p-2 flex flex-col items-center shadow-md`}>
                  {/* Major Key */}
                  <button 
                    onClick={() => onKeyChange(key.major, 'Jónico (Mayor)')}
                    className={`
                      w-16 h-10 rounded-md text-xl font-bold transition-all duration-200 
                      focus:outline-none focus:ring-2 focus:ring-offset-2 
                      ${isMajorSelected 
                        ? currentTheme.majorKeySelected 
                        : `${currentTheme.keyText} hover:bg-cyan-500/50`}
                      ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}`
                    }
                  >
                    {key.major}
                  </button>

                  {/* Key Signature */}
                  <div className={`text-sm font-mono my-1 ${currentTheme.keySignatureText}`}>{key.sig}</div>

                  {/* Minor Key */}
                  <button 
                    onClick={() => onKeyChange(key.minor, 'Eólico (menor natural)')}
                    className={`
                      w-16 h-10 rounded-md text-lg font-bold transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                      ${isMinorSelected 
                        ? currentTheme.minorKeySelected 
                        : `${currentTheme.keyText} hover:bg-purple-500/50`}
                       ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}`
                    }
                  >
                    {key.minor}m
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
