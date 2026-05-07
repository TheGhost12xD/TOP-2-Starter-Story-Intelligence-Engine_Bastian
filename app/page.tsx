import { supabaseAdmin } from '@/lib/supabaseClient';
import ImportForm from './ImportForm';

// Forzamos el renderizado dinámico para tener siempre los datos actualizados
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Obtenemos los videos procesados de forma asíncrona desde Supabase
  const { data: videos, error } = await supabaseAdmin
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="border-b border-gray-100 bg-gray-50/50 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Business Intelligence Engine
          </h1>
          <p className="text-xl text-gray-500">
            Analizando casos de éxito de Starter Story
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Sección de Acción (CTA) */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Importar nuevos casos</h2>
          {/* El formulario interactivo extraído a un Client Component */}
          <ImportForm />
        </section>

        {/* Lista de Resultados */}
        <section>
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Videos Analizados</h3>
          
          {error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
              Ocurrió un error al cargar los videos. Verifica la conexión a la base de datos.
            </div>
          ) : !videos || videos.length === 0 ? (
            // Mensaje amigable si está vacío
            <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <p className="text-lg font-medium text-gray-700">Aún no has analizado ningún video.</p>
              <p className="text-sm mt-2 text-gray-500">Pega un link arriba para comenzar.</p>
            </div>
          ) : (
            // Tabla limpia de resultados
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Ver en YouTube
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {videos.map((video) => (
                    <tr key={video.youtube_video_id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-5 text-sm text-gray-900 font-medium">
                        {video.title || 'Título no disponible'}
                      </td>
                      <td className="px-6 py-5 text-sm">
                        <a 
                          href={video.url || `https://www.youtube.com/watch?v=${video.youtube_video_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline inline-flex items-center"
                        >
                          Ver Video
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </td>
                      <td className="px-6 py-5 text-sm">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <span className="w-2 h-2 mr-1.5 bg-green-500 rounded-full"></span>
                          Procesado
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
