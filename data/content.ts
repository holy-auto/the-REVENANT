// Content layer for blog posts and case studies.
//
// Reads published rows from Supabase (via the REST API, no extra deps) and
// falls back gracefully when Supabase isn't configured yet: posts return an
// empty list, case studies fall back to the static seed in site.ts. This lets
// the site build and render even before NEXT_PUBLIC_SUPABASE_* env vars are set
// in the deployment.
import { cases as staticCases } from './site';

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const STORE_NAME: Record<string, string> = { hitachi: '日立店', hokota: '鉾田店' };
const STORE_ID_BY_NAME: Record<string, string> = { 日立店: 'hitachi', 鉾田店: 'hokota' };

async function sbFetch(path: string): Promise<Record<string, unknown>[] | null> {
  if (!SB_URL || !SB_KEY) return null;
  try {
    const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>[];
  } catch {
    return null;
  }
}

export type BlogPost = {
  store_id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover_image: string | null;
  published_at: string;
};

export async function getPosts(storeId?: string): Promise<BlogPost[]> {
  const params = ['select=*', 'published=eq.true', 'order=published_at.desc'];
  if (storeId) params.push(`store_id=eq.${storeId}`);
  const rows = await sbFetch(`posts?${params.join('&')}`);
  return (rows as BlogPost[] | null) ?? [];
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const rows = await sbFetch(`posts?select=*&published=eq.true&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return (rows?.[0] as BlogPost | undefined) ?? null;
}

export type CaseStudy = {
  store_id: string;
  slug: string;
  title: string;
  area: string;
  maker: string;
  car: string;
  age: string;
  concern: string;
  condition: string;
  proposal: string;
  menu: string;
  days: string;
  price: string;
  comment: string;
};

function staticCaseRows(): CaseStudy[] {
  return staticCases.map((c) => ({ ...c, store_id: STORE_ID_BY_NAME[c.store] ?? '' }));
}

export async function getCases(): Promise<CaseStudy[]> {
  const rows = await sbFetch('cases?select=*&published=eq.true&order=published_at.desc');
  if (rows && rows.length) return rows as CaseStudy[];
  return staticCaseRows();
}

export async function getCasesForStore(storeId: string): Promise<CaseStudy[]> {
  return (await getCases()).filter((c) => c.store_id === storeId);
}

export async function getCase(slug: string): Promise<CaseStudy | null> {
  const rows = await sbFetch(`cases?select=*&published=eq.true&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  if (rows && rows.length) return rows[0] as CaseStudy;
  return staticCaseRows().find((c) => c.slug === slug) ?? null;
}
