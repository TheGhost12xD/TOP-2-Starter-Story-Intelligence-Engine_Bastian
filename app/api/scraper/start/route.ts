import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    
    // El frontend puede enviar un array directamente o un objeto con { urls: [...] }
    const inputUrls = Array.isArray(body) ? body : (body.urls || []);

    if (!process.env.APIFY_API_TOKEN || !process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json(
        { error: 'Faltan variables de entorno (APIFY_API_TOKEN o NEXT_PUBLIC_APP_URL)' },
        { status: 500 }
      );
    }

    const client = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    });

    const actorId = 'bbqmsPr0r519A0ZaV';
    const webhookUrl = `https://${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/apify`;

    // Formateamos las URLs tal como las requiere el actor de Apify
    const actorInput = {
      startUrls: inputUrls.map((url: string) => ({ url }))
    };

    // Iniciar el actor de forma asíncrona inyectando el webhook
    client.actor(actorId).start(actorInput, {
      webhooks: [
        {
          eventTypes: ['ACTOR.RUN.SUCCEEDED'],
          requestUrl: webhookUrl,
          payloadTemplate: `{\n  "eventType": "{{eventType}}",\n  "eventData": {{eventData}},\n  "resource": {{resource}}\n}`,
        },
      ],
    }).catch(error => {
      console.error('Error al iniciar el scraper en background:', error);
    });

    return NextResponse.json({
      success: true,
      message: 'Scraping iniciado en background...',
    }, { status: 200 });

  } catch (error) {
    console.error('Error en la ruta disparadora del scraper:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
