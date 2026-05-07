'use client';

import { useState } from 'react';

export default function ScrapeButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleScrape = async () => {
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/scraper/start', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Error al iniciar el scraper');
      }

      setStatus({ 
        type: 'success', 
        message: 'Scraping iniciado en background...' 
      });
    } catch (error) {
      console.error(error);
      setStatus({ 
        type: 'error', 
        message: 'Ocurrió un error al intentar iniciar el scraper.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <button
        onClick={handleScrape}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        {loading ? 'Iniciando...' : 'Iniciar Scraping Manual'}
      </button>

      {status.type === 'success' && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md border border-green-200">
          {status.message}
        </div>
      )}
      {status.type === 'error' && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md border border-red-200">
          {status.message}
        </div>
      )}
    </div>
  );
}
