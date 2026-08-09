import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Breadcrumbs, CTA, JsonLd } from '@/components/ui';
import { getPost, getPosts, STORE_NAME } from '@/data/content';
import { site } from '@/data/site';
import { absoluteUrl } from '@/lib/seo';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const ogImages = post.cover_image ? [absoluteUrl(post.cover_image)] : undefined;
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: 'article',
      url: `${site.baseUrl}/blog/${post.slug}`,
      publishedTime: post.published_at,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt ?? undefined,
      images: ogImages,
    },
  };
}

function jpDate(d: string) {
  const t = new Date(d);
  return `${t.getFullYear()}.${String(t.getMonth() + 1).padStart(2, '0')}.${String(t.getDate()).padStart(2, '0')}`;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt ?? undefined,
          inLanguage: 'ja-JP',
          datePublished: post.published_at,
          dateModified: post.published_at,
          ...(post.cover_image ? { image: absoluteUrl(post.cover_image) } : {}),
          author: { '@type': 'Organization', '@id': `${site.baseUrl}/#organization`, name: site.name },
          publisher: { '@id': `${site.baseUrl}/#organization` },
          isPartOf: { '@id': `${site.baseUrl}/#website` },
          mainEntityOfPage: `${site.baseUrl}/blog/${post.slug}`,
        }}
      />
      <Breadcrumbs items={[{ name: 'ブログ', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }]} />
      <section className="section">
        <div className="container prose-rev">
          <p className="eyebrow">{STORE_NAME[post.store_id] ?? ''}・{jpDate(post.published_at)}</p>
          <h1>{post.title}</h1>
          {post.body.split(/\n{2,}/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <p className="mt-8"><Link className="footer-link" href="/blog">← ブログ一覧へ</Link></p>
        </div>
      </section>
      <CTA />
    </main>
  );
}
