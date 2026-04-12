import { EvaluationMethod } from '../types/evaluation';
import { ElementCard } from './ElementCard';

interface PeriodicTableProps {
  elements: EvaluationMethod[];
  onElementClick?: (method: EvaluationMethod) => void;
}

export function PeriodicTable({ elements, onElementClick }: PeriodicTableProps) {
  return (
    <div className="w-full overflow-x-auto pb-8">
      <div className="min-w-[1000px] p-4">
        {/* 
          CSS Grid de 14 columnas. 
          Usamos gap-2 para la separación entre elementos.
          grid-rows-7 asegura que tengamos las 7 filas estándar de una tabla periódica.
        */}
        <div 
          className="grid gap-2 sm:gap-3"
          style={{ 
            gridTemplateColumns: 'repeat(14, minmax(0, 1fr))',
            gridTemplateRows: 'repeat(7, minmax(0, 1fr))'
          }}
        >
          {elements.map((method, index) => (
            <ElementCard 
              key={`${method.id}-${index}`} 
              method={method} 
              onClick={onElementClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
