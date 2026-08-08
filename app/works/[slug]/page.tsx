import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CTA, JsonLd } from '@/components/ui';
import { getCase, getCases, STORE_NAME } from '@/data/content';
import { site } from '@/data/site';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const cases = await getCases();
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCase(slug);
  if (!c) return {};
  return {
    title: c.title,
    description: `${c.area}の${c.maker} ${c.car}施工事例。悩み、状態、提案内容を掲載。`,
    alternates: { canonical: `/works/${c.slug}` },
  };
}

export default async function Work({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getCase(slug);
  if (!c) notFound();

  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: c.title,
          datePublished: undefined,
          author: { '@type': 'Organization', name: site.name },
          publisher: { '@type': 'Organization', name: site.name },
          mainEntityOfPage: `${site.baseUrl}/works/${c.slug}`,
        }}
      />
      <section className="section">
        <div className="container prose-rev">
          <p className="eyebrow">Case study</p>
          <h1>{c.title}</h1>
          {Object.entries({
            施工店舗: STORE_NAME[c.store_id] ?? '',
            来店地域: c.area,
            メーカー: c.maker,
            車種: c.car,
            新車経年車: c.age,
            お客様の悩み: c.concern,
            車両の状態: c.condition,
            提案内容: c.proposal,
            施工メニュー: c.menu,
            施工日数: c.days,
            価格帯: c.price,
            担当者コメント: c.comment,
          }).map(([k, v]) => (
            <section key={k}>
              <h2>{k}</h2>
              <p>{v}</p>
            </section>
          ))}
          <h2>ビフォーアフター</h2>
          <p>掲載枠です。画像altには車種、施工内容、地域が分かる説明を設定してください。</p>
        </div>
      </section>
      <CTA />
    </main>
  );
}
