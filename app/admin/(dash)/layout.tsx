import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { logout } from '../actions';

export const dynamic = 'force-dynamic';

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  return (
    <>
      <header className="admin-topbar">
        <Link className="brand" href="/admin" style={{ color: '#fff' }}>
          THE <span>REVENANT</span> 管理画面
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.9rem' }}>
          <span style={{ fontSize: 12.5, opacity: 0.8 }}>{user.email}</span>
          <form action={logout}>
            <button className="admin-btn" type="submit">ログアウト</button>
          </form>
        </div>
      </header>
      {children}
    </>
  );
}
