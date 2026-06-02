import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';
import Groq from 'groq-sdk';

export async function POST(request: Request) {
  let run_id = 'unknown';
  try {
    const payload = await request.json();

    const { defaultDatasetId, id } = payload.resource || {};
    run_id = id || defaultDatasetId || crypto.randomUUID();

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

      let ai_analysis = null;

      try {
        if (process.env.GROQ_API_KEY) {
          const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
          const truncatedTranscript = transcript.substring(0, 6000);
          
          const completion = await groq.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: "Eres un analista de negocios. Lee la siguiente transcripción de un video de Starter Story y devuelve ÚNICAMENTE un objeto JSON válido con las siguientes llaves: 'business_model' (string breve), 'revenue' (string con el ingreso mencionado, o 'No especificado'), 'problem_solved' (string corto), y 'key_strategy' (string corto). No incluyas markdown ni texto adicional."
              },
              {
                role: 'user',
                content: truncatedTranscript
              }
            ],
            model: 'llama3-8b-8192',
            temperature: 0.1,
            response_format: { type: 'json_object' }
          });

          const content = completion.choices[0]?.message?.content;
          if (content) {
            ai_analysis = JSON.parse(content);
          }
        } else {
          console.log('[Webhook] GROQ_API_KEY no configurada, omitiendo análisis IA');
        }
      } catch (aiError) {
        console.error(`[Webhook] Error al procesar IA para ${youtube_video_id}:`, aiError);
        ai_analysis = { error: 'Groq API error or parsing failed' };
      }

      // Upsert estricto a Supabase usando supabaseAdmin (Service Role Key)
      const { error } = await supabaseAdmin
        .from('videos')
        .upsert(
          { youtube_video_id, title, transcript, ai_analysis },
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

    // Guardar el log en scraping_logs
    const { error: logError } = await supabaseAdmin
      .from('scraping_logs')
      .insert({
        run_id,
        status: 'success',
        videos_processed: processedCount
      });

    if (logError) {
      console.error('[Webhook] Error guardando log en scraping_logs:', logError.message);
    }

    // Revalidar la vista de logs
    revalidatePath('/scraper-logs');

    return NextResponse.json({ success: true, processed: processedCount }, { status: 200 });

  } catch (error) {
    console.error('[Webhook] Error crítico procesando dataset:', error);
    
    // Registrar error en scraping_logs si es posible
    if (run_id !== 'unknown') {
      await supabaseAdmin.from('scraping_logs').insert({
        run_id,
        status: 'error',
        videos_processed: 0
      });
      revalidatePath('/scraper-logs');
    }

    return NextResponse.json({ success: false, error: 'Proceso abortado' }, { status: 200 });
  }
}
