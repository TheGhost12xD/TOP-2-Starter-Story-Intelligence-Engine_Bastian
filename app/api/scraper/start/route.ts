import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';

export async function POST(request: Request) {
  try {
    // Obtenemos los parámetros de la solicitud si los hay (por ejemplo, las URLs a scrapear)
    const body = await request.json().catch(() => ({}));

    // Verificamos las variables de entorno requeridas
    if (!process.env.APIFY_API_TOKEN) {
      return NextResponse.json(
        { error: 'Falta la variable de entorno APIFY_API_TOKEN' },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json(
        { error: 'Falta la variable de entorno NEXT_PUBLIC_APP_URL' },
        { status: 500 }
      );
    }

    // Inicializamos el cliente de Apify
    const client = new ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    });

    const actorId = 'bbqmsPr0r519A0ZaV';
    
    // Configuración del webhook a donde Apify llamará cuando termine
    const webhookUrl = `https://${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/apify`;

    // Lanzamos la llamada de forma asíncrona sin hacer await (o usando .start para obtener el ID de corrida rápido sin bloquear)
    // Para inyectar webhooks, pasamos un objeto de opciones como segundo parámetro.
    client.actor(actorId).start(body, {
      webhooks: [
        {
          eventTypes: ['ACTOR.RUN.SUCCEEDED'],
          requestUrl: webhookUrl,
          payloadTemplate: `{\n  "eventType": "{{eventType}}",\n  "eventData": {{eventData}},\n  "resource": {{resource}}\n}`,
        },
      ],
    }).catch(error => {
      console.error('Error al iniciar el scraper de Apify en background:', error);
    });

    // Retornamos un 200 rápido confirmando que el proceso comenzó
    return NextResponse.json({
      success: true,
      message: 'Scraping iniciado en segundo plano. Los resultados se procesarán mediante webhook.',
      webhookUrl: webhookUrl
    }, { status: 200 });

  } catch (error) {
    console.error('Error procesando la solicitud del scraper:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al iniciar el scraper' },
      { status: 500 }
    );
  }
}
