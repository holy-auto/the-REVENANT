import { site } from '@/data/site';

// A single breadcrumb hop. `path` is site-relative (e.g. "/blog") — the last
// item usually points to the current page.
export type Crumb = { name: string; path: string };

// Turn a relative path into an absolute URL rooted at the configured baseUrl.
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return site.baseUrl + (path.startsWith('/') ? path : `/${path}`);
}

// Build a schema.org BreadcrumbList node. "ホーム" is always prepended so every
// trail starts at the site root.
export function breadcrumbLd(crumbs: Crumb[]) {
  const items = [{ name: 'ホーム', path: '/' }, ...crumbs];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}
