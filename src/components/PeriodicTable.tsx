import { EvaluationMethod } from '../types/evaluation';
import { ElementCard } from './ElementCard';

interface PeriodicTableProps {
  elements: EvaluationMethod[];
  onElementClick?: (method: EvaluationMethod) => void;
  filters?: {
    action: string;
    type: string;
    complexity: string;
    modality: string;
  };
}

export function PeriodicTable({ elements, onElementClick, filters }: PeriodicTableProps) {
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
          {elements.map((method, index) => {
            const isFaded = filters ? (
              (filters.action !== 'Todas' && method.formativeAction !== filters.action) ||
              (filters.type !== 'Todos' && method.evaluationType !== filters.type) ||
              (filters.complexity !== 'Todos' && method.complexityLevel !== filters.complexity) ||
              (filters.modality !== 'Todos' && method.modality !== filters.modality)
            ) : false;

            return (
              <ElementCard 
                key={`${method.id}-${index}`} 
                method={method} 
                onClick={onElementClick}
                isFaded={isFaded}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
