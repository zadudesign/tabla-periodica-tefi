import { useState, useEffect } from 'react';
import { Plus, Database, Loader2, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { PeriodicTable } from './components/PeriodicTable';
import { ElementFormModal } from './components/ElementFormModal';
import { ElementDetailsModal } from './components/ElementDetailsModal';
import { LoginModal } from './components/LoginModal';
import { EvaluationMethod } from './types/evaluation';
import { EVALUATION_METHODS as INITIAL_METHODS } from './constants/methods';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { elementService } from './services/elementService';
import { User } from '@supabase/supabase-js';

export default function App() {
  const [elements, setElements] = useState<EvaluationMethod[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<EvaluationMethod | null>(null);
  const [elementToEdit, setElementToEdit] = useState<EvaluationMethod | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Cargar datos desde Supabase al iniciar y escuchar cambios de autenticación
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      loadElements();
      
      // Obtener sesión actual
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });

      // Escuchar cambios en la sesión (login/logout)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const loadElements = async () => {
    try {
      setIsLoading(true);
      const data = await elementService.getElements();
      
      // Si la base de datos está vacía, la inicializamos con los datos por defecto
      if (data.length === 0) {
        const seededData = await elementService.resetToInitial(INITIAL_METHODS);
        setElements(seededData);
      } else {
        setElements(data);
      }
    } catch (err: any) {
      console.error('Error cargando elementos:', err);
      setError(err.message || 'Error al conectar con Supabase');
    } finally {
      setIsLoading(false);
    }
  };

  const handleElementClick = (method: EvaluationMethod) => {
    setSelectedElement(method);
  };

  const handleEditElement = (method: EvaluationMethod) => {
    setSelectedElement(null); // Cerramos el modal de detalles
    setElementToEdit(method); // Guardamos el elemento a editar
    setIsFormOpen(true);      // Abrimos el formulario
  };

  const handleDeleteElement = async (method: EvaluationMethod) => {
    if (confirm(`¿Estás seguro de que deseas eliminar "${method.name}"?`)) {
      try {
        await elementService.deleteElement(method.id);
        setElements(prev => prev.filter(e => e.id !== method.id));
        setSelectedElement(null); // Cerramos el modal de detalles
      } catch (err: any) {
        console.error('Error eliminando elemento:', err);
        alert('Hubo un error al eliminar el elemento.');
      }
    }
  };

  const handleSaveElement = async (newElement: EvaluationMethod) => {
    try {
      // Buscar si ya existe un elemento diferente en esa misma coordenada
      const existingElement = elements.find(
        e => e.gridX === newElement.gridX && e.gridY === newElement.gridY && e.id !== newElement.id
      );

      // Si existe, lo borramos de Supabase para evitar empalmes
      if (existingElement) {
        await elementService.deleteElement(existingElement.id);
      }

      // Guardar el nuevo elemento en Supabase
      const savedElement = await elementService.saveElement(newElement);
      
      // Actualizar estado local
      setElements(prev => {
        // Removemos el elemento si ya existía (por ID) o si ocupa la misma coordenada y no es el mismo ID
        const filtered = prev.filter(e => e.id !== savedElement.id && !(e.gridX === savedElement.gridX && e.gridY === savedElement.gridY));
        return [...filtered, savedElement];
      });
      
      setElementToEdit(null); // Limpiamos el estado de edición
      setIsFormOpen(false);   // Cerramos el modal
    } catch (err: any) {
      console.error('Error guardando elemento:', err);
      alert('Hubo un error al guardar el elemento en la base de datos.');
    }
  };

  const handleReset = async () => {
    if (confirm('¿Estás seguro de que quieres restaurar la tabla a su estado original? Perderás los elementos que hayas agregado en la base de datos.')) {
      try {
        setIsLoading(true);
        const resetData = await elementService.resetToInitial(INITIAL_METHODS);
        setElements(resetData);
      } catch (err: any) {
        console.error('Error restaurando elementos:', err);
        alert('Hubo un error al restaurar la base de datos.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  // PANTALLA DE CONFIGURACIÓN DE SUPABASE
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 font-sans flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-6 text-emerald-400">
            <Database className="w-10 h-10" />
            <h1 className="text-3xl font-bold text-white">Conectar Supabase</h1>
          </div>
          
          <p className="text-slate-300 mb-6 text-lg">
            Para que tus datos se guarden en la nube, necesitamos conectar tu proyecto con Supabase. Sigue estos pasos:
          </p>

          <div className="space-y-6 text-slate-300">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
              <h3 className="font-bold text-white mb-2">1. Crea un proyecto en Supabase</h3>
              <p>Ve a <a href="https://supabase.com/" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">supabase.com</a>, crea un proyecto nuevo y ve a la sección <strong>SQL Editor</strong>.</p>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
              <h3 className="font-bold text-white mb-2">2. Ejecuta este código SQL</h3>
              <p className="mb-3">Copia y pega este código para crear la tabla exacta que necesita nuestra aplicación:</p>
              <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm text-emerald-300 border border-slate-800">
{`create table elements (
  id text primary key,
  "atomicNumber" integer not null,
  symbol text not null,
  name text not null,
  "evaluationType" text not null,
  "complexityLevel" text not null,
  "formativeAction" text not null,
  modality text not null,
  icon text not null,
  description text not null,
  "gridX" integer not null,
  "gridY" integer not null
);`}
              </pre>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
              <h3 className="font-bold text-white mb-2">3. Agrega las Variables de Entorno</h3>
              <p>Ve a la configuración de tu proyecto en Supabase (Settings &gt; API) y copia la <strong>URL</strong> y la <strong>anon key</strong>.</p>
              <p className="mt-2">Luego, en este entorno de Google AI Studio, ve al menú de configuración (Settings) y agrega estos dos "Secrets":</p>
              <ul className="list-disc list-inside mt-2 text-emerald-400 font-mono text-sm">
                <li>VITE_SUPABASE_URL</li>
                <li>VITE_SUPABASE_ANON_KEY</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-950/30 border border-blue-900/50 rounded-xl text-blue-200 text-sm">
            Una vez que agregues las variables de entorno, la aplicación se recargará automáticamente y verás tu tabla periódica conectada a la nube.
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA DE CARGA
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-emerald-500 gap-4">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="text-slate-300 font-medium animate-pulse">Conectando con Supabase...</p>
      </div>
    );
  }

  // PANTALLA DE ERROR
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-red-500 gap-4 p-4 text-center">
        <Database className="w-16 h-16" />
        <h2 className="text-2xl font-bold text-white">Error de Conexión</h2>
        <p className="text-slate-300 max-w-md">{error}</p>
        <p className="text-sm text-slate-500 mt-4">Verifica que la tabla "elements" exista en Supabase y que las políticas de seguridad (RLS) permitan lectura y escritura pública, o desactiva RLS temporalmente para la tabla.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
      
      {/* Barra superior de navegación/autenticación */}
      <div className="w-full border-b border-slate-800/50 bg-slate-900/30">
        <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-end">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
                <span>Modo Edición Activo</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Acceso Administrador
            </button>
          )}
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-4 py-8 flex flex-col items-center">
        
        <header className="text-center mb-12 space-y-4 relative w-full">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
            Tabla Periódica de Evaluación Formativa
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Una clasificación interactiva de métodos, instrumentos y estrategias de evaluación docente.
          </p>
          
          {/* Botones de Acción (Solo visibles si es administrador) */}
          {user && (
            <div className="flex justify-center gap-4 mt-6">
              <button 
                onClick={() => {
                  setElementToEdit(null);
                  setIsFormOpen(true);
                }}
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
          )}
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
        onClose={() => {
          setIsFormOpen(false);
          setElementToEdit(null);
        }} 
        onSave={handleSaveElement} 
        initialData={elementToEdit}
      />

      {/* Modal para ver detalles del elemento */}
      <ElementDetailsModal 
        method={selectedElement} 
        onClose={() => setSelectedElement(null)} 
        onEdit={handleEditElement}
        onDelete={handleDeleteElement}
        isAuthenticated={!!user}
      />

      {/* Modal de Login */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}
