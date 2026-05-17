'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowserClient';

type ScrapingLog = {
  id: string;
  run_id: string;
  status: string;
  videos_processed: number;
  created_at: string;
};

export default function RealtimeLogsTable({ initialLogs }: { initialLogs: ScrapingLog[] }) {
  const [logs, setLogs] = useState<ScrapingLog[]>(initialLogs);

  useEffect(() => {
    // Suscribirse a inserciones en la tabla scraping_logs
    const channel = supabaseBrowser
      .channel('realtime-logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'scraping_logs' },
        (payload) => {
          console.log('Nuevo log recibido en tiempo real:', payload);
          const newLog = payload.new as ScrapingLog;
          setLogs((prev) => [newLog, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, []);

  if (!logs || logs.length === 0) {
    return (
      <div className="p-12 text-center text-sm text-zinc-500">
        Aún no hay registros de scraping.
      </div>
    );
  }

  return (
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
          {logs.map((log) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
