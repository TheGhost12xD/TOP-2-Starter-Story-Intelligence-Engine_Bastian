import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { solution_title, interviewee_profile, key_learnings } = body;

    if (!solution_title || !interviewee_profile || !key_learnings) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('mvt_conversations')
      .insert({
        solution_title,
        interviewee_profile,
        key_learnings
      })
      .select()
      .single();

    if (error) {
      console.error('[MVT API] Error de Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, mvt: data }, { status: 200 });

  } catch (error: any) {
    console.error("Detalle exacto del error en /api/mvt:", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
