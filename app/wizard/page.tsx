'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Target, Lightbulb, Zap, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WizardRPM() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    results: '',
    purpose: '',
    massive_action_plan: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/rpm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al procesar el perfil RPM');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-6" />
        <h2 className="text-3xl font-bold text-zinc-100 mb-4">¡Perfil RPM Creado Exitosamente!</h2>
        <p className="text-zinc-400 max-w-md">
          Tu perfil ha sido analizado por nuestra IA y guardado. Te estamos redirigiendo al dashboard principal...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-8 min-h-[80vh] flex flex-col justify-center">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4 tracking-tight">
          Define tu Perfil RPM
        </h1>
        <p className="text-zinc-400">
          Resultados, Propósito y Plan de Acción Masiva. Define tu enfoque para encontrar los mejores casos de negocio.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between relative mb-12">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-800 -z-10 rounded-full" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-500 -z-10 rounded-full transition-all duration-300"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        />
        
        {[
          { num: 1, icon: Target, label: 'Resultados' },
          { num: 2, icon: Lightbulb, label: 'Propósito' },
          { num: 3, icon: Zap, label: 'Plan de Acción' },
        ].map((s) => {
          const isActive = step >= s.num;
          const isCurrent = step === s.num;
          const Icon = s.icon;
          return (
            <div key={s.num} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-zinc-950 transition-colors duration-300 ${isActive ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`mt-2 text-xs font-semibold ${isCurrent ? 'text-indigo-400' : isActive ? 'text-zinc-300' : 'text-zinc-600'}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-10 shadow-xl relative overflow-hidden">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center mb-4">
              <Target className="w-5 h-5 mr-3 text-indigo-400" />
              Resultados (Results)
            </h2>
            <p className="text-sm text-zinc-400 mb-6">
              ¿Cuál es el resultado específico y medible que deseas alcanzar? Piensa en qué quieres lograr de forma clara y concisa (ej. "Lanzar un MVP de SaaS que genere $1,000 MRR en 3 meses").
            </p>
            <textarea
              name="results"
              value={formData.results}
              onChange={handleChange}
              placeholder="Describe tu resultado esperado..."
              className="w-full h-40 bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center mb-4">
              <Lightbulb className="w-5 h-5 mr-3 text-emerald-400" />
              Propósito (Purpose)
            </h2>
            <p className="text-sm text-zinc-400 mb-6">
              ¿Por qué es importante esto para ti? El propósito es tu motor emocional. Escribe las razones fundamentales que te impulsan a lograr el resultado anterior.
            </p>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Describe tu propósito y motivaciones..."
              className="w-full h-40 bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
            />
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center mb-4">
              <Zap className="w-5 h-5 mr-3 text-amber-400" />
              Plan de Acción Masiva (Massive Action Plan)
            </h2>
            <p className="text-sm text-zinc-400 mb-6">
              ¿Qué acciones específicas y masivas tomarás para hacer este resultado realidad? Enumera los pasos clave o la estrategia general que seguirás.
            </p>
            <textarea
              name="massive_action_plan"
              value={formData.massive_action_plan}
              onChange={handleChange}
              placeholder="Describe tu plan de acción masiva..."
              className="w-full h-40 bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
            />
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-800">
          <button
            onClick={prevStep}
            disabled={step === 1 || isLoading}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              step === 1 ? 'opacity-0 pointer-events-none' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </button>

          {step < 3 ? (
            <button
              onClick={nextStep}
              className="flex items-center px-6 py-2.5 bg-zinc-100 text-zinc-900 font-semibold rounded-lg hover:bg-white transition-colors"
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando Perfil...
                </>
              ) : (
                'Finalizar y Procesar Perfil'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
