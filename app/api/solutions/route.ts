import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import Groq from 'groq-sdk';

export async function GET() {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Falta configuración de Groq API' }, { status: 500 });
    }

    // 1. Obtener videos (sólo necesitamos ai_analysis y títulos)
    const { data: videos, error: videosError } = await supabaseAdmin
      .from('videos')
      .select('title, youtube_video_id, ai_analysis')
      .not('ai_analysis', 'is', null)
      .limit(30);

    if (videosError) throw videosError;

    // 2. Obtener pain points
    const { data: painPoints, error: painPointsError } = await supabaseAdmin
      .from('pain_points')
      .select('*');

    if (painPointsError) throw painPointsError;

    // 3. Obtener el perfil RPM más reciente
    const { data: rpmProfile, error: rpmError } = await supabaseAdmin
      .from('rpm_profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (rpmError && rpmError.code !== 'PGRST116') { // PGRST116 es "no rows returned", lo manejamos suave
      throw rpmError;
    }

    if (!rpmProfile) {
      return NextResponse.json({ error: 'No hay un perfil RPM creado. Por favor completa el Wizard RPM primero.' }, { status: 400 });
    }

    // 4. Preparar el Prompt
    const systemPrompt = "Eres un estratega de producto B2B. Cruza los modelos de negocio de los videos, los problemas de LATAM y el perfil técnico RPM del usuario. Genera exactamente 4 propuestas de MVP concretas. Devuelve ÚNICAMENTE un JSON válido con un array llamado 'solutions'. Cada objeto del array debe tener: 'title' (nombre del producto), 'pain_point_category' (categoría del problema), 'referenced_videos' (array de IDs o nombres de videos que inspiran la idea), 'latam_adaptation' (cómo se adapta a la región), 'rpm_alignment' (cómo esto apoya su meta de lograr una publicación universitaria o crear un producto escalable), 'difficulty' (Alta/Media/Baja, considerando que el usuario domina CRISP-DM y modelos predictivos), y 'fit_score' (puntaje de 1-100).";

    const userPrompt = `
    **Modelos de Negocio Exitosos (Videos):**
    ${JSON.stringify(videos, null, 2)}
    
    **Problemas LATAM (Pain Points):**
    ${JSON.stringify(painPoints, null, 2)}
    
    **Perfil RPM del Usuario:**
    ${JSON.stringify(rpmProfile.ai_processed_profile || rpmProfile, null, 2)}
    `.substring(0, 15000); // Límite de seguridad de longitud

    // 5. Llamada a Groq
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('Groq no retornó contenido');

    const cleanedContent = content.replace(/```(?:json)?/gi, '').trim();
    const solutionsData = JSON.parse(cleanedContent);

    return NextResponse.json({ success: true, solutions: solutionsData.solutions }, { status: 200 });

  } catch (error: any) {
    console.error("Detalle exacto del error en /api/solutions:", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
