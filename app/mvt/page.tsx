'use client';

import { useState, useEffect } from 'react';
import { Target, Link as LinkIcon, BarChart3, FlaskConical, AlertTriangle, Lightbulb, User, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';

type Conversation = {
  id: string;
  solution_title: string;
  interviewee_profile: string;
  key_learnings: string;
  created_at: string;
};

type MvtTest = {
  id: string;
  hypotheses: string;
  test_type: string;
  evidence_url: string;
  target_metric: string;
  actual_metric: string;
  conclusion: string;
  final_decision: string;
  created_at: string;
};

export default function MvtPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [testRecord, setTestRecord] = useState<MvtTest | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    hypotheses: '',
    test_type: '',
    evidence_url: '',
    target_metric: '',
    actual_metric: '',
    conclusion: 'Inconclusa',
    final_decision: 'Ajustar'
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/mvt-tests');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setConversations(data.conversations || []);
      setTestRecord(data.test || null);
    } catch (err: any) {
      setError(err.message || 'Error cargando datos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/mvt-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      // Recargar datos para mostrar el resumen
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Error guardando test');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-12">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 flex items-center mb-2">
          <FlaskConical className="w-8 h-8 mr-3 text-indigo-400" />
          Validación MVT Completa
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          Visualiza los hallazgos de tus entrevistas (Inmersión) y registra los resultados de tu experimento (Minimum Viable Test) para tomar la decisión final de inversión o descarte.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Sección Superior: Hallazgos Previos */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-zinc-100 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-zinc-400" />
          Hallazgos de Inmersión (Entrevistas Previas)
        </h2>
        
        {conversations.length === 0 ? (
          <div className="p-8 text-center border border-zinc-800 rounded-xl bg-zinc-900/30">
            <p className="text-zinc-500">No hay inmersiones MVT documentadas aún. Ve al "Motor de Soluciones" para guardar aprendizajes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conversations.map((conv) => (
              <div key={conv.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
                <h3 className="text-sm font-semibold text-zinc-200 mb-2 flex items-start">
                  <Lightbulb className="w-4 h-4 mr-2 text-amber-400 shrink-0 mt-0.5" />
                  {conv.solution_title}
                </h3>
                <div className="flex items-center text-xs text-zinc-500 mb-4">
                  <User className="w-3.5 h-3.5 mr-1" />
                  {conv.interviewee_profile}
                </div>
                <div className="bg-zinc-900/50 p-3 rounded-lg text-sm text-zinc-400 leading-relaxed italic border border-zinc-800/50">
                  "{conv.key_learnings}"
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full h-px bg-zinc-800/50 my-8"></div>

      {/* Sección Principal: Panel de Experimento MVT */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-zinc-100 flex items-center">
          <Target className="w-5 h-5 mr-2 text-emerald-400" />
          Experimento MVT
        </h2>

        {testRecord ? (
          // Dashboard Resumen
          <div className="bg-zinc-950 border border-emerald-500/30 rounded-2xl p-6 md:p-8 shadow-lg shadow-emerald-500/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Test Registrado</span>
                <h3 className="text-2xl font-bold text-zinc-100 mt-1">{testRecord.test_type}</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${
                  testRecord.conclusion === 'Validada' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  testRecord.conclusion === 'Invalidada' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                  'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {testRecord.conclusion}
                </span>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${
                  testRecord.final_decision === 'Avanzar' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                  testRecord.final_decision === 'Descartar' ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 
                  'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                  {testRecord.final_decision}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Hipótesis de Riesgo Evaluadas</h4>
                  <div className="bg-zinc-900 rounded-xl p-4 text-sm text-zinc-300 border border-zinc-800">
                    <pre className="whitespace-pre-wrap font-sans">{testRecord.hypotheses}</pre>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Evidencia</h3>
                  <a href={testRecord.evidence_url} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300">
                    <LinkIcon className="w-4 h-4 mr-1.5" />
                    Ver Evidencia Recopilada
                  </a>
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex flex-col justify-center">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-6 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Comparativa de Métricas
                </h4>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-400">Métrica Objetivo (Umbral de Éxito)</span>
                    </div>
                    <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-medium">
                      {testRecord.target_metric}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-400">Métrica Real Obtenida</span>
                    </div>
                    <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-medium">
                      {testRecord.actual_metric}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-emerald-500/20 text-center">
              <p className="text-emerald-400/80 text-sm flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Ciclo de Validación MVT completado con éxito.
              </p>
            </div>
          </div>
        ) : (
          // Formulario
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="space-y-3">
                <label className="text-sm font-semibold text-zinc-300 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                  Hipótesis Críticas de Riesgo
                </label>
                <p className="text-xs text-zinc-500">Enumera las 5 hipótesis más riesgosas (Viabilidad, Factibilidad, Usabilidad). Ej: "El usuario logístico confiará en un software SaaS."</p>
                <textarea 
                  required
                  name="hypotheses"
                  value={formData.hypotheses}
                  onChange={handleChange}
                  className="w-full h-32 bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">Tipo de Test</label>
                  <input 
                    required
                    type="text" 
                    name="test_type"
                    placeholder="Ej. Landing Page, Concierge, Pre-venta"
                    value={formData.test_type}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">URL de Evidencia</label>
                  <input 
                    required
                    type="url" 
                    name="evidence_url"
                    placeholder="Ej. link a Google Forms, Analytics, Hotjar"
                    value={formData.evidence_url}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">Métrica Objetivo (Umbral de Éxito)</label>
                  <input 
                    required
                    type="text" 
                    name="target_metric"
                    placeholder="Ej. 10% Tasa de Conversión (Pagos)"
                    value={formData.target_metric}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">Métrica Real Obtenida</label>
                  <input 
                    required
                    type="text" 
                    name="actual_metric"
                    placeholder="Ej. 12% Tasa de Conversión (Lograda)"
                    value={formData.actual_metric}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">Conclusión del Test</label>
                  <select 
                    name="conclusion"
                    value={formData.conclusion}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Validada">Validada</option>
                    <option value="Invalidada">Invalidada</option>
                    <option value="Inconclusa">Inconclusa</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">Decisión Final</label>
                  <select 
                    name="final_decision"
                    value={formData.final_decision}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Avanzar">Avanzar (Invertir recursos)</option>
                    <option value="Ajustar">Ajustar (Pivotear MVP)</option>
                    <option value="Descartar">Descartar (Matar idea)</option>
                  </select>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    'Registrar Validación Final'
                  )}
                </button>
              </div>

            </form>
          </div>
        )}
      </div>

    </div>
  );
}
