import type { MetadataRoute } from 'next';
import { menus, site, stores } from '@/data/site';
import { getCases, getPosts } from '@/data/content';

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cases, posts] = await Promise.all([getCases(), getPosts()]);
  const paths = [
    '/', '/prices', '/works', '/blog', '/voices', '/first-time', '/faq', '/about', '/contact', '/privacy',
    ...stores.map((s) => s.slug),
    ...menus.map((m) => m.slug),
    ...cases.map((c) => `/works/${c.slug}`),
    ...posts.map((p) => `/blog/${p.slug}`),
  ];
  return paths.map((p) => ({
    url: site.baseUrl + p,
    lastModified: new Date(),
    changeFrequency: p === '/' || p === '/blog' ? 'weekly' : 'monthly',
    priority: p === '/' ? 1 : p.startsWith('/stores/') ? 0.8 : 0.7,
  }));
}
