import { supabaseAdmin } from '@/lib/supabaseClient';
import { Search, ExternalLink, Video } from 'lucide-react';
import Link from 'next/link';
import RealtimeVideosTable from '@/components/RealtimeVideosTable';

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
        <RealtimeVideosTable initialVideos={videos || []} searchQuery={q} />
      </div>
    </div>
  );
}
