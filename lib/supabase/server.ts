import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// 管理画面用の Supabase サーバクライアント（Cookie ベースのセッション）。
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server Component からは Cookie を書けない（middleware がセッションを更新するので無視）。
          }
        },
      },
    },
  );
}
