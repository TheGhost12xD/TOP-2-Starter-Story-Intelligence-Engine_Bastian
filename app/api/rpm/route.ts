import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { results, purpose, massive_action_plan } = body;

    if (!results || !purpose || !massive_action_plan) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Falta configuración de Groq API' }, { status: 500 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const userPrompt = `Resultados: ${results}\nPropósito: ${purpose}\nPlan de Acción Masiva: ${massive_action_plan}`;

    let ai_processed_profile = null;

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: "Eres un experto en productividad y análisis de perfiles. Lee las respuestas RPM del usuario y devuelve ÚNICAMENTE un JSON estructurado con las llaves: 'core_focus' (string breve), 'motivation_level' (string), y 'top_3_actions' (array de strings)."
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        model: 'llama3-8b-8192',
        temperature: 0.1,
        response_format: { type: 'json_object' }
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        // Limpieza de Markdown: Eliminar etiquetas ```json y ```
        const cleanedContent = content.replace(/```(?:json)?/gi, '').trim();
        ai_processed_profile = JSON.parse(cleanedContent);
      }
    } catch (aiError: any) {
      console.error('[RPM API] Error de Groq:', aiError);
      return NextResponse.json({ error: aiError.message || String(aiError) }, { status: 500 });
    }

    // Guardar en la tabla rpm_profiles
    const { data, error } = await supabaseAdmin
      .from('rpm_profiles')
      .insert({
        results,
        purpose,
        massive_action_plan,
        ai_processed_profile
      })
      .select()
      .single();

    if (error) {
      console.error('[RPM API] Error de Supabase:', error.message);
      return NextResponse.json({ error: 'Error guardando en base de datos' }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile: data }, { status: 200 });

  } catch (error: any) {
    console.error("Detalle exacto del error en /api/rpm:", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
