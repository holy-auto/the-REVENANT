// Content layer for blog posts and case studies.
//
// Reads published rows from Supabase (via the REST API, no extra deps) and
// falls back gracefully when Supabase isn't configured yet: posts return an
// empty list, case studies fall back to the static seed in site.ts. This lets
// the site build and render even before NEXT_PUBLIC_SUPABASE_* env vars are set
// in the deployment.
import {
  cases as staticCases,
  menus as staticMenus,
  faqs as staticFaqs,
  storeReviews as staticReviews,
} from './site';

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

// ===== 施工メニュー =====
export type MenuItem = { slug: string; name: string; summary: string; price: string };

export async function getMenus(): Promise<MenuItem[]> {
  const rows = await sbFetch('menus?select=slug,name,summary,price&published=eq.true&order=sort.asc');
  return rows && rows.length ? (rows as MenuItem[]) : staticMenus;
}

export async function getMenu(slug: string): Promise<MenuItem | null> {
  const rows = await sbFetch(`menus?select=slug,name,summary,price&published=eq.true&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  if (rows && rows.length) return rows[0] as MenuItem;
  return staticMenus.find((m) => m.slug === slug) ?? null;
}

// ===== 価格シミュレーションの目安レンジ =====
export type PriceRange = [number, number];
export type PriceMatrix = Record<string, Record<string, PriceRange>>;

// Supabase 未設定時のフォールバック（公式料金表に基づく目安レンジ）。
// coating=ボディーコーティング(ピュア〜プレミアム) / polish=磨き(ライト〜プレミアム)
// / wash=洗車(手洗い〜徹底)。SS〜XL の5サイズ。
const staticPriceMatrix: PriceMatrix = {
  coating: {
    SS: [88000, 198000], S: [99000, 220000], M: [121000, 242000], L: [132000, 264000], XL: [154000, 286000],
  },
  polish: {
    SS: [27500, 68750], S: [33000, 82500], M: [38500, 96250], L: [44000, 110000], XL: [49500, 123750],
  },
  wash: {
    SS: [4000, 16000], S: [4500, 18000], M: [5000, 20000], L: [5500, 22000], XL: [6000, 24000],
  },
};

export async function getPriceMatrix(): Promise<PriceMatrix> {
  const rows = await sbFetch('price_matrix?select=service,size,min_price,max_price&published=eq.true');
  if (!rows || !rows.length) return staticPriceMatrix;
  const matrix: PriceMatrix = {};
  for (const r of rows as { service: string; size: string; min_price: number; max_price: number }[]) {
    (matrix[r.service] ??= {})[r.size] = [r.min_price, r.max_price];
  }
  return matrix;
}

// ===== Q&A =====
export type Faq = { question: string; answer: string };

// storeId を渡すと「全店共通(store_id=null)＋その店舗」を返す。省略時は全店共通のみ。
export async function getFaqs(storeId?: string): Promise<Faq[]> {
  const rows = await sbFetch('faqs?select=question,answer,store_id,sort&published=eq.true&order=sort.asc');
  if (!rows) return staticFaqs.map(([question, answer]) => ({ question, answer }));
  return (rows as { question: string; answer: string; store_id: string | null }[])
    .filter((r) => r.store_id == null || r.store_id === storeId)
    .map((r) => ({ question: r.question, answer: r.answer }));
}

// ===== 口コミ =====
export type Review = { author: string; rating: number; text: string; date: string; source: 'google' | 'manual' };

// 実在の口コミのみ。Supabase 未設定時は空（捏造しない）。
export async function getReviews(storeId: string): Promise<Review[]> {
  const rows = await sbFetch(
    `reviews?select=author,rating,text,review_date,source,sort&published=eq.true&store_id=eq.${storeId}&order=sort.asc`,
  );
  if (!rows) return staticReviews[storeId as 'hitachi' | 'hokota'] ?? [];
  return (rows as { author: string; rating: number; text: string; review_date: string; source: 'google' | 'manual' }[]).map(
    (r) => ({ author: r.author, rating: r.rating, text: r.text, date: r.review_date, source: r.source }),
  );
}
