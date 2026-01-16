import { getSupabaseAdmin } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const projectType = typeof body?.projectType === 'string' ? body.projectType.trim() : '';
  const budget = typeof body?.budget === 'string' ? body.budget.trim() : undefined;
  const timeline = typeof body?.timeline === 'string' ? body.timeline.trim() : undefined;

  if (!name || !projectType) {
    return Response.json(
      { ok: false, error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('leads').insert({
      name,
      project_type: projectType,
      budget,
      timeline,
      source: 'chat',
    });

    if (error) {
      return Response.json({ ok: false, error: 'Database insert failed' }, { status: 500 });
    }
  } catch {
    return Response.json({ ok: false, error: 'Server misconfigured' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
