'use client';

import { useState } from 'react';
import { Sparkles, Target, Zap, Activity, ShieldCheck, Loader2, BookOpen } from 'lucide-react';

type Solution = {
  title: string;
  pain_point_category: string;
  referenced_videos: string[];
  latam_adaptation: string;
  rpm_alignment: string;
  difficulty: string;
  fit_score: number;
};

export default function SolutionsEnginePage() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // MVT Form state
  const [mvtData, setMvtData] = useState({
    idea: '',
    profile: '',
    learnings: ''
  });
  const [isSubmittingMvt, setIsSubmittingMvt] = useState(false);
  const [mvtSuccess, setMvtSuccess] = useState(false);

  const generateSolutions = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/solutions');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al generar soluciones');
      }

      setSolutions(data.solutions);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMvtChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMvtData({ ...mvtData, [e.target.name]: e.target.value });
  };

  const handleMvtSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingMvt(true);
    setMvtSuccess(false);

    try {
      const res = await fetch('/api/mvt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mvtData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error guardando MVT');
      
      setMvtSuccess(true);
      setMvtData({ idea: '', profile: '', learnings: '' });
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmittingMvt(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800 pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 flex items-center mb-2">
            <Sparkles className="w-8 h-8 mr-3 text-indigo-400" />
            Motor de Soluciones
          </h1>
          <p className="text-zinc-400 max-w-2xl">
            Sintetiza modelos de negocio exitosos, problemas regionales y tus objetivos personales (RPM) en MVPs accionables.
          </p>
        </div>
        <button 
          onClick={generateSolutions}
          disabled={isLoading}
          className="flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Cruzando Datos (IA)...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Generar Propuestas Estratégicas
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Solutions Grid */}
      {solutions.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-xl font-semibold text-zinc-100 flex items-center">
            <Target className="w-5 h-5 mr-2 text-zinc-400" />
            Propuestas Generadas ({solutions.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solutions.map((sol, idx) => (
              <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-indigo-500/30 transition-colors flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-900 text-zinc-300 border border-zinc-700">
                    {sol.pain_point_category}
                  </span>
                  <div className="flex items-center px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <Activity className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400">Fit {sol.fit_score}%</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-zinc-100 mb-3">{sol.title}</h3>
                
                <div className="space-y-4 flex-1">
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Adaptación LATAM</h4>
                    <p className="text-sm text-zinc-300 leading-relaxed">{sol.latam_adaptation}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Alineación RPM</h4>
                    <p className="text-sm text-zinc-400 italic">"{sol.rpm_alignment}"</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                  <div className="text-xs text-zinc-500">
                    <span className="font-semibold text-zinc-400">Inspiración: </span> 
                    {sol.referenced_videos.length} videos analizados
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    sol.difficulty === 'Alta' ? 'text-red-400' : sol.difficulty === 'Media' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    Dificultad {sol.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MVT Form */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 mt-12">
        <h2 className="text-xl font-bold text-zinc-100 flex items-center mb-6">
          <BookOpen className="w-5 h-5 mr-3 text-indigo-400" />
          Documentar Inmersión MVT
        </h2>
        <form onSubmit={handleMvtSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Idea Validada (Propuesta elegida)</label>
              <input 
                required
                type="text" 
                name="idea"
                value={mvtData.idea}
                onChange={handleMvtChange}
                placeholder="Ej. SaaS predictivo para logística..." 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Perfil del Entrevistado / Compañero</label>
              <input 
                required
                type="text" 
                name="profile"
                value={mvtData.profile}
                onChange={handleMvtChange}
                placeholder="Ej. Gerente de Operaciones, 35 años..." 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Aprendizajes Clave</label>
            <textarea 
              required
              name="learnings"
              value={mvtData.learnings}
              onChange={handleMvtChange}
              placeholder="¿Qué insights descubriste? ¿Qué problemas reales confirmaron?" 
              className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-emerald-400">
              {mvtSuccess && <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1"/> Guardado exitosamente</span>}
            </div>
            <button 
              type="submit"
              disabled={isSubmittingMvt}
              className="px-6 py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center"
            >
              {isSubmittingMvt ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Guardar MVT'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
