import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Validamos el evento del webhook
    if (payload.eventType !== 'ACTOR.RUN.SUCCEEDED') {
      return NextResponse.json({ message: 'Evento ignorado' }, { status: 200 });
    }

    const { defaultDatasetId } = payload.resource;
    if (!defaultDatasetId) {
      return NextResponse.json({ error: 'Falta defaultDatasetId' }, { status: 400 });
    }

    if (!process.env.APIFY_API_TOKEN) {
      return NextResponse.json({ error: 'Falta APIFY_API_TOKEN' }, { status: 500 });
    }

    const client = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    });

    // Descargar los ítems (JSON)
    const { items } = await client.dataset(defaultDatasetId).listItems();
    let processedCount = 0;

    for (const item of items) {
      // Adaptamos la extracción a los campos especificados: video_id, video_title, transcript
      const video_id = item.video_id || item.youtube_video_id || item.id;
      const video_title = item.video_title || item.title;
      const transcript = item.transcript || item.text;

      // Generar la URL completa del video
      const fullUrl = video_id ? `https://www.youtube.com/watch?v=${video_id}` : '';

      // Filtro estricto según gemini.md: Sin transcripción se ignora
      if (!transcript) {
        console.log(`[Webhook] Saltando video ${video_id} - Sin transcripción`);
        continue;
      }

      // Si tenemos duración, aplicamos el filtro de 1 hora (> 3600 seg)
      if (item.duration && Number(item.duration) > 3600) {
        console.log(`[Webhook] Saltando video ${video_id} - Excede 1 hora de duración`);
        continue;
      }

      // Estructuramos los datos para Supabase. 
      // Se asume que el esquema usa youtube_video_id y title basado en gemini.md.
      // (Si el schema cambió para requerir 'url' también, la agregamos al payload).
      const videoData = {
        youtube_video_id: video_id,
        title: video_title,
        description: item.description || item.video_description || '',
        transcript: transcript,
        views: item.views || item.view_count || 0,
        likes: item.likes || item.like_count || 0,
        // Agregamos la URL generada por si se guardara en DB o fuera útil después
        url: fullUrl,
      };

      // Realizamos upsert con Service Role Key (supabaseAdmin)
      const { error } = await supabaseAdmin
        .from('videos')
        .upsert(videoData, { 
          onConflict: 'youtube_video_id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error(`[Webhook] Error al hacer upsert de ${video_id}:`, error);
      } else {
        processedCount++;
      }
    }

    // Registrar en scraping_logs
    await supabaseAdmin.from('scraping_logs').insert({
      status: 'success',
      videos_processed: processedCount,
    });

    return NextResponse.json({ success: true, processed: processedCount }, { status: 200 });

  } catch (error) {
    console.error('[Webhook] Error crítico:', error);
    return NextResponse.json({ error: 'Error interno procesando webhook' }, { status: 500 });
  }
}
