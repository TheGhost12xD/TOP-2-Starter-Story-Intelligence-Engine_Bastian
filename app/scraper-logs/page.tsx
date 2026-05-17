import { supabaseAdmin } from '@/lib/supabaseClient';
import ScraperTrigger from '@/components/ScraperTrigger';
import RealtimeLogsTable from '@/components/RealtimeLogsTable';
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
        
        <RealtimeLogsTable initialLogs={logs || []} />
      </div>
    </div>
  );
}
