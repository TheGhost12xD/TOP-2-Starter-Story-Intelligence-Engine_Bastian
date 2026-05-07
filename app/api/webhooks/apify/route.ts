import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';
import { supabaseAdmin } from '@/lib/supabaseClient';

// Extraer el ID real de YouTube de varias formas de URL
function extractVideoId(url: string): string {
  if (!url) return '';
  const match = url.match(/(?:v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([^&?]+)/);
  return match ? match[1] : url;
}

// Extraer la transcripción de las posibles formas que devuelve Apify
function getTranscript(item: any): string {
  if (item.text) return item.text;
  if (item.transcript) return item.transcript;
  if (Array.isArray(item.subtitles)) {
    return item.subtitles.map((s: any) => s.text).join(' ');
  }
  return '';
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const { defaultDatasetId } = payload.resource || {};
    if (!defaultDatasetId) {
      return NextResponse.json({ error: 'Falta defaultDatasetId en el webhook' }, { status: 400 });
    }

    if (!process.env.APIFY_API_TOKEN) {
      console.error("Falta APIFY_API_TOKEN");
      return NextResponse.json({ error: 'Configuración incompleta' }, { status: 500 });
    }

    const client = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    });

    // Obtener los datos extraídos por el actor
    const { items } = await client.dataset(defaultDatasetId).listItems();
    
    let processedCount = 0;

    for (const item of items) {
      // Mapear los datos según la lógica estricta solicitada
      const rawUrl = (item.url || item.videoUrl || '') as string;
      const youtube_video_id = extractVideoId(rawUrl);
      const title = item.title || item.video_title || '';
      const transcript = getTranscript(item);

      // Si falta el ID del video o la transcripción, ignoramos el item
      if (!youtube_video_id || !transcript) {
        console.log(`[Webhook] Omitiendo item incompleto. Video ID: ${youtube_video_id}`);
        continue;
      }

      // Upsert estricto a Supabase usando supabaseAdmin (Service Role Key)
      const { error } = await supabaseAdmin
        .from('videos')
        .upsert(
          { youtube_video_id, title, transcript },
          { onConflict: 'youtube_video_id' }
        );

      if (error) {
        console.error(`[Webhook] Error de Supabase al guardar ${youtube_video_id}:`, error.message);
      } else {
        processedCount++;
      }
    }

    // Retorna status 200 siempre al final de un proceso exitoso
    return NextResponse.json({ success: true, processed: processedCount }, { status: 200 });

  } catch (error) {
    console.error('[Webhook] Error crítico procesando dataset:', error);
    // Devuelve status 200 incluso si hay fallo para que Apify no siga reintentando indefinidamente
    return NextResponse.json({ success: false, error: 'Proceso abortado' }, { status: 200 });
  }
}
