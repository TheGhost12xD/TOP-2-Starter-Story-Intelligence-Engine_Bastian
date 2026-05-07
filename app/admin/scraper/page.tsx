import { supabaseAdmin } from '@/lib/supabaseClient';
import ScrapeButton from './ScrapeButton';

// Forzamos a que sea dinámica para que siempre obtenga los datos más recientes en cada recarga
export const dynamic = 'force-dynamic';

export default async function ScraperAdminPage() {
  // Obtenemos el historial de ejecuciones desde Supabase
  const { data: logs, error } = await supabaseAdmin
    .from('scraping_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error cargando historial de scraping:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Panel de Administración de Scraping</h1>
        <p className="text-gray-600 mb-8">
          Controla y monitorea las ejecuciones del scraper de Starter Story.
        </p>

        {/* Botón Cliente */}
        <ScrapeButton />

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Historial de Ejecuciones</h2>
          
          {error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-md">
              No se pudo cargar el historial de ejecuciones.
            </div>
          ) : !logs || logs.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              Aún no hay ejecuciones registradas.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha y Hora
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Videos Procesados
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(log.created_at).toLocaleString('es-ES', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          log.status === 'success' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {log.status === 'success' ? 'Exitoso' : 'Error'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {log.videos_processed} {log.videos_processed === 1 ? 'video' : 'videos'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
