'use client';

import { useState } from 'react';

export default function ImportForm() {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Iniciando scraper para:', url);
    // Aquí luego conectaremos con /api/scraper/start
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <input 
        type="url" 
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Pega la URL de YouTube aquí (ej: https://www.youtube.com/watch?v=...)" 
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow text-gray-800"
        required
      />
      <button 
        type="submit" 
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap"
      >
        Ejecutar Análisis con IA
      </button>
    </form>
  );
}
