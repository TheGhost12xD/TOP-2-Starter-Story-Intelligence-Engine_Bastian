'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, ExternalLink, Video } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type VideoRecord = {
  id: string;
  youtube_video_id: string;
  title: string;
  created_at: string;
};

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('id, youtube_video_id, title, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerDetalles = (title: string) => {
    console.log(`Detalles del video: ${title}`);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center">
            <Video className="w-6 h-6 mr-3 text-indigo-400" />
            Videos Extraídos
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Repositorio central de todos los casos de negocio analizados.
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-zinc-800 rounded-md leading-5 bg-zinc-900/50 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-800">
            <thead className="bg-zinc-900/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Título del Video
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  ID YouTube
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Fecha Extracción
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {isFetching ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-zinc-500">
                    Cargando videos...
                  </td>
                </tr>
              ) : filteredVideos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-zinc-500">
                    Aún no hay videos registrados.
                  </td>
                </tr>
              ) : (
                filteredVideos.map((video) => (
                  <tr key={video.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-zinc-200 truncate max-w-sm">
                        {video.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={`https://youtube.com/watch?v=${video.youtube_video_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        {video.youtube_video_id}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                      {new Date(video.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleVerDetalles(video.title)}
                        className="text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 px-3 py-1.5 rounded-md transition-colors"
                      >
                        Ver Detalles
                      </button>
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
