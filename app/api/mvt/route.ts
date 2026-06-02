import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idea, profile, learnings } = body;

    if (!idea || !profile || !learnings) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('mvt_conversations')
      .insert({
        idea_validated: idea,
        interviewee_profile: profile,
        key_learnings: learnings
      })
      .select()
      .single();

    if (error) {
      console.error('[MVT API] Error de Supabase:', error.message);
      return NextResponse.json({ error: 'Error guardando MVT en la base de datos' }, { status: 500 });
    }

    return NextResponse.json({ success: true, mvt: data }, { status: 200 });

  } catch (error: any) {
    console.error("Detalle exacto del error en /api/mvt:", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
