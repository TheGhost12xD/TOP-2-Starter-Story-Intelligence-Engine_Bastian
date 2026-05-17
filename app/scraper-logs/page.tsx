import { supabaseAdmin } from '@/lib/supabaseClient';
import ScraperTrigger from '@/components/ScraperTrigger';
import { Terminal, Activity } from 'lucide-react';

export default async function ScraperLogsPage() {
  const { data: logs, error } = await supabaseAdmin
    .from('scraping_logs')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center">
            <Terminal className="w-6 h-6 mr-3 text-indigo-400" />
            Scraper & Logs
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Historial de ejecuciones y estado del pipeline de datos.
          </p>
        </div>
      </div>

      {/* Componente de control para extracción manual */}
      <ScraperTrigger />

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/20">
          <h2 className="text-base font-semibold text-zinc-100 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-zinc-400" />
            Registro de Actividad
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-800">
            <thead className="bg-zinc-900/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Fecha/Hora
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  ID de Ejecución
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Videos Procesados
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {error ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-red-400">
                    Error al cargar los registros: {error.message}
                  </td>
                </tr>
              ) : !logs || logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-zinc-500">
                    Aún no hay registros de scraping.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      {new Date(log.created_at).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-mono bg-zinc-900 px-2 py-1 rounded text-zinc-400 border border-zinc-800">
                        {log.run_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.status === 'success' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                          Error
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-zinc-100">
                      {log.videos_processed}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
