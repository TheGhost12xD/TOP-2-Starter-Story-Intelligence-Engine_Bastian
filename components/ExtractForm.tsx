'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

export default function ExtractForm() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return;

    setIsScraping(true);
    setStatusMsg('');

    try {
      const response = await fetch('/api/scraper/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: [videoUrl] }),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      setStatusMsg('Scraping iniciado en background. Apify está trabajando y los datos se guardarán en Supabase al terminar.');
      setVideoUrl('');
    } catch (error) {
      console.error(error);
      setStatusMsg('Ocurrió un error al intentar iniciar la extracción.');
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-6 flex flex-col">
      <div className="flex items-center mb-6">
        <Play className="w-4 h-4 mr-2 text-zinc-400" />
        <h2 className="text-base font-semibold text-zinc-100">Ejecutar Extracción Manual</h2>
      </div>
      <form onSubmit={handleExtract} className="flex gap-2">
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="flex-1 bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow placeholder:text-zinc-600"
          required
          disabled={isScraping}
        />
        <button
          type="submit"
          disabled={isScraping}
          className="bg-zinc-100 hover:bg-white text-zinc-900 font-medium px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50 flex items-center justify-center whitespace-nowrap"
        >
          {isScraping ? 'Iniciando...' : 'Extraer'}
        </button>
      </form>
      {statusMsg && (
        <p className={`mt-3 text-xs font-medium ${statusMsg.includes('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
          {statusMsg}
        </p>
      )}
    </div>
  );
}
