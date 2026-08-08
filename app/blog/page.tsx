import Link from 'next/link';
import type { Metadata } from 'next';
import { getPosts, STORE_NAME } from '@/data/content';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'ブログ',
  description: 'THE REVENANT 日立店・鉾田店のブログ。カーコーティング・車磨き・洗車の情報や店舗からのお知らせを掲載します。',
  alternates: { canonical: '/blog' },
};

function jpDate(d: string) {
  const t = new Date(d);
  return `${t.getFullYear()}.${String(t.getMonth() + 1).padStart(2, '0')}.${String(t.getDate()).padStart(2, '0')}`;
}

export default async function BlogIndex() {
  const posts = await getPosts();
  return (
    <main>
      <section className="section">
        <div className="container">
          <h1 className="text-4xl font-black">ブログ</h1>
          <p className="lead mt-4">店舗からのお知らせや、コーティング・洗車のヒントを掲載します。</p>
          {posts.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {posts.map((p) => (
                <Link className="card p-6" href={`/blog/${p.slug}`} key={p.slug}>
                  <p className="eyebrow">{STORE_NAME[p.store_id] ?? ''}・{jpDate(p.published_at)}</p>
                  <h2 className="mt-2 text-xl font-bold">{p.title}</h2>
                  {p.excerpt && <p className="lead mt-2">{p.excerpt}</p>}
                </Link>
              ))}
            </div>
          ) : (
            <p className="lead mt-6">記事は準備中です。順次公開します。</p>
          )}
        </div>
      </section>
    </main>
  );
}
