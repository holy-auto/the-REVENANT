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

const SETTINGS = '/admin/settings';

// 現在のパスワードで本人確認する。誤りなら null を返す（呼び出し側が中断）。
async function reauthenticate(currentPassword: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;
  const { error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  return error ? null : user;
}

export async function updateEmail(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const currentPassword = String(formData.get('current_password') ?? '');
  if (!email) {
    redirect(`${SETTINGS}?error=` + encodeURIComponent('新しいメールアドレスを入力してください'));
  }
  const user = await reauthenticate(currentPassword);
  if (!user) {
    redirect(`${SETTINGS}?error=` + encodeURIComponent('現在のパスワードが正しくありません'));
  }
  if (email === user.email) {
    redirect(`${SETTINGS}?error=` + encodeURIComponent('現在のメールアドレスと同じです'));
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ email });
  if (error) {
    redirect(`${SETTINGS}?error=` + encodeURIComponent(error.message));
  }
  redirect(
    `${SETTINGS}?ok=` +
      encodeURIComponent(
        '確認メールを新しいアドレスに送信しました。メール内のリンクを開くと変更が完了します。',
      ),
  );
}

export async function updatePassword(formData: FormData) {
  const currentPassword = String(formData.get('current_password') ?? '');
  const newPassword = String(formData.get('new_password') ?? '');
  const confirmPassword = String(formData.get('confirm_password') ?? '');
  if (newPassword.length < 8) {
    redirect(`${SETTINGS}?error=` + encodeURIComponent('新しいパスワードは8文字以上にしてください'));
  }
  if (newPassword !== confirmPassword) {
    redirect(`${SETTINGS}?error=` + encodeURIComponent('新しいパスワード（確認）が一致しません'));
  }
  const user = await reauthenticate(currentPassword);
  if (!user) {
    redirect(`${SETTINGS}?error=` + encodeURIComponent('現在のパスワードが正しくありません'));
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    redirect(`${SETTINGS}?error=` + encodeURIComponent(error.message));
  }
  redirect(`${SETTINGS}?ok=` + encodeURIComponent('パスワードを変更しました。'));
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
