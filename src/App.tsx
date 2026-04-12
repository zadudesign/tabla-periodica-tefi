import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { PeriodicTable } from './components/PeriodicTable';
import { ElementFormModal } from './components/ElementFormModal';
import { ElementDetailsModal } from './components/ElementDetailsModal';
import { EvaluationMethod } from './types/evaluation';
import { EVALUATION_METHODS as INITIAL_METHODS } from './constants/methods';

export default function App() {
  // Estado para almacenar los elementos. Inicializamos desde localStorage si existe, o usamos los constantes.
  const [elements, setElements] = useState<EvaluationMethod[]>(() => {
    const saved = localStorage.getItem('periodic-table-elements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing local storage data', e);
        return INITIAL_METHODS;
      }
    }
    return INITIAL_METHODS;
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<EvaluationMethod | null>(null);

  // Guardar en localStorage cada vez que los elementos cambien
  useEffect(() => {
    localStorage.setItem('periodic-table-elements', JSON.stringify(elements));
  }, [elements]);

  const handleElementClick = (method: EvaluationMethod) => {
    setSelectedElement(method);
  };

  const handleSaveElement = (newElement: EvaluationMethod) => {
    setElements(prev => {
      // Si ya existe un elemento en esa coordenada, podríamos reemplazarlo o simplemente agregarlo.
      // Por ahora, eliminamos el que estaba en esa posición y ponemos el nuevo.
      const filtered = prev.filter(e => !(e.gridX === newElement.gridX && e.gridY === newElement.gridY));
      return [...filtered, newElement];
    });
  };

  const handleReset = () => {
    if (confirm('¿Estás seguro de que quieres restaurar la tabla a su estado original? Perderás los elementos que hayas agregado.')) {
      setElements(INITIAL_METHODS);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
      <main className="max-w-[1600px] mx-auto px-4 py-12 flex flex-col items-center">
        
        <header className="text-center mb-12 space-y-4 relative w-full">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
            Tabla Periódica de Evaluación
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Una clasificación interactiva de métodos, instrumentos y estrategias de evaluación docente.
          </p>
          
          {/* Botones de Acción */}
          <div className="flex justify-center gap-4 mt-6">
            <button 
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-emerald-900/20"
            >
              <Plus className="w-5 h-5" />
              Agregar Elemento
            </button>
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-full font-medium transition-all"
            >
              Restaurar Original
            </button>
          </div>
        </header>

        {/* Leyenda de Acciones Formativas (Colores) */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-8 text-sm max-w-4xl mx-auto">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div> Analizar</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> Aplicar</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div> Conocer</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div> Dialogar</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div> Evaluar</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]"></div> Expresar</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div> Generar</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div> Sintetizar</div>
        </div>

        <PeriodicTable elements={elements} onElementClick={handleElementClick} />

      </main>

      {/* Modal para agregar elementos */}
      <ElementFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveElement} 
      />

      {/* Modal para ver detalles del elemento */}
      <ElementDetailsModal 
        method={selectedElement} 
        onClose={() => setSelectedElement(null)} 
      />
    </div>
  );
}
