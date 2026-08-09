import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { login } from '../actions';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect('/admin');

  return (
    <div className="admin-login">
      <h1>THE <span style={{ color: '#c02626' }}>REVENANT</span> 管理画面</h1>
      <p className="admin-muted" style={{ marginTop: '.25rem' }}>ログインしてください。</p>
      {error && <div className="admin-flash admin-flash-err">{error}</div>}
      <form action={login} style={{ marginTop: '1rem' }}>
        <div className="admin-field">
          <label htmlFor="email">メールアドレス</label>
          <input id="email" name="email" type="text" autoComplete="username" required />
        </div>
        <div className="admin-field">
          <label htmlFor="password">パスワード</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        <div className="admin-actions">
          <button className="admin-btn admin-btn-primary" type="submit">ログイン</button>
        </div>
      </form>
    </div>
  );
}
