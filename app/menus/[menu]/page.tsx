import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Breadcrumbs, CTA, JsonLd } from '@/components/ui';
import { site } from '@/data/site';
import { getMenus } from '@/data/content';

export async function generateStaticParams() {
  const menus = await getMenus();
  return menus.map((m) => ({ menu: m.slug.split('/').pop()! }));
}

export async function generateMetadata({ params }: { params: Promise<{ menu: string }> }): Promise<Metadata> {
  const { menu } = await params;
  const m = (await getMenus()).find((x) => x.slug.endsWith(menu));
  return m ? { title: m.name, description: m.summary, alternates: { canonical: m.slug } } : {};
}

export default async function MenuPage({ params }: { params: Promise<{ menu: string }> }) {
  const { menu } = await params;
  const m = (await getMenus()).find((x) => x.slug.endsWith(menu));
  if (!m) notFound();
  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: m.name,
          description: m.summary,
          serviceType: m.name,
          provider: { '@type': 'AutoRepair', '@id': `${site.baseUrl}/#organization`, name: site.name },
          areaServed: ['日立市', '鉾田市', '茨城県'].map((name) => ({ '@type': 'City', name })),
          url: site.baseUrl + m.slug,
        }}
      />
      <Breadcrumbs items={[{ name: 'メニュー', path: '/menus/coating' }, { name: m.name, path: m.slug }]} />
      <section className="section">
        <div className="container prose-rev">
          <p className="eyebrow">Service</p>
          <h1>{m.name}</h1>
          <p>{m.summary}</p>
          <h2>必要な施工だけをご提案します</h2>
          <p>塗装状態、保管環境、洗車頻度、予算を確認し、過剰なメニューではなく愛車に合う守り方を一緒に考えます。</p>
          <h2>こんな方へ</h2>
          <p>新車を長くきれいに保ちたい方、経年車のくすみや洗車傷が気になる方、施工後の洗車方法まで相談したい方に向けたメニューです。</p>
          <p>料金目安：{m.price}</p>
        </div>
      </section>
      <CTA />
    </main>
  );
}
