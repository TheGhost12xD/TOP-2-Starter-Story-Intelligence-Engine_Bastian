"use client";

import { useState, useRef, useEffect } from "react";

export default function TranscribePage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState("");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Asegura limpieza del polling al desmontar
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const startTranscription = async () => {
    // Limpiamos los estados
    setError("");
    setTranscript("");
    setLoading(true);
    setStatus("Iniciando...");

    if (!videoUrl || (!videoUrl.includes("youtube.com") && !videoUrl.includes("youtu.be"))) {
      setError("Por favor ingresa una URL de YouTube válida.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/transcribe/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Fallo al iniciar el scraper.");
      }

      setStatus("Extrayendo datos en Apify...");
      const runId = data.runId;

      // Iniciar el polling cada 5 segundos al endpoint de status
      pollIntervalRef.current = setInterval(async () => {
        await checkStatus(runId);
      }, 5000);

    } catch (e: any) {
      setError(e.message);
      setLoading(false);
      setStatus("");
    }
  };

  const checkStatus = async (runId: string) => {
    try {
      const res = await fetch(`/api/transcribe/status/${runId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Falla de red consultando el estado.");
      }

      setStatus(`Estado en Apify: ${data.status}...`);

      if (data.status === "SUCCEEDED") {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        setTranscript(data.transcript || "Transcripción finalizada (vacía)");
        setStatus("¡Transcripción finalizada de forma exitosa!");
        setLoading(false);
      } else if (data.status === "FAILED" || data.status === "ABORTED" || data.status === "TIMED-OUT") {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        throw new Error(`El proceso de Apify detuvo ejecución con estado: ${data.status}`);
      }
    } catch (e: any) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      setError(e.message);
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center">Extractor de Transcripciones (Polling Engine)</h1>
          <p className="mt-2 text-center text-gray-600 dark:text-gray-400">Analiza videos individuales consultando al Actor akash9078 en background.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL del Video de YouTube</label>
              <input
                type="text"
                id="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="mt-2 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-3 border outline-none font-mono"
              />
            </div>

            <button
              onClick={startTranscription}
              disabled={loading}
              className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-md font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Procesando Servidor..." : "Transcribir"}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 text-sm text-red-700 bg-red-100 rounded-xl font-medium border border-red-200 shadow-sm">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {status && !error && (
            <div className="mt-6 p-4 text-sm text-blue-700 bg-blue-50 rounded-xl font-bold flex items-center gap-3 border border-blue-200">
              {loading && <div className="w-5 h-5 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
              {status}
            </div>
          )}

          {transcript && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Resultado Extraído:</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto shadow-inner text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap font-serif leading-relaxed">
                {transcript}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
