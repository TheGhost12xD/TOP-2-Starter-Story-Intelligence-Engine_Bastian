import { NextResponse } from "next/server";
import { ApifyClient } from "apify-client";

export async function GET(
  req: Request,
  { params }: { params: { runId: string } }
) {
  try {
    const runId = params.runId;
    if (!runId) {
      return NextResponse.json({ error: "Falta el runId" }, { status: 400 });
    }

    const apifyToken = process.env.APIFY_API_TOKEN;
    if (!apifyToken) {
      return NextResponse.json({ error: "API Key de Apify no configurada" }, { status: 500 });
    }

    const client = new ApifyClient({ token: apifyToken });

    // Consultar estado en tiempo real del run usando get()
    const run = await client.run(runId).get();
    
    if (!run) {
      return NextResponse.json({ error: "Run no encontrado" }, { status: 404 });
    }

    if (run.status === 'SUCCEEDED') {
      const datasetId = run.defaultDatasetId;
      if (!datasetId) {
        return NextResponse.json({ error: "No se encontró el dataset asociado al run." }, { status: 500 });
      }

      // Obtener resultados del dataset
      const dataset = await client.dataset(datasetId).listItems();
      const items = dataset.items;

      if (!items || items.length === 0) {
        return NextResponse.json({ status: run.status, message: "El dataset está vacío." }, { status: 200 });
      }

      // Recuperar el texto (akash9078 guarda los textos generalmente en .transcript o .text)
      const transcriptData = items[0]?.transcript || items[0]?.text || items[0]?.captionUrl || "No se pudo extraer el texto de la estructura del dataset.";
      
      // Enviamos payload de completado
      return NextResponse.json({ status: run.status, transcript: transcriptData, metadata: items[0] }, { status: 200 });
    }

    // Si aún está extrayendo (RUNNING, READY, etc.)
    return NextResponse.json({ status: run.status }, { status: 200 });

  } catch (error: any) {
    console.error("Error obteniendo estado del Run en Apify:", error);
    return NextResponse.json({ error: error.message || "Falla al consultar el estado" }, { status: 500 });
  }
}
