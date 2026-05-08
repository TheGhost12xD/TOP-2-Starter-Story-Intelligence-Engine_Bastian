'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Database, Clock } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type LogRecord = {
  id: string;
  run_id?: string;
  status: string;
  videos_processed: number;
  created_at: string;
};

export default function ScraperLogsPage() {
  const [logs, setLogs] = useState<LogRecord[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from('scraping_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s === 'success' || s === 'succeeded') {
      return (
        <span className="px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md">
          SUCCESS
        </span>
      );
    }
    if (s === 'failed' || s === 'error') {
      return (
        <span className="px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20 rounded-md">
          FAILED
        </span>
      );
    }
    // Default / Running
    return (
      <span className="px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-md flex items-center inline-flex">
        <Clock className="w-3 h-3 mr-1 animate-pulse" />
        RUNNING
      </span>
    );
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
      
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center">
          <Database className="w-6 h-6 mr-3 text-indigo-400" />
          Scraper Logs
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Registro histórico de las ejecuciones del web scraper en Apify.
        </p>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-800">
            <thead className="bg-zinc-900/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Run ID / Ejecución
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Videos Procesados
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Fecha / Hora
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {isFetching ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-zinc-500">
                    Cargando registros...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-zinc-500">
                    Aún no hay logs registrados.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-zinc-300 font-mono">
                        {log.run_id || log.id.slice(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      {log.videos_processed || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                      {new Date(log.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
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
