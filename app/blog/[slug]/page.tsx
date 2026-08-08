import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CTA, JsonLd } from '@/components/ui';
import { getPost, getPosts, STORE_NAME } from '@/data/content';
import { site } from '@/data/site';

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
          datePublished: post.published_at,
          author: { '@type': 'Organization', name: site.name },
          publisher: { '@type': 'Organization', name: site.name, logo: { '@type': 'ImageObject', url: `${site.baseUrl}${site.ogImage}` } },
          mainEntityOfPage: `${site.baseUrl}/blog/${post.slug}`,
        }}
      />
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
