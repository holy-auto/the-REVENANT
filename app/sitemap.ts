import type { MetadataRoute } from 'next';
import { menus, site, stores } from '@/data/site';
import { getCases, getPosts } from '@/data/content';

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cases, posts] = await Promise.all([getCases(), getPosts()]);

  const staticEntries: MetadataRoute.Sitemap = [
    { url: site.baseUrl + '/', changeFrequency: 'weekly', priority: 1 },
    { url: site.baseUrl + '/first-time', changeFrequency: 'monthly', priority: 0.7 },
    { url: site.baseUrl + '/prices', changeFrequency: 'monthly', priority: 0.8 },
    { url: site.baseUrl + '/works', changeFrequency: 'weekly', priority: 0.7 },
    { url: site.baseUrl + '/blog', changeFrequency: 'weekly', priority: 0.7 },
    { url: site.baseUrl + '/voices', changeFrequency: 'monthly', priority: 0.6 },
    { url: site.baseUrl + '/faq', changeFrequency: 'monthly', priority: 0.6 },
    { url: site.baseUrl + '/about', changeFrequency: 'yearly', priority: 0.5 },
    { url: site.baseUrl + '/contact', changeFrequency: 'yearly', priority: 0.8 },
    { url: site.baseUrl + '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  ];

  const storeEntries: MetadataRoute.Sitemap = stores.map((s) => ({
    url: site.baseUrl + s.slug,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const menuEntries: MetadataRoute.Sitemap = menus.map((m) => ({
    url: site.baseUrl + m.slug,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const caseEntries: MetadataRoute.Sitemap = cases.map((c) => ({
    url: `${site.baseUrl}/works/${c.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site.baseUrl}/blog/${p.slug}`,
    lastModified: p.published_at ? new Date(p.published_at) : undefined,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticEntries, ...storeEntries, ...menuEntries, ...caseEntries, ...postEntries];
}
