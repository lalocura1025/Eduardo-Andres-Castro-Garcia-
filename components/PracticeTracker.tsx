
import React from 'react';
import { Theme } from '../constants';

interface PracticeTrackerProps {
    theme: Theme;
}

export const PracticeTracker: React.FC<PracticeTrackerProps> = ({ theme }) => {
    const themeClasses = {
        dark: {
            bg: 'bg-gray-800',
            title: 'text-green-400',
            text: 'text-gray-300',
        },
        light: {
            bg: 'bg-white',
            title: 'text-green-600',
            text: 'text-gray-700',
        }
    }
    const currentTheme = themeClasses[theme];

    return (
        <div className={`${currentTheme.bg} p-4 rounded-lg shadow-lg transition-colors duration-300`}>
            <h3 className={`text-lg font-semibold text-center ${currentTheme.title} mb-3`}>Monitor de Práctica</h3>
            <p className={`text-center ${currentTheme.text}`}>Esta función estará disponible próximamente.</p>
        </div>
    );
};
