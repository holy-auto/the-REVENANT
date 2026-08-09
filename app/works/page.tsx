import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui';
import { getCases, STORE_NAME } from '@/data/content';

export const revalidate = 60;
export const metadata: Metadata = {
  title: '施工事例一覧',
  description: 'THE REVENANT 日立店・鉾田店の施工事例。車種・状態・提案内容を掲載しています。',
  alternates: { canonical: '/works' },
};

export default async function Works() {
  const cases = await getCases();
  return (
    <main>
      <Breadcrumbs items={[{ name: '施工事例', path: '/works' }]} />
      <section className="section">
        <div className="container">
          <h1 className="text-4xl font-black">施工事例一覧</h1>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {cases.map((c) => (
              <Link className="card p-6" href={`/works/${c.slug}`} key={c.slug}>
                <h2 className="text-xl font-bold">{c.title}</h2>
                <p className="lead mt-2">{STORE_NAME[c.store_id] ?? ''}／{c.area}／{c.maker} {c.car}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
