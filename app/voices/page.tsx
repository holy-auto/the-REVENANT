import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui';
import { storeSeo, stores } from '@/data/site';
import { getReviews, type Review } from '@/data/content';

export const metadata: Metadata = {
  title: 'お客様の声・口コミ',
  description: 'THE REVENANT 日立店・鉾田店に寄せられたお客様の声。確認できた口コミのみを掲載します。',
  alternates: { canonical: '/voices' },
};

export const revalidate = 60;

export default async function Page() {
  const reviewsByStore: Record<string, Review[]> = {};
  await Promise.all(stores.map(async (s) => { reviewsByStore[s.id] = await getReviews(s.id); }));
  return (
    <main>
      <Breadcrumbs items={[{ name: 'お客様の声', path: '/voices' }]} />
      <section className="section">
        <div className="container">
          <h1 className="text-4xl font-black">お客様の声・口コミ</h1>
          <p className="lead mt-4">確認できた声のみを掲載する方針です。Googleの口コミもあわせてご覧いただけます。</p>

          {stores.map((store) => {
            const reviews = reviewsByStore[store.id] ?? [];
            const seo = storeSeo[store.id];
            return (
              <section className="mt-10" key={store.id} aria-labelledby={`voices-${store.id}`}>
                <h2 id={`voices-${store.id}`} className="text-2xl font-bold">{store.name}</h2>
                {reviews.length ? (
                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    {reviews.map((r, i) => (
                      <blockquote className="card p-6" key={i}>
                        <p className="font-bold" aria-label={`評価 ${r.rating} / 5`}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                        <p className="lead mt-2">{r.text}</p>
                        <footer className="mt-3 text-sm text-ivory/70">{r.author}{r.source === 'google' ? '（Googleの口コミ）' : ''}・{r.date}</footer>
                      </blockquote>
                    ))}
                  </div>
                ) : (
                  <p className="lead mt-3">{store.name}の口コミは掲載準備中です。</p>
                )}
                {seo.googleReviewUrl && (
                  <div className="mt-4"><a className="footer-link" href={seo.googleReviewUrl} target="_blank" rel="noopener noreferrer">{store.name}のGoogle口コミを見る →</a></div>
                )}
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
