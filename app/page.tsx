'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Play, CheckCircle2, Circle, ChevronRight } from 'lucide-react';

// Inicializamos cliente Supabase público
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [videosCount, setVideosCount] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { count } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true });
      
      if (count !== null) setVideosCount(count);
    } catch (e) {
      console.error('Error fetching stats', e);
    }
  };

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return;

    setIsScraping(true);
    setStatusMsg('');

    try {
      const response = await fetch('/api/scraper/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: [videoUrl] }),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      alert('Scraping iniciado en background. Apify está trabajando y los datos se guardarán en Supabase al terminar.');
      setVideoUrl('');
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al intentar iniciar la extracción.');
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
      
      {/* Header / Hero Card */}
      <section className="relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800/80 p-8 md:p-12">
        {/* Glow sutil */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300 mb-6">
            v0.4 - Etapa 4 desplegada
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4 tracking-tight">
            Encuentra tu próxima idea de negocio en LATAM
          </h1>
          <p className="text-zinc-400 max-w-3xl text-base md:text-lg leading-relaxed">
            Esta app extrae los videos de Starter Story, los clasifica contra pain points reales del mercado latinoamericano y los cruza con tu perfil RPM para proponer soluciones viables.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'VIDEOS', value: videosCount || 10 },
          { label: 'ANALIZADOS (IA)', value: videosCount || 10 },
          { label: 'PAIN POINTS', value: 40 },
          { label: 'CLASIFICACIONES', value: 52 },
          { label: 'SOLUCIONES', value: 0 },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-950 rounded-xl border border-zinc-800 p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors">
            <h3 className="text-[10px] font-semibold text-zinc-500 tracking-wider mb-3">{stat.label}</h3>
            <p className="text-3xl font-bold text-zinc-100">{stat.value}</p>
          </div>
        ))}
      </section>

      {/* 2 Columns Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Columna Izquierda: Última Ejecución */}
        <div className="bg-zinc-950 rounded-xl border border-zinc-800 flex flex-col overflow-hidden">
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-base font-semibold text-zinc-100 flex items-center">
                <Play className="w-4 h-4 mr-2 text-zinc-400" />
                Última ejecución
              </h2>
              <div className="flex items-center space-x-3">
                <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded">
                  running
                </span>
                <span className="text-xs text-zinc-500">
                  {new Date().toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div>
                <p className="text-[10px] font-medium text-zinc-500 mb-1 uppercase tracking-wider">Encontrados</p>
                <p className="text-2xl font-semibold text-zinc-100">0</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-zinc-500 mb-1 uppercase tracking-wider">Nuevos</p>
                <p className="text-2xl font-semibold text-indigo-400">0</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-zinc-500 mb-1 uppercase tracking-wider">Actualizados</p>
                <p className="text-2xl font-semibold text-zinc-100">0</p>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-zinc-800/50">
              <h3 className="text-sm font-medium text-zinc-300 mb-3">Ejecutar Extracción Manual</h3>
              <form onSubmit={handleExtract} className="flex gap-2">
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow placeholder:text-zinc-600"
                  required
                  disabled={isScraping}
                />
                <button
                  type="submit"
                  disabled={isScraping}
                  className="bg-zinc-100 hover:bg-white text-zinc-900 font-medium px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50"
                >
                  {isScraping ? 'Iniciando...' : 'Extraer'}
                </button>
              </form>
              {statusMsg && (
                <p className={`mt-3 text-xs font-medium ${statusMsg.includes('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
                  {statusMsg}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Próximos Pasos */}
        <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-base font-semibold text-zinc-100 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 text-zinc-400" />
              Próximos pasos
            </h2>
          </div>

          <div className="flex flex-col">
            {[
              { title: 'Configura tus claves', desc: 'Apify y Anthropic en Ajustes', done: true },
              { title: 'Scrapea videos', desc: '10/30 videos - objetivo de la entrega', done: true },
              { title: 'Análisis IA', desc: '10 con análisis', done: true },
              { title: 'Completa tu RPM', desc: 'Define Results, Purpose, Massive Action', done: true },
              { title: 'Clasifica vs pain points LATAM', desc: '52 clasificaciones', done: true },
              { title: 'Genera soluciones', desc: 'Cruza pain points + RPM + videos', done: false },
            ].map((step, idx, arr) => (
              <div key={idx} className={`relative flex items-center p-4 hover:bg-zinc-900/50 transition-colors cursor-pointer ${idx !== arr.length - 1 ? 'border-b border-zinc-800/50' : ''}`}>
                <div className="mr-4 flex-shrink-0">
                  {step.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-zinc-700 flex items-center justify-center">
                      <span className="text-[10px] text-zinc-500 font-medium">{idx + 1}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-medium truncate ${step.done ? 'text-zinc-300' : 'text-zinc-100'}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-0.5 truncate">{step.desc}</p>
                </div>
                <div className="ml-4 flex-shrink-0 text-zinc-600">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}
