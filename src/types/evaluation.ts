export type EvaluationType = 
  | 'Autoevaluación'
  | 'Heteroevaluación'
  | 'Coevaluación';

export type ComplexityLevel = 'Básico' | 'Intermedio' | 'Avanzado';

export type FormativeAction = 
  | 'Analizar'
  | 'Aplicar'
  | 'Conocer'
  | 'Dialogar'
  | 'Evaluar'
  | 'Expresar'
  | 'Generar'
  | 'Sintetizar';

export type Modality = 'Escritura' | 'Oralidad' | 'Práctica';

export interface EvaluationMethod {
  id: string;
  /** Número del elemento que aparece en el círculo superior */
  atomicNumber: number;
  symbol: string;
  name: string;
  evaluationType: EvaluationType;
  complexityLevel: ComplexityLevel;
  formativeAction: FormativeAction;
  modality: Modality;
  icon: string;
  description: string;
  youtubeUrl?: string;
  /**
   * Posición en el eje X de la cuadrícula (Columnas 1 al 14)
   * Inspirado en los grupos de la tabla periódica química.
   */
  gridX: number;
  /**
   * Posición en el eje Y de la cuadrícula (Filas 1 al 7)
   * Inspirado en los períodos de la tabla periódica química.
   */
  gridY: number;
}
