import { supabaseAdmin } from '@/lib/supabaseClient';
import { Search, ExternalLink, Video } from 'lucide-react';
import Link from 'next/link';

export default async function VideosPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Asegurarnos de soportar búsqueda básica vía SSR si se agrega '?q=' a la URL
  const q = typeof searchParams.q === 'string' ? searchParams.q : '';

  let query = supabaseAdmin
    .from('videos')
    .select('id, youtube_video_id, title, created_at')
    .order('created_at', { ascending: false });

  if (q) {
    query = query.ilike('title', `%${q}%`);
  }

  const { data: videos, error } = await query;

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
        
        <form method="GET" action="/videos" className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-500" />
          </div>
          <input
            type="text"
            name="q"
            defaultValue={q}
            className="block w-full pl-10 pr-3 py-2 border border-zinc-800 rounded-md leading-5 bg-zinc-900/50 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            placeholder="Buscar por título (Presiona Enter)..."
          />
        </form>
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
              {error ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-red-400">
                    Ocurrió un error cargando los videos: {error.message}
                  </td>
                </tr>
              ) : !videos || videos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-zinc-500">
                    {q ? 'No se encontraron videos que coincidan con la búsqueda.' : 'Aún no hay videos registrados.'}
                  </td>
                </tr>
              ) : (
                videos.map((video) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
