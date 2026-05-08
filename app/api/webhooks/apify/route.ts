import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';
import { supabaseAdmin } from '@/lib/supabaseClient';

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
      // 1. Imprimir la estructura exacta para debuggear en Vercel
      console.log('Estructura del item:', JSON.stringify(item));

      // 2. Extracción de ID a prueba de balas
      let video_id = item.id || item.videoId || '';
      const rawUrl = (item.videoUrl || item.url || '') as string;
      
      if (!video_id && rawUrl) {
        try {
          const urlObj = new URL(rawUrl);
          video_id = urlObj.searchParams.get('v') || '';
        } catch (e) {
          // Ignorar si no es una URL válida para new URL()
        }
      }

      if (!video_id && rawUrl) {
        // Fallback final con Regex para youtu.be o shorts
        const match = rawUrl.match(/(?:v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([^&?]+)/);
        if (match) video_id = match[1];
      }

      // 3. Extracción de Transcripción (Soporta si es string o array)
      let transcript = item.text || item.transcript || '';
      if (!transcript && item.subtitles) {
        transcript = Array.isArray(item.subtitles) 
          ? item.subtitles.map((s: any) => s.text || s).join(' ') 
          : item.subtitles;
      }

      // 4. Extracción de Título
      const title = item.title || item.videoTitle || 'Sin título';

      // Validación final
      if (!video_id || !transcript) {
        console.log(`[Webhook] Omitiendo item incompleto. Video ID: ${video_id || 'indefinido'}`);
        continue;
      }

      // 5. Upsert a Supabase
      const { error } = await supabaseAdmin
        .from('videos')
        .upsert(
          { youtube_video_id: video_id, title, transcript },
          { onConflict: 'youtube_video_id' }
        );

      if (error) {
        console.error(`[Webhook] Error de Supabase al guardar ${video_id}:`, error.message);
      } else {
        console.log(`[Webhook] Éxito guardando video: ${video_id}`);
        processedCount++;
      }
    }

    return NextResponse.json({ success: true, processed: processedCount }, { status: 200 });

  } catch (error) {
    console.error('[Webhook] Error crítico procesando dataset:', error);
    return NextResponse.json({ success: false, error: 'Proceso abortado' }, { status: 200 });
  }
}
