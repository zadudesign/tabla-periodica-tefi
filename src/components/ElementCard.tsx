import * as LucideIcons from 'lucide-react';
import { EvaluationType, EvaluationMethod, FormativeAction } from '../types/evaluation';

interface ElementCardProps {
  method: EvaluationMethod;
  onClick?: (method: EvaluationMethod) => void;
  isFaded?: boolean;
}

// Diccionario de colores semánticos por ACCIÓN FORMATIVA (Modo Oscuro)
const actionColors: Record<FormativeAction, string> = {
  Analizar: 'bg-blue-950/50 border-blue-800/50 text-blue-400 hover:bg-blue-900/60 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]',
  Aplicar: 'bg-emerald-950/50 border-emerald-800/50 text-emerald-400 hover:bg-emerald-900/60 hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]',
  Conocer: 'bg-amber-950/50 border-amber-800/50 text-amber-400 hover:bg-amber-900/60 hover:border-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]',
  Dialogar: 'bg-orange-950/50 border-orange-800/50 text-orange-400 hover:bg-orange-900/60 hover:border-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.3)]',
  Evaluar: 'bg-red-950/50 border-red-800/50 text-red-400 hover:bg-red-900/60 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]',
  Expresar: 'bg-pink-950/50 border-pink-800/50 text-pink-400 hover:bg-pink-900/60 hover:border-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)]',
  Generar: 'bg-purple-950/50 border-purple-800/50 text-purple-400 hover:bg-purple-900/60 hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]',
  Sintetizar: 'bg-cyan-950/50 border-cyan-800/50 text-cyan-400 hover:bg-cyan-900/60 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]',
};

// Abreviaturas para el tipo de evaluación
const typeAbbreviations: Record<EvaluationType, string> = {
  Autoevaluación: 'AE',
  Heteroevaluación: 'HE',
  Coevaluación: 'CE',
};

export function ElementCard({ method, onClick, isFaded }: ElementCardProps) {
  // El color ahora depende de la Acción Formativa
  const colorClasses = actionColors[method.formativeAction] || 'bg-slate-800 border-slate-700 text-slate-300';
  
  // Obtenemos el componente de icono dinámicamente desde lucide-react
  const IconComponent = (LucideIcons as any)[method.icon] || LucideIcons.HelpCircle;

  // Renderizador de nivel de complejidad (barra segmentada)
  const renderComplexityBar = () => {
    const levels = { Básico: 1, Intermedio: 2, Avanzado: 3 };
    const activeSegments = levels[method.complexityLevel] || 1;
    
    return (
      <div className="flex gap-[2px] w-full h-1.5 sm:h-2" title={`Complejidad: ${method.complexityLevel}`}>
        {/* Segmento 1 (Izquierda, borde redondeado) */}
        <div className={`flex-1 rounded-l-full border border-current ${activeSegments >= 1 ? 'bg-current' : 'bg-transparent'}`} />
        {/* Segmento 2 (Centro, cuadrado) */}
        <div className={`flex-1 border border-current border-x-0 ${activeSegments >= 2 ? 'bg-current' : 'bg-transparent'}`} />
        {/* Segmento 3 (Derecha, borde redondeado) */}
        <div className={`flex-1 rounded-r-full border border-current ${activeSegments >= 3 ? 'bg-current' : 'bg-transparent'}`} />
      </div>
    );
  };

  return (
    <button
      onClick={() => onClick?.(method)}
      className={`
        relative flex flex-col p-1.5 sm:p-2 
        border-2 rounded-xl transition-all duration-300 ease-out
        aspect-[5/6] w-full cursor-pointer group
        ${colorClasses}
        ${isFaded ? 'opacity-20 grayscale hover:opacity-40' : ''}
      `}
      style={{
        gridColumn: method.gridX,
        gridRow: method.gridY,
      }}
      title={`${method.name} - ${method.evaluationType}`}
    >
      {/* Fila 1: Número, Tipo e Icono */}
      <div className="grid grid-cols-3 items-center w-full px-0.5 pt-0.5">
        
        {/* Columna 1 (Izquierda): ID en círculo */}
        <div className="flex justify-start">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-current flex items-center justify-center">
            <span className="text-[0.6rem] sm:text-[0.7rem] font-bold text-slate-950 leading-none">
              {method.atomicNumber}
            </span>
          </div>
        </div>

        {/* Columna 2 (Centro): Abreviatura del Tipo */}
        <div className="flex justify-center">
          <span className="text-[0.65rem] sm:text-xs font-bold">
            {typeAbbreviations[method.evaluationType]}
          </span>
        </div>

        {/* Columna 3 (Derecha): Icono */}
        <div className="flex justify-end">
          <IconComponent 
            className="w-5 h-5 sm:w-6 sm:h-6 opacity-80 group-hover:opacity-100 transition-all duration-300" 
            strokeWidth={2} 
          />
        </div>
      </div>
      
      {/* Fila 2: Símbolo grande (Centro) */}
      <div className="flex-1 w-full flex items-center justify-center mt-1">
        <span className="text-3xl sm:text-4xl font-black tracking-tighter leading-none opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
          {method.symbol}
        </span>
      </div>

      {/* Fila 3: Barra de complejidad (Abajo) */}
      <div className="w-full px-0.5 mt-1 sm:mt-1.5 pb-0.5">
        {renderComplexityBar()}
      </div>
    </button>
  );
}
