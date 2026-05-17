import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

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
      console.log('Estructura del item:', JSON.stringify(item));

      const youtube_video_id = item.video_id;
      const title = item.video_title || 'Sin título';
      const transcript = item.transcript || '';

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
        console.log(`[Webhook] Éxito guardando video: ${youtube_video_id}`);
        processedCount++;
        revalidatePath('/');
        revalidatePath('/videos');
      }
    }

    return NextResponse.json({ success: true, processed: processedCount }, { status: 200 });

  } catch (error) {
    console.error('[Webhook] Error crítico procesando dataset:', error);
    return NextResponse.json({ success: false, error: 'Proceso abortado' }, { status: 200 });
  }
}
