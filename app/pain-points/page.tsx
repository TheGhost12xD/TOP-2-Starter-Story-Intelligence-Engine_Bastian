import { supabaseAdmin } from '@/lib/supabaseClient';
import { Target, Sparkles, Filter, Video, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PainPointsPage() {
  const { data: painPoints, error } = await supabaseAdmin
    .from('pain_points')
    .select('*')
    .order('created_at', { ascending: false });

  const totalPoints = painPoints?.length || 0;
  // Para el demo, hardcodeamos métricas que cruzaremos luego
  const totalManuales = 0;
  const totalClasificaciones = 0;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 flex items-center">
            <Target className="w-8 h-8 mr-3 text-indigo-400" />
            Pain Points LATAM
          </h1>
          <p className="text-zinc-400 mt-2 max-w-2xl text-sm md:text-base">
            El motor de inteligencia cruza los modelos de negocio exitosos extraídos de Starter Story con nuestra base de datos de problemas reales en Latinoamérica para encontrar el encaje perfecto.
          </p>
        </div>
        
        <button className="flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors whitespace-nowrap shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-4 h-4 mr-2" />
          Extraer pain points con IA
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'TOTAL EXTRAÍDOS', value: totalPoints },
          { label: 'MANUALES', value: totalManuales },
          { label: 'CLASIFICACIONES', value: totalClasificaciones },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-950 rounded-xl border border-zinc-800 p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors">
            <h3 className="text-[10px] font-semibold text-zinc-500 tracking-wider mb-3">{stat.label}</h3>
            <p className="text-3xl font-bold text-zinc-100">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/20 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-100 flex items-center">
            <Filter className="w-4 h-4 mr-2 text-zinc-400" />
            Base de Problemas (LATAM)
          </h2>
        </div>
        
        <div className="p-6 flex-1">
          {error ? (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
              Error al cargar la base de datos de Pain Points: {error.message}
            </div>
          ) : !painPoints || painPoints.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-80">
              <AlertCircle className="w-12 h-12 text-zinc-600 mb-4" />
              <h3 className="text-lg font-medium text-zinc-300 mb-2">Sin Pain Points Registrados</h3>
              <p className="text-zinc-500 text-sm max-w-md mx-auto">
                No hay problemas cargados en la tabla <code>pain_points</code>. Usa la extracción con IA o ingresa datos manualmente en Supabase.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {painPoints.map((point) => (
                <div key={point.id} className="group relative bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 rounded-xl p-5 transition-all hover:shadow-lg hover:shadow-indigo-500/5 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                      {point.category || 'General'}
                    </span>
                  </div>
                  <h3 className="text-sm text-zinc-300 mb-4 flex-1">
                    {point.description}
                  </h3>
                  
                  <div className="mt-auto pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                    <div className="flex items-center text-xs text-zinc-500">
                      <Video className="w-3.5 h-3.5 mr-1.5" />
                      Videos fuente: <span className="font-semibold text-zinc-300 ml-1">0</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
