"use client";

import { useState, useEffect } from "react";

export default function ScraperAdminPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState("24");

  const fetchLogs = async () => {
    // Aquí invocaremos la API que hace la consulta a Supabase (execution_logs)
    // Por motivos de UI, mockearemos el estado temporalmente.
    setLogs([
      { id: 1, date: new Date().toISOString(), status: "SUCCESS", found: 4, errors: 0 }
    ] as any);
  };

  useEffect(() => { 
    fetchLogs(); 
  }, []);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/scraper/start", { method: "POST" });
      const data = await res.json();
      
      if(res.ok) {
        alert("¡Ejecución disparada en Apify asíncronamente! " + data.message);
        fetchLogs();
      } else {
        alert("Error iniciando el scraper: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Falla de red al conectar con el backend.");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Panel Controlador del Scraper</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Gestiona las ejecuciones en background de Apify sobre el canal de Starter Story.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4">Configuración de Scheduling</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Ejecutar automáticamente cada (horas)</label>
            <input 
              type="number" 
              className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" 
              value={schedule} 
              onChange={(e) => setSchedule(e.target.value)} 
            />
          </div>
          <button className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Guardar Cron Job
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Disparador Manual de Prueba</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Inicia inmediatamente una corrida asíncrona hacia akash9078/youtube-transcript-extractor.</p>
        </div>
        <button 
          disabled={loading}
          onClick={handleStart}
          className="bg-green-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50 flex-shrink-0"
        >
          {loading ? "Ejecutando Actor..." : "▶ Iniciar Extracción Ahora"}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <h2 className="text-xl font-bold p-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">Log de Ejecuciones</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Timestamp</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Estado</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Videos Extraídos</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Errores</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any) => (
                <tr key={log.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="p-4 text-gray-800 dark:text-gray-200">{new Date(log.date).toLocaleString()}</td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full dark:bg-green-900 dark:text-green-300">
                      {log.status}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{log.found}</td>
                  <td className="p-4 text-red-600 font-bold">{log.errors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
