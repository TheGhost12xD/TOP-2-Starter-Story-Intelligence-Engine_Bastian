import './globals.css';
import type { Metadata } from 'next';
import { 
  LayoutDashboard, 
  Database, 
  Video, 
  Target, 
  Compass, 
  Lightbulb, 
  FlaskConical, 
  Settings 
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SS Starter Story LATAM',
  description: 'Business Intelligence Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-zinc-950 text-zinc-400 min-h-screen flex font-sans selection:bg-indigo-500/30">
        
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col h-screen sticky top-0 hidden md:flex">
          <div className="h-20 flex items-center px-6 border-b border-zinc-800/50">
            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-sm mr-3 shadow-lg shadow-indigo-600/20">
              SS
            </div>
            <span className="text-zinc-100 font-semibold tracking-tight text-sm">
              Starter Story <span className="text-zinc-500 font-normal">LATAM</span>
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
            <nav className="space-y-8">
              {/* INICIO */}
              <div>
                <h3 className="px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">Inicio</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="/" className="flex items-center px-3 py-2 text-sm font-medium text-zinc-100 bg-zinc-800/40 rounded-md border border-zinc-800/50">
                      <LayoutDashboard className="w-4 h-4 mr-3 text-indigo-400" />
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>

              {/* FASE 1 */}
              <div>
                <h3 className="px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">Fase 1 — Scraping</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="/scraper-logs" className="flex items-center px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-md transition-colors">
                      <Database className="w-4 h-4 mr-3" />
                      Scraper & Logs
                    </Link>
                  </li>
                  <li>
                    <Link href="/videos" className="flex items-center px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-md transition-colors">
                      <Video className="w-4 h-4 mr-3" />
                      Videos
                    </Link>
                  </li>
                </ul>
              </div>

              {/* FASE 3 */}
              <div>
                <h3 className="px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">Fase 3 — Clasificación</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="#" className="flex items-center px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-md transition-colors">
                      <Target className="w-4 h-4 mr-3" />
                      Pain Points LATAM
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="flex items-center px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-md transition-colors">
                      <Compass className="w-4 h-4 mr-3" />
                      Wizard RPM
                    </Link>
                  </li>
                </ul>
              </div>

              {/* FASE 4 */}
              <div>
                <h3 className="px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">Fase 4 — Soluciones</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="#" className="flex items-center px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-md transition-colors">
                      <Lightbulb className="w-4 h-4 mr-3" />
                      Motor de Soluciones
                    </Link>
                  </li>
                </ul>
              </div>

              {/* FASE 5 */}
              <div>
                <h3 className="px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">Fase 5 — Validación</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="#" className="flex items-center px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-md transition-colors">
                      <FlaskConical className="w-4 h-4 mr-3" />
                      MVT
                    </Link>
                  </li>
                </ul>
              </div>

              {/* SISTEMA */}
              <div>
                <h3 className="px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">Sistema</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="#" className="flex items-center px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-md transition-colors">
                      <Settings className="w-4 h-4 mr-3" />
                      Ajustes
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]">
          {children}
        </main>
      </body>
    </html>
  );
}
