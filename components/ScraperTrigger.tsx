'use client';

import { useState } from 'react';
import { Play, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function ScraperTrigger() {
  const [isScraping, setIsScraping] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleExtract = async () => {
    setIsScraping(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('/api/scraper/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Puedes pasar urls específicas si es necesario, o vacío si extrae el canal completo.
        body: JSON.stringify({ urls: [] }), 
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud al scraper');
      }

      setStatus('success');
      setMessage('Scraping iniciado en background. Los resultados aparecerán aquí cuando finalice.');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('Ocurrió un error al intentar iniciar la extracción.');
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h2 className="text-base font-semibold text-zinc-100 flex items-center">
          <Play className="w-4 h-4 mr-2 text-indigo-400" />
          Panel de Control del Scraper
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Inicia una nueva ejecución en Apify para extraer videos.
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <button
          onClick={handleExtract}
          disabled={isScraping}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center justify-center min-w-[200px]"
        >
          {isScraping ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Iniciando...
            </>
          ) : (
            'Ejecutar Extracción Manual'
          )}
        </button>
        
        {status !== 'idle' && (
          <div className={`flex items-center text-xs font-medium ${status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
            {status === 'success' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
