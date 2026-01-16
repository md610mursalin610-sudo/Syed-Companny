import { getSupabaseAdmin } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const projectType = typeof body?.projectType === 'string' ? body.projectType.trim() : '';
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (!name || !email || !message) {
    return Response.json(
      { ok: false, error: 'Missing required fields' },
      { status: 400 }
    );
  }

  if (!email.includes('@')) {
    return Response.json({ ok: false, error: 'Invalid email' }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('contacts').insert({
      name,
      email,
      project_type: projectType,
      message,
      source: 'contact',
    });

    if (error) {
      return Response.json({ ok: false, error: 'Database insert failed' }, { status: 500 });
    }
  } catch {
    return Response.json({ ok: false, error: 'Server misconfigured' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
