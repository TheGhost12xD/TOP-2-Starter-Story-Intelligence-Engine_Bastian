'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Inicializamos un cliente público de Supabase para lectura desde el navegador
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  // Cargar videos al montar el componente
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error cargando videos:', error);
    } else {
      setVideos(data || []);
    }
    setFetching(false);
  };

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setStatusMsg('');

    try {
      const response = await fetch('/api/scraper/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: [url] }),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud al iniciar el scraper');
      }

      setStatusMsg('¡Extracción iniciada! Los datos aparecerán aquí cuando el scraper termine en background.');
      setUrl('');
    } catch (error) {
      console.error(error);
      setStatusMsg('Ocurrió un error al intentar iniciar la extracción.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-10 px-6">
        <div className="max-w-5xl mx-auto text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Business Intelligence Engine
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Analizando casos de éxito de Starter Story
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Formulario de Extracción */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Importar nuevos casos</h2>
          
          <form onSubmit={handleExtract} className="flex flex-col md:flex-row gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Pega la URL de YouTube aquí..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center min-w-[160px]"
            >
              {loading ? 'Cargando...' : 'Extraer Video'}
            </button>
          </form>
          
          {statusMsg && (
            <div className={`mt-4 p-4 rounded-md text-sm font-medium ${statusMsg.includes('error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {statusMsg}
            </div>
          )}
        </section>

        {/* Visualización de Datos */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Videos Analizados</h3>
            <button 
              onClick={fetchVideos}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Refrescar lista
            </button>
          </div>

          {fetching ? (
            <div className="text-center py-10 text-gray-500">Cargando datos...</div>
          ) : videos.length === 0 ? (
            <div className="bg-white p-10 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
              Aún no hay videos analizados.
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Título del Video
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        URL original
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Fecha de extracción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {videos.map((video) => (
                      <tr key={video.youtube_video_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate" title={video.title}>
                          {video.title || 'Sin título'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <a
                            href={video.url || `https://www.youtube.com/watch?v=${video.youtube_video_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline inline-flex items-center"
                          >
                            Ver en YouTube
                            <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(video.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
