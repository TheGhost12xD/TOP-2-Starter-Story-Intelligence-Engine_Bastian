import { NextResponse } from "next/server";
import { ApifyClient } from "apify-client";
// import { supabase } from "@/lib/supabase"; // Se descomentará en la fase de conectividad pura

export async function POST(req: Request) {
  try {
    const apifyToken = process.env.APIFY_API_TOKEN;
    if (!apifyToken) {
      return NextResponse.json({ error: "Falta configurar APIFY_API_TOKEN en .env" }, { status: 500 });
    }

    // 1. Obtener última fecha/estado de ejecución desde la DB (Supabase)
    // Esto garantiza extracción incremental (Solo nuevos videos)
    /*
      const { data: lastRun } = await supabase
        .from('execution_logs')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1);
    */

    // 2. Dado que el actor (bbqmsPr0r519A0ZaV) sólo acepta `videoUrl`,
    // calculamos los URLs de los videos de Starter Story lanzados *después* de `lastRun`.
    // (Este arreglo se llenaría consultando el RSS del canal de YouTube via fetch)
    const newVideoUrlsToProcess = [
      "https://www.youtube.com/watch?v=EjEMPLO_NUEVO_1" 
    ];

    if (newVideoUrlsToProcess.length === 0) {
      return NextResponse.json({ message: "No hay videos nuevos de Starter Story detectados desde la última ejecución." });
    }

    const client = new ApifyClient({ token: apifyToken });

    // 3. Configurar dinámicamente nuestra URL para recibir el Payload (Webhook)
    // En producción en Vercel, API_WEBHOOK_URL apuntará a midominio.com/api/webhooks/apify
    const webhookUrl = process.env.API_WEBHOOK_URL || "https://tu-dominio.com/api/webhooks/apify";

    // 4. Disparar (start) asincrónicamente el actor para los videos nuevos sin bloquear (No usamos `.call` porque traba el thread)
    const runPromises = newVideoUrlsToProcess.map(async (url) => {
      const input = { videoUrl: url };
      
      // .start() lanza la ejecución en la nube de Apify inmediatamente y retorna el objeto del job
      return await client.actor("bbqmsPr0r519A0ZaV").start(input, {
        webhooks: [
          {
            eventTypes: ["ACTOR.RUN.SUCCEEDED"],
            requestUrl: webhookUrl,
            payloadTemplate: `{"runId": "{{runId}}", "datasetId": "{{defaultDatasetId}}", "status": "{{status}}"}`
          }
        ]
      });
    });

    const results = await Promise.all(runPromises);

    // 5. Registrar el inicio de la corrida en la DB como PENDING (Opcional, útil para el log)
    
    return NextResponse.json({ 
      success: true, 
      message: `Se dispararon ${results.length} actores en background en Apify exitosamente.`,
      runs: results.map(r => r.id)
    });

  } catch (error: any) {
    console.error("Scraper start error:", error);
    return NextResponse.json({ error: "Falla al inicializar el actor: " + error.message }, { status: 500 });
  }
}
