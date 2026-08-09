'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { TABLES, isTableKey, type Field, type TableKey } from '@/data/admin-schema';

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect('/admin/login?error=' + encodeURIComponent('メールアドレスまたはパスワードが正しくありません'));
  }
  redirect('/admin');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

function buildRow(table: TableKey, formData: FormData): Record<string, unknown> {
  const cfg = TABLES[table];
  const row: Record<string, unknown> = {};
  for (const f of cfg.fields as Field[]) {
    if (f.type === 'bool') {
      row[f.name] = formData.get(f.name) === 'on';
    } else if (f.type === 'number') {
      const raw = formData.get(f.name);
      row[f.name] = raw == null || raw === '' ? null : Number(raw);
    } else {
      const v = formData.get(f.name);
      const s = v == null ? '' : String(v);
      row[f.name] = f.nullable && s === '' ? null : s;
    }
  }
  return row;
}

export async function saveRow(table: TableKey, formData: FormData) {
  if (!isTableKey(table)) throw new Error('unknown table');
  const cfg = TABLES[table];
  const supabase = await createClient();
  const row = buildRow(table, formData);
  const id = String(formData.get('id') ?? '');

  const { error } = id
    ? await supabase.from(table).update(row).eq('id', id)
    : await supabase.from(table).insert(row);

  if (error) {
    redirect(`/admin/${table}?error=` + encodeURIComponent(error.message));
  }
  revalidatePath(`/admin/${table}`);
  cfg.revalidate?.forEach((p) => revalidatePath(p));
  redirect(`/admin/${table}?ok=1`);
}

export async function deleteRow(table: TableKey, formData: FormData) {
  if (!isTableKey(table)) throw new Error('unknown table');
  const cfg = TABLES[table];
  const supabase = await createClient();
  const id = String(formData.get('id') ?? '');
  if (id) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      redirect(`/admin/${table}?error=` + encodeURIComponent(error.message));
    }
  }
  revalidatePath(`/admin/${table}`);
  cfg.revalidate?.forEach((p) => revalidatePath(p));
  redirect(`/admin/${table}?ok=1`);
}
