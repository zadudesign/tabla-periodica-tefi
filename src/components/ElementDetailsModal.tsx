import { X, Activity, Layers, Target, BookOpen } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { EvaluationMethod, FormativeAction } from '../types/evaluation';

interface ElementDetailsModalProps {
  method: EvaluationMethod | null;
  onClose: () => void;
}

// Diccionario de colores para el fondo y bordes del modal según la Acción Formativa
const actionThemes: Record<FormativeAction, { bg: string, border: string, text: string, badge: string }> = {
  Analizar: { bg: 'from-blue-950 to-slate-950', border: 'border-blue-500/50', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-300' },
  Aplicar: { bg: 'from-emerald-950 to-slate-950', border: 'border-emerald-500/50', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' },
  Conocer: { bg: 'from-amber-950 to-slate-950', border: 'border-amber-500/50', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300' },
  Dialogar: { bg: 'from-orange-950 to-slate-950', border: 'border-orange-500/50', text: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-300' },
  Evaluar: { bg: 'from-red-950 to-slate-950', border: 'border-red-500/50', text: 'text-red-400', badge: 'bg-red-500/20 text-red-300' },
  Expresar: { bg: 'from-pink-950 to-slate-950', border: 'border-pink-500/50', text: 'text-pink-400', badge: 'bg-pink-500/20 text-pink-300' },
  Generar: { bg: 'from-purple-950 to-slate-950', border: 'border-purple-500/50', text: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-300' },
  Sintetizar: { bg: 'from-cyan-950 to-slate-950', border: 'border-cyan-500/50', text: 'text-cyan-400', badge: 'bg-cyan-500/20 text-cyan-300' },
};

export function ElementDetailsModal({ method, onClose }: ElementDetailsModalProps) {
  if (!method) return null;

  const IconComponent = (LucideIcons as any)[method.icon] || LucideIcons.HelpCircle;
  const theme = actionThemes[method.formativeAction] || { bg: 'from-slate-900 to-slate-950', border: 'border-slate-700', text: 'text-slate-300', badge: 'bg-slate-800 text-slate-300' };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={onClose} // Cerrar al hacer clic fuera
    >
      <div 
        className={`relative w-full max-w-lg bg-gradient-to-b ${theme.bg} border-2 ${theme.border} rounded-2xl shadow-2xl overflow-hidden flex flex-col`}
        onClick={e => e.stopPropagation()} // Evitar que el clic dentro cierre el modal
      >
        {/* Botón de cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1.5 bg-slate-900/50 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabecera: Símbolo, Número e Icono */}
        <div className="p-8 pb-6 flex items-start justify-between relative overflow-hidden">
          {/* Icono de fondo (marca de agua) */}
          <IconComponent className={`absolute -right-6 -top-6 w-48 h-48 opacity-5 ${theme.text}`} strokeWidth={1} />
          
          <div className="relative z-10 flex flex-col">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-6xl font-black tracking-tighter leading-none text-white">
                {method.symbol}
              </span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${theme.border} bg-slate-900/50`}>
                <span className={`text-lg font-bold ${theme.text}`}>
                  {method.atomicNumber}
                </span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-100 mt-2 leading-tight">
              {method.name}
            </h2>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${theme.badge}`}>
                {method.formativeAction}
              </span>
            </div>
          </div>
        </div>

        {/* Cuerpo: Descripción y Atributos */}
        <div className="p-8 pt-0 flex-1 flex flex-col gap-6 relative z-10">
          
          {/* Descripción */}
          <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800/50">
            <p className="text-slate-300 leading-relaxed">
              {method.description}
            </p>
          </div>

          {/* Cuadrícula de Atributos */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Tipo de Evaluación */}
            <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800/50 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Target className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Tipo</span>
              </div>
              <span className="text-slate-200 font-medium">{method.evaluationType}</span>
            </div>

            {/* Complejidad */}
            <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800/50 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Complejidad</span>
              </div>
              <span className="text-slate-200 font-medium">{method.complexityLevel}</span>
            </div>

            {/* Modalidad */}
            <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800/50 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Modalidad</span>
              </div>
              <span className="text-slate-200 font-medium">{method.modality}</span>
            </div>

            {/* Ubicación (Grid) */}
            <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800/50 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Layers className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Ubicación</span>
              </div>
              <span className="text-slate-200 font-medium">Grupo {method.gridX}, Período {method.gridY}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
