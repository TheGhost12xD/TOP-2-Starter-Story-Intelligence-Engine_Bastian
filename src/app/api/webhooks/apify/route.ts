import { NextResponse } from "next/server";
import { ApifyClient } from "apify-client";
// import { supabase } from "@/lib/supabase"; // Se habilitará luego

export async function POST(req: Request) {
  try {
    const apifyToken = process.env.APIFY_API_TOKEN;
    if (!apifyToken) return NextResponse.json({ error: "Falta APIFY_API_TOKEN" }, { status: 500 });

    // 1. Recibir y parsear el payload enviado por Apify
    const payload = await req.json();
    console.log("Webhook de Apify recibido:", payload);

    const { runId, datasetId, status } = payload;
    
    if (!datasetId || status !== "SUCCEEDED") {
      // Registraríamos el fallo en la base de datos (Regla: Self-Annealing / Logeo exhaustivo)
      // await supabase.from('execution_logs').insert({ run_id: runId, status: 'FAILED' });
      return NextResponse.json({ error: "Payload inválido o ejecución de actor fallida." }, { status: 400 });
    }

    const client = new ApifyClient({ token: apifyToken });

    // 2. Extraer el Dataset generado por la ejecución completada
    const dataset = await client.dataset(datasetId).listItems();
    const items = dataset.items;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: true, message: "El dataset de la transcripción está vacío." });
    }

    // 3. Procesar JSON: Formatear las transcripciones hacia la estructura deseada para persistir
    const processedTranscripts = items.map((item: any) => ({
      source_video_id: item.url || item.videoUrl || "unknown",
      transcript: item.transcript || item.text || "",
      metadata: item
    }));

    // 4. Persistencia REAL (Módulo 2): Almacenar en PostgreSQL / Supabase
    /*
    const { error: dbError } = await supabase
      .from('videos_processed')
      .insert(processedTranscripts);

    if (dbError) throw new Error(dbError.message);
    */

    // 5. Actualizar Log de Ejecuciones en la DB
    /*
    await supabase.from('execution_logs').insert({
       run_id: runId,
       status: 'SUCCESS',
       videos_found: processedTranscripts.length,
       errors: 0
    });
    */

    return NextResponse.json({ success: true, insertedRecords: processedTranscripts.length });

  } catch (error: any) {
    console.error("Error al procesar el Webhook de Apify:", error);
    
    // Anotar el error grave en la Base de datos
    /*
    await supabase.from('execution_logs').insert({ 
      status: 'FAILED', 
      errors: 1, 
      message: error.message 
    });
    */

    return NextResponse.json({ error: "Error en el procesamiento del Webhook." }, { status: 500 });
  }
}
