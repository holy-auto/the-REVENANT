import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { updateEmail, updatePassword } from '../../actions';

export const dynamic = 'force-dynamic';

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  return (
    <div className="admin-wrap" style={{ maxWidth: 640 }}>
      <a className="admin-back" href="/admin">← 管理トップに戻る</a>
      <h1>アカウント設定</h1>
      <p className="admin-muted">ログインに使うメールアドレスとパスワードを変更できます。</p>

      {ok && <div className="admin-flash admin-flash-ok">{ok}</div>}
      {error && <div className="admin-flash admin-flash-err">{error}</div>}

      <section className="admin-row" style={{ marginTop: '1.25rem' }}>
        <div className="admin-row-head">
          <strong>メールアドレスの変更</strong>
        </div>
        <p className="admin-muted" style={{ margin: '.1rem 0 .4rem' }}>
          現在: <b>{user.email}</b>
        </p>
        <form action={updateEmail}>
          <div className="admin-field">
            <label htmlFor="new-email">新しいメールアドレス</label>
            <input id="new-email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="admin-field">
            <label htmlFor="email-cur-pw">
              現在のパスワード<span className="help">本人確認のため</span>
            </label>
            <input
              id="email-cur-pw"
              name="current_password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          <p className="admin-muted" style={{ fontSize: 12.5, marginTop: '.5rem' }}>
            ※ 新しいアドレスに確認メールが届きます。メール内のリンクを開くと変更が完了します。
          </p>
          <div className="admin-actions">
            <button className="admin-btn admin-btn-primary" type="submit">
              メールアドレスを変更
            </button>
          </div>
        </form>
      </section>

      <section className="admin-row" style={{ marginTop: '1rem' }}>
        <div className="admin-row-head">
          <strong>パスワードの変更</strong>
        </div>
        <form action={updatePassword}>
          <div className="admin-field">
            <label htmlFor="pw-cur">現在のパスワード</label>
            <input
              id="pw-cur"
              name="current_password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          <div className="admin-grid2">
            <div className="admin-field">
              <label htmlFor="pw-new">
                新しいパスワード<span className="help">8文字以上</span>
              </label>
              <input
                id="pw-new"
                name="new_password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="pw-confirm">新しいパスワード（確認）</label>
              <input
                id="pw-confirm"
                name="confirm_password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
          </div>
          <div className="admin-actions">
            <button className="admin-btn admin-btn-primary" type="submit">
              パスワードを変更
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
