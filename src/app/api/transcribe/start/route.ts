import { NextResponse } from "next/server";
import { ApifyClient } from "apify-client";

export async function POST(req: Request) {
  try {
    const { videoUrl } = await req.json();
    
    if (!videoUrl) {
      return NextResponse.json({ error: "La URL del video es requerida" }, { status: 400 });
    }

    const apifyToken = process.env.APIFY_API_TOKEN;
    if (!apifyToken) {
      return NextResponse.json({ error: "API Key de Apify no configurada" }, { status: 500 });
    }

    const client = new ApifyClient({ token: apifyToken });

    // Iniciar la extracción en background sin bloquear la respuesta (start() en lugar de call())
    const input = { videoUrl };
    const run = await client.actor('bbqmsPr0r519A0ZaV').start(input);

    // Devolver un status 200 y el runId hacia el Frontend
    return NextResponse.json({ runId: run.id }, { status: 200 });
  } catch (error: any) {
    console.error("Error iniciando transcripción:", error);
    return NextResponse.json({ error: error.message || "Error al iniciar el Actor de Apify" }, { status: 500 });
  }
}
