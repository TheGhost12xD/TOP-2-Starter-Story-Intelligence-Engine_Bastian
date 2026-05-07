import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    
    // El frontend puede enviar un array directamente o un objeto con { urls: [...] }
    const inputUrls = Array.isArray(body) ? body : (body.urls || []);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

    if (!process.env.APIFY_API_TOKEN || !appUrl) {
      return NextResponse.json(
        { error: 'Faltan variables de entorno (APIFY_API_TOKEN o URL de la app)' },
        { status: 500 }
      );
    }

    const client = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    });

    const actorId = 'bbqmsPr0r519A0ZaV';
    const webhookUrl = `https://${appUrl}/api/webhooks/apify`;

    // Formateamos las URLs tal como las requiere el actor de Apify
    const actorInput = {
      startUrls: inputUrls.map((url: string) => ({ url }))
    };

    // AWAIT es estrictamente necesario en Vercel para no matar el proceso serverless
    const run = await client.actor(actorId).start(actorInput, {
      webhooks: [
        {
          eventTypes: ['ACTOR.RUN.SUCCEEDED'],
          requestUrl: webhookUrl,
          payloadTemplate: `{\n  "eventType": "{{eventType}}",\n  "eventData": {{eventData}},\n  "resource": {{resource}}\n}`,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: 'Scraping iniciado en background...',
      runId: run.id
    }, { status: 200 });

  } catch (error) {
    console.error('Error en la ruta disparadora del scraper:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: 'Error interno del servidor: ' + errorMessage }, { status: 500 });
  }
}
