import { ScaleName } from '../constants';

export interface LessonEvent {
  startTime: number;    // Milisegundos de inicio
  endTime: number;      // Milisegundos de fin
  root: string;         // La nota raíz que se debe seleccionar
  scaleName: ScaleName; // La escala que se debe mostrar
  description: string;  // Mensaje para el alumno
}

const BAR_MS = 2500; // 2.5 segundos por compás para dar tiempo a pensar

export const MINOR_SWING_LESSON: LessonEvent[] = [
  // --- Introducción / A (Tónica) ---
  { 
    startTime: 0, endTime: BAR_MS * 2, 
    root: 'A', scaleName: 'Menor Arm. & Mel. (Fusión)', 
    description: "Compases 1-2: Am6. Usa la Escala Menor Arm. & Mel. (Fusión) de A." 
  },
  // --- Subdominante (Dm) ---
  { 
    startTime: BAR_MS * 2, endTime: BAR_MS * 4, 
    root: 'D', scaleName: 'Dórico', 
    description: "Compases 3-4: Dm6. Cambia a D Dórico. Céntrate en las notas D y F." 
  },
  // --- Dominante (E7) ---
  { 
    startTime: BAR_MS * 4, endTime: BAR_MS * 5, 
    root: 'E', scaleName: 'Alterada (Super Locria)', 
    description: "Compás 5: E7. ¡Tensión! Usa la escala Alterada de E." 
  },
  // --- Resolución breve (Am) ---
  { 
    startTime: BAR_MS * 5, endTime: BAR_MS * 6, 
    root: 'A', scaleName: 'Menor Arm. & Mel. (Fusión)', 
    description: "Compás 6: Breve descanso en Am." 
  },
  // --- Dm rápido ---
  { 
    startTime: BAR_MS * 6, endTime: BAR_MS * 7, 
    root: 'D', scaleName: 'Dórico', 
    description: "Compás 7: Toque rápido a Dm." 
  },
  // --- Am rápido ---
  { 
    startTime: BAR_MS * 7, endTime: BAR_MS * 8, 
    root: 'A', scaleName: 'Menor Arm. & Mel. (Fusión)', 
    description: "Compás 8: Vuelta a Am." 
  },
  // --- Turnaround (E7) ---
  { 
    startTime: BAR_MS * 8, endTime: BAR_MS * 10, 
    root: 'E', scaleName: 'Menor armónica', // Truco: E sobre escala A menor armónica = E Mixolidio b9 b13 (Frigio Dominante context)
    description: "Turnaround (Final): Prepara la vuelta. Usa E Dominante o A Menor Armónica." 
  }
];
