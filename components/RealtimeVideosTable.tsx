'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowserClient';
import { ExternalLink } from 'lucide-react';

type VideoRecord = {
  id: string;
  youtube_video_id: string;
  title: string;
  created_at: string;
};

export default function RealtimeVideosTable({
  initialVideos,
  searchQuery,
}: {
  initialVideos: VideoRecord[];
  searchQuery?: string;
}) {
  const [videos, setVideos] = useState<VideoRecord[]>(initialVideos);

  useEffect(() => {
    const channel = supabaseBrowser
      .channel('realtime-videos')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'videos' },
        (payload) => {
          console.log('Nuevo video recibido en tiempo real:', payload);
          const newVideo = payload.new as VideoRecord;
          
          // Opcional: si hay una búsqueda activa, podríamos filtrar aquí.
          // Para mantenerlo simple y reactivo, simplemente lo añadimos 
          // a menos que choque completamente con la búsqueda.
          if (!searchQuery || newVideo.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            setVideos((prev) => {
              // Evitar duplicados por seguridad en caso de doble renderizado estricto
              if (prev.find((v) => v.youtube_video_id === newVideo.youtube_video_id)) return prev;
              return [newVideo, ...prev];
            });
          }
        }
      )
      // Escuchar también actualizaciones por si el UPSERT actualiza un video existente
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'videos' },
        (payload) => {
          const updatedVideo = payload.new as VideoRecord;
          setVideos((prev) => prev.map((v) => (v.id === updatedVideo.id ? updatedVideo : v)));
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [searchQuery]);

  if (!videos || videos.length === 0) {
    return (
      <div className="p-12 text-center text-sm text-zinc-500">
        {searchQuery ? 'No se encontraron videos que coincidan con la búsqueda.' : 'Aún no hay videos registrados.'}
      </div>
    );
  }

  return (
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
          {videos.map((video) => (
            <tr key={video.id} className="hover:bg-zinc-900/30 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-zinc-200 truncate max-w-sm" title={video.title}>
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
                  className="text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 px-3 py-1.5 rounded-md transition-colors"
                  title="Ver Detalles (Próximamente)"
                >
                  Ver Detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
