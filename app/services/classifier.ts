import Groq from 'groq-sdk';

export async function classifyVideo(videoAiAnalysis: any, painPointsArray: any[]) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('Falta configuración de Groq API (GROQ_API_KEY)');
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  
  const userPrompt = `
Análisis del Video (Modelo de Negocio):
${JSON.stringify(videoAiAnalysis, null, 2)}

Lista de Problemas (Pain Points) en LATAM:
${JSON.stringify(painPointsArray, null, 2)}
  `.trim();

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: "Eres un motor de match. Compara el modelo de negocio de este video con esta lista de problemas (pain points) de LATAM. Devuelve ÚNICAMENTE un JSON con un array llamado 'matches', donde cada objeto tenga 'pain_point_id', 'relevance_score' (1-100), y 'justification' (1 oración)."
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;
    if (content) {
      return JSON.parse(content);
    }
    
    return { matches: [] };
  } catch (error) {
    console.error('[Classifier Service] Error al clasificar el video:', error);
    throw new Error('Fallo en el servicio de clasificación dinámica');
  }
}
