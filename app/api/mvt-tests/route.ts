import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // 1. Obtener inmersiones previas
    const { data: conversations, error: convError } = await supabaseAdmin
      .from('mvt_conversations')
      .select('*')
      .order('created_at', { ascending: false });

    if (convError) throw convError;

    // 2. Obtener test MVT más reciente
    const { data: testRecord, error: testError } = await supabaseAdmin
      .from('mvt_tests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (testError && testError.code !== 'PGRST116') {
      throw testError;
    }

    return NextResponse.json({ 
      success: true, 
      conversations: conversations || [], 
      test: testRecord || null 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Detalle exacto del error GET /api/mvt-tests:", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { hypotheses, test_type, evidence_url, target_metric, actual_metric, conclusion, final_decision } = body;

    if (!hypotheses || !test_type || !evidence_url || !target_metric || !actual_metric || !conclusion || !final_decision) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('mvt_tests')
      .insert({
        hypotheses,
        test_type,
        evidence_url,
        target_metric,
        actual_metric,
        conclusion,
        final_decision
      })
      .select()
      .single();

    if (error) {
      console.error('[MVT Tests API] Error de Supabase al guardar:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, test: data }, { status: 200 });

  } catch (error: any) {
    console.error("Detalle exacto del error POST /api/mvt-tests:", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
