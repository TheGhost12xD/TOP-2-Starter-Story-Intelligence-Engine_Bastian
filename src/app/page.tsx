export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Dashboard de Starter Story LATAM
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Monitor de análisis de negocios, scraping y clasificación.
          </p>
        </header>

        {/* Modules Grid (Placeholders) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card: Log del Scraper */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-64">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700 flex items-center">
              <span className="mr-2">①</span> Log del Scraper
            </h2>
            <div className="flex-1 bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-500">
              [Esperando datos del scraper...]
            </div>
          </section>

          {/* Card: Resultados Base de Datos */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-64">
            <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
              <span className="mr-2">②</span> Base de Datos
            </h2>
            <div className="flex-1 bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-500">
              [Conexión a BD pendiente...]
            </div>
          </section>

          {/* Card: Clasificador */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-64">
            <h2 className="text-xl font-semibold mb-4 text-emerald-700 flex items-center">
              <span className="mr-2">③</span> Clasificador
            </h2>
            <div className="flex-1 bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-500">
              [Métricas de clasificación...]
            </div>
          </section>

          {/* Card: Perfil RPM */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-64">
            <h2 className="text-xl font-semibold mb-4 text-amber-700 flex items-center">
              <span className="mr-2">④</span> Perfil RPM
            </h2>
            <div className="flex-1 bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-500">
              [Perfiles generados...]
            </div>
          </section>

          {/* Card: Motor de Soluciones */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-64 md:col-span-2 lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4 text-purple-700 flex items-center">
              <span className="mr-2">⑤</span> Motor de Soluciones
            </h2>
            <div className="flex-1 bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-500">
              [Recomendaciones del motor...]
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
