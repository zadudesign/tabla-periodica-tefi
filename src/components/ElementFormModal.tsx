import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { EvaluationMethod, EvaluationType, ComplexityLevel, FormativeAction, Modality } from '../types/evaluation';

interface ElementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (element: EvaluationMethod) => void;
  initialData?: EvaluationMethod | null;
}

const defaultFormData: Partial<EvaluationMethod> = {
  name: '',
  symbol: '',
  atomicNumber: 1,
  evaluationType: 'Heteroevaluación',
  complexityLevel: 'Intermedio',
  formativeAction: 'Analizar',
  modality: 'Escritura',
  gridX: 1,
  gridY: 1,
  icon: 'FileText',
  description: '',
  youtubeUrl: '',
};

export function ElementFormModal({ isOpen, onClose, onSave, initialData }: ElementFormModalProps) {
  const [formData, setFormData] = useState<Partial<EvaluationMethod>>(defaultFormData);

  // Cargar datos iniciales si estamos en modo edición
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si estamos editando, conservamos el ID original. Si es nuevo, generamos uno.
    let id = initialData?.id;
    if (!id) {
      const baseName = formData.name?.toLowerCase().replace(/\s+/g, '-') || 'elemento';
      const uniqueSuffix = Math.random().toString(36).substring(2, 9);
      id = `${baseName}-${uniqueSuffix}`;
    }
    
    onSave({
      ...formData,
      id,
    } as EvaluationMethod);
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['gridX', 'gridY', 'atomicNumber'].includes(name) ? Number(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-slate-100">
            {initialData ? 'Editar Elemento' : 'Agregar Nuevo Elemento'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Nombre de la Técnica */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Nombre de la Técnica</label>
              <input 
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                placeholder="Ej: Rúbrica de Evaluación"
              />
            </div>

            {/* 2. Símbolo */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Símbolo (1-3 letras)</label>
              <input 
                required
                maxLength={3}
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                placeholder="Ej: Rb"
              />
            </div>

            {/* 3. Número del Elemento */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Número del Elemento</label>
              <input 
                required
                type="number"
                min="1"
                max="118"
                name="atomicNumber"
                value={formData.atomicNumber}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                placeholder="Ej: 18"
              />
            </div>

            {/* 4. Tipo de Evaluación */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Tipo de Evaluación</label>
              <select 
                name="evaluationType"
                value={formData.evaluationType}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              >
                <option value="Autoevaluación">Autoevaluación (AE)</option>
                <option value="Heteroevaluación">Heteroevaluación (HE)</option>
                <option value="Coevaluación">Coevaluación (CE)</option>
              </select>
            </div>

            {/* 5. Nivel de Complejidad */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Nivel de Complejidad</label>
              <select 
                name="complexityLevel"
                value={formData.complexityLevel}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              >
                <option value="Básico">Básico</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>

            {/* 6. Acción Formativa */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Acción Formativa (Define el color)</label>
              <select 
                name="formativeAction"
                value={formData.formativeAction}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              >
                <option value="Analizar">Analizar</option>
                <option value="Aplicar">Aplicar</option>
                <option value="Conocer">Conocer</option>
                <option value="Dialogar">Dialogar</option>
                <option value="Evaluar">Evaluar</option>
                <option value="Expresar">Expresar</option>
                <option value="Generar">Generar</option>
                <option value="Sintetizar">Sintetizar</option>
              </select>
            </div>

            {/* 7. Modalidad */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Modalidad</label>
              <select 
                name="modality"
                value={formData.modality}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              >
                <option value="Escritura">Escritura</option>
                <option value="Oralidad">Oralidad</option>
                <option value="Práctica">Práctica</option>
              </select>
            </div>

            {/* 8. Columna */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Columna (Grid X: 1-14)</label>
              <input 
                required
                type="number"
                min="1"
                max="14"
                name="gridX"
                value={formData.gridX}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>

            {/* 9. Fila */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Fila (Grid Y: 1-7)</label>
              <input 
                required
                type="number"
                min="1"
                max="7"
                name="gridY"
                value={formData.gridY}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>
            
            {/* 10. Nombre del Icono */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">
                Nombre del Icono (De <a href="https://lucide.dev/icons/" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">Lucide React</a>)
              </label>
              <input 
                required
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                placeholder="Ej: Book, PenTool, Users, FileText"
              />
            </div>

            {/* 11. Descripción */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Descripción</label>
              <textarea 
                required
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                placeholder="Describe brevemente este método de evaluación..."
              />
            </div>

            {/* 12. URL de YouTube */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">URL de YouTube (Opcional)</label>
              <input 
                type="url"
                name="youtubeUrl"
                value={formData.youtubeUrl || ''}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                placeholder="Ej: https://www.youtube.com/watch?v=..."
              />
            </div>
          </div>

          {/* Footer / Botones */}
          <div className="pt-6 border-t border-slate-800 flex justify-end gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-lg shadow-emerald-900/20"
            >
              Guardar Elemento
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
