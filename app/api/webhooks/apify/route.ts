import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Verificamos si es un evento de éxito del actor
    if (payload.eventType !== 'ACTOR.RUN.SUCCEEDED') {
      return NextResponse.json({ message: 'Evento ignorado' }, { status: 200 });
    }

    const { defaultDatasetId } = payload.resource;
    if (!defaultDatasetId) {
      return NextResponse.json({ error: 'No se encontró datasetId en el webhook' }, { status: 400 });
    }

    if (!process.env.APIFY_API_TOKEN) {
      console.error('Falta APIFY_API_TOKEN');
      return NextResponse.json({ error: 'Configuración incompleta' }, { status: 500 });
    }

    // Inicializamos cliente de Apify para recuperar los datos
    const client = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    });

    // Obtenemos los items del dataset
    const { items } = await client.dataset(defaultDatasetId).listItems();

    // Procesamos e insertamos en Supabase siguiendo las reglas de gemini.md
    let processedCount = 0;

    for (const item of items) {
      // 4. Límites de Procesamiento: Filtrar sin transcripción
      if (!item.transcript) {
        console.log(`[Webhook] Saltando video ${item.youtube_video_id} - Sin transcripción`);
        continue;
      }
      
      // Filtrar por duración (si la provee el scraper, asumimos duración en segundos, > 3600 = más de 1 hora)
      if (item.duration && item.duration > 3600) {
        console.log(`[Webhook] Saltando video ${item.youtube_video_id} - Excede 1 hora`);
        continue;
      }

      const videoData = {
        youtube_video_id: item.youtube_video_id,
        title: item.title,
        description: item.description,
        transcript: item.transcript,
        views: item.views || 0,
        likes: item.likes || 0,
      };

      // 1. Tolerancia Cero a Duplicados (Upsert Strict)
      // Actualizamos las métricas si existe, sin duplicar.
      const { error } = await supabaseAdmin
        .from('videos')
        .upsert(videoData, { 
          onConflict: 'youtube_video_id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error(`[Webhook] Error guardando en Supabase el video ${item.youtube_video_id}:`, error);
      } else {
        console.log(`[Webhook] Video guardado/actualizado exitosamente: ${item.youtube_video_id}`);
        processedCount++;
      }
    }

    // Insertamos el registro en la tabla scraping_logs
    const { error: logError } = await supabaseAdmin
      .from('scraping_logs')
      .insert({
        status: 'success',
        videos_processed: processedCount,
      });

    if (logError) {
      console.error('[Webhook] Error guardando en scraping_logs:', logError);
    }

    return NextResponse.json({ success: true, processed: processedCount }, { status: 200 });

  } catch (error) {
    console.error('[Webhook] Error procesando el webhook de Apify:', error);
    return NextResponse.json(
      { error: 'Error interno procesando webhook' },
      { status: 500 }
    );
  }
}
