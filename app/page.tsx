import { supabaseAdmin } from '@/lib/supabaseClient';
import ExtractForm from '@/components/ExtractForm';
import { Play, CheckCircle2, ChevronRight, Video } from 'lucide-react';

export default async function Home() {
  // Fetch videos from Supabase
  const { data: videos, error } = await supabaseAdmin
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  const totalVideos = videos ? videos.length : 0;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Hero Card */}
      <section className="relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800/80 p-8 md:p-12">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300 mb-6">
            v0.5 - Integración de Supabase & Server Components
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4 tracking-tight">
            Dashboard Analítico: Starter Story
          </h1>
          <p className="text-zinc-400 max-w-3xl text-base md:text-lg leading-relaxed">
            Explora los casos de negocio extraídos. El webhook de Apify actualiza los datos en tiempo real y el frontend se reconstruye automáticamente.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'VIDEOS', value: totalVideos },
          { label: 'ANALIZADOS (IA)', value: 0 },
          { label: 'PAIN POINTS', value: 0 },
          { label: 'CLASIFICACIONES', value: 0 },
          { label: 'SOLUCIONES', value: 0 },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-950 rounded-xl border border-zinc-800 p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors">
            <h3 className="text-[10px] font-semibold text-zinc-500 tracking-wider mb-3">{stat.label}</h3>
            <p className="text-3xl font-bold text-zinc-100">{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Actions Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExtractForm />

        <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-base font-semibold text-zinc-100 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-zinc-400" />
              Estado del Sistema
            </h2>
          </div>
          <div className="p-6">
            <p className="text-zinc-400 text-sm leading-relaxed">
              La tabla de <strong className="text-zinc-200">videos</strong> se lee desde la base de datos usando Server Components. 
              Cuando el Scraper de Apify termina y envía los datos vía Webhook, el sistema guarda en Supabase e invoca <code className="text-indigo-400 bg-zinc-900 px-1 py-0.5 rounded ml-1">revalidatePath('/')</code>.
              Esto le indica a Next.js que purgue la caché y renderice nuevamente la página, por lo que verás los nuevos videos al instante sin tener que refrescar manualmente.
            </p>
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section>
        <div className="flex items-center mb-6">
          <Video className="w-5 h-5 mr-3 text-indigo-400" />
          <h2 className="text-xl font-bold text-zinc-100">Casos de Negocio Extraídos</h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">
            <p className="text-sm font-medium">Error cargando videos: {error.message}</p>
          </div>
        )}

        {!videos || videos.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded-xl p-12 text-center">
            <Video className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-300 mb-2">No hay videos guardados</h3>
            <p className="text-zinc-500 text-sm max-w-sm mx-auto">
              Aún no has extraído ningún video o el scraper no ha terminado de guardar los datos en Supabase.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <a 
                key={video.id} 
                href={`https://youtube.com/watch?v=${video.youtube_video_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.1)] flex flex-col"
              >
                <div className="relative aspect-video bg-zinc-900 border-b border-zinc-800 overflow-hidden">
                  <img 
                    src={`https://img.youtube.com/vi/${video.youtube_video_id}/mqdefault.jpg`} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] font-medium text-white flex items-center">
                    <Play className="w-3 h-3 mr-1" /> Ver en YouTube
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2 mb-2 group-hover:text-indigo-400 transition-colors" title={video.title}>
                    {video.title}
                  </h3>
                  <div className="mt-auto pt-3 flex items-center justify-between text-[10px] text-zinc-500">
                    <span className="bg-zinc-900 px-2 py-1 rounded border border-zinc-800 font-mono">
                      {video.youtube_video_id}
                    </span>
                    <span>
                      {new Date(video.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
