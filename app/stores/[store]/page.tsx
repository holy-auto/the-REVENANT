import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CTA, JsonLd } from '@/components/ui';
import { site, storeReviews, storeSeo, stores } from '@/data/site';
import { getCasesForStore, getPosts } from '@/data/content';

export const revalidate = 60;

type GalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  wide?: boolean;
};

const storeGalleries: Record<string, GalleryImage[]> = {
  hitachi: [
    { src: '/images/stores/hitachi/exterior-front.svg', alt: 'THE REVENANT日立店の正面外観', width: 1456, height: 1090 },
    { src: '/images/stores/hitachi/exterior-parking.svg', alt: '駐車場から見たTHE REVENANT日立店の外観', width: 1456, height: 1090 },
    { src: '/images/stores/hitachi/interior.svg', alt: 'THE REVENANT日立店の明るい商談スペース', width: 1864, height: 840, wide: true },
  ],
  hokota: [
    { src: '/images/stores/hokota/exterior-front.svg', alt: 'THE REVENANT鉾田店の外観', width: 1672, height: 941, wide: true },
    { src: '/images/stores/hokota/interior-scene.svg', alt: 'THE REVENANT鉾田店の敷地・店内の様子', width: 1672, height: 941, wide: true },
  ],
};

export function generateStaticParams() {
  return stores.map((store) => ({ store: store.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ store: string }> }): Promise<Metadata> {
  const { store: storeId } = await params;
  const store = stores.find((item) => item.id === storeId);
  if (!store) return {};
  const seo = storeSeo[store.id];
  return {
    title: store.title,
    description: store.description,
    keywords: seo?.keywords,
    alternates: { canonical: store.slug },
    openGraph: {
      title: `${store.title}｜${site.name} ${store.name}`,
      description: store.description,
      url: site.baseUrl + store.slug,
      type: 'website',
      locale: 'ja_JP',
    },
  };
}

// Build a LocalBusiness (AutoRepair) node, emitting only the fields we actually
// have — no fabricated geo, hours or ratings.
function localBusinessLd(store: (typeof stores)[number], reviewCount: number) {
  const seo = storeSeo[store.id];
  const gallery = storeGalleries[store.id] ?? [];
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    '@id': `${site.baseUrl}${store.slug}#business`,
    name: `${site.name} ${store.name}`,
    description: store.description,
    url: site.baseUrl + store.slug,
    telephone: store.phone,
    priceRange: seo.priceRange,
    image: gallery.map((g) => site.baseUrl + g.src),
    areaServed: [seo.locality, ...store.serviceAreas].map((name) => ({ '@type': 'City', name })),
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'JP',
      addressRegion: seo.region,
      addressLocality: seo.locality,
      streetAddress: seo.streetAddress,
      ...(seo.postalCode ? { postalCode: seo.postalCode } : {}),
    },
    sameAs: [site.instagramUrl],
    parentOrganization: { '@type': 'Organization', name: site.name, url: site.baseUrl },
  };
  if (seo.latitude != null && seo.longitude != null) {
    ld.geo = { '@type': 'GeoCoordinates', latitude: seo.latitude, longitude: seo.longitude };
  }
  if (seo.googleMapsUrl) ld.hasMap = seo.googleMapsUrl;
  if (seo.openingHours.length) {
    ld.openingHoursSpecification = seo.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map((d) => `https://schema.org/${({ Mo: 'Monday', Tu: 'Tuesday', We: 'Wednesday', Th: 'Thursday', Fr: 'Friday', Sa: 'Saturday', Su: 'Sunday' } as const)[d]}`),
      opens: h.opens,
      closes: h.closes,
    }));
  }
  const reviews = storeReviews[store.id];
  if (reviewCount > 0) {
    ld.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: (reviews.reduce((s, r) => s + r.rating, 0) / reviewCount).toFixed(1),
      reviewCount,
    };
    ld.review = reviews.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      datePublished: r.date,
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.text,
    }));
  }
  return ld;
}

export default async function StorePage({ params }: { params: Promise<{ store: string }> }) {
  const { store: storeId } = await params;
  const store = stores.find((item) => item.id === storeId);
  if (!store) notFound();

  const seo = storeSeo[store.id];
  const reviews = storeReviews[store.id];
  const storeCases = await getCasesForStore(store.id);
  const storePosts = await getPosts(store.id);

  return (
    <main>
      <JsonLd data={localBusinessLd(store, reviews.length)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'ホーム', item: site.baseUrl + '/' },
            { '@type': 'ListItem', position: 2, name: store.name, item: site.baseUrl + store.slug },
          ],
        }}
      />
      <section className="section">
        <div className="container">
          <p className="eyebrow">{store.area} car coating</p>
          <h1 className="mt-3 text-4xl font-black">{store.title}</h1>
          <p className="lead mt-5 max-w-3xl">{store.description}</p>

          {storeGalleries[store.id] && (
            <section className="mt-10" aria-labelledby="store-gallery-title">
              <h2 id="store-gallery-title" className="text-2xl font-bold">{store.name}のご案内</h2>
              <p className="lead mt-3">店舗の外観と店内の様子をご覧いただけます。</p>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {storeGalleries[store.id].map((image, index) => (
                  <figure
                    className={`overflow-hidden rounded-2xl border border-white/10 bg-black ${image.wide ? 'md:col-span-2' : ''}`}
                    key={image.src}
                  >
                    <Image
                      className={`h-auto w-full object-cover ${image.wide ? 'aspect-[2/1]' : 'aspect-[4/3]'}`}
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      sizes={image.wide ? '(min-width: 768px) 1200px, 100vw' : '(min-width: 768px) 600px, 100vw'}
                      priority={index === 0}
                    />
                  </figure>
                ))}
              </div>
            </section>
          )}

          <div className="card mt-8 p-6">
            <h2 className="text-2xl font-bold">店舗情報</h2>
            <dl className="mt-4 grid gap-3">
              <div><dt>住所</dt><dd className="text-ivory/70">{store.address}</dd></div>
              <div><dt>電話</dt><dd className="text-ivory/70">{store.phone}</dd></div>
              <div><dt>営業時間</dt><dd className="text-ivory/70">{store.hours}</dd></div>
              {seo.googleMapsUrl && (
                <div><dt>地図</dt><dd><a className="footer-link" href={seo.googleMapsUrl} target="_blank" rel="noopener noreferrer">Googleマップで見る →</a></dd></div>
              )}
            </dl>
          </div>

          <section className="mt-12" aria-labelledby="store-cases-title">
            <h2 id="store-cases-title" className="text-2xl font-bold">{store.name}の施工事例</h2>
            {storeCases.length ? (
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {storeCases.map((c) => (
                  <Link className="card p-6" href={`/works/${c.slug}`} key={c.slug}>
                    <h3 className="text-lg font-bold">{c.title}</h3>
                    <p className="lead mt-2">{c.maker} {c.car}／{c.age}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="lead mt-3">{store.name}の施工事例は準備中です。掲載でき次第、順次追加します。</p>
            )}
            <div className="mt-5"><Link className="footer-link" href="/works">施工事例をすべて見る →</Link></div>
          </section>

          <section className="mt-12" aria-labelledby="store-blog-title">
            <h2 id="store-blog-title" className="text-2xl font-bold">{store.name}のブログ</h2>
            {storePosts.length ? (
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {storePosts.slice(0, 4).map((p) => (
                  <Link className="card p-6" href={`/blog/${p.slug}`} key={p.slug}>
                    <h3 className="text-lg font-bold">{p.title}</h3>
                    {p.excerpt && <p className="lead mt-2">{p.excerpt}</p>}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="lead mt-3">{store.name}のブログ記事は準備中です。</p>
            )}
            <div className="mt-5"><Link className="footer-link" href="/blog">ブログをすべて見る →</Link></div>
          </section>

          <section className="mt-12" aria-labelledby="store-reviews-title">
            <h2 id="store-reviews-title" className="text-2xl font-bold">{store.name}の口コミ</h2>
            {reviews.length ? (
              <div className="mt-6 grid gap-5">
                {reviews.map((r, i) => (
                  <blockquote className="card p-6" key={i}>
                    <p className="font-bold" aria-label={`評価 ${r.rating} / 5`}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                    <p className="lead mt-2">{r.text}</p>
                    <footer className="mt-3 text-sm text-ivory/70">{r.author}{r.source === 'google' ? '（Googleの口コミ）' : ''}・{r.date}</footer>
                  </blockquote>
                ))}
              </div>
            ) : (
              <p className="lead mt-3">確認できた口コミのみを掲載する方針です。掲載準備を進めています。</p>
            )}
            {seo.googleReviewUrl && (
              <div className="mt-5"><a className="footer-link" href={seo.googleReviewUrl} target="_blank" rel="noopener noreferrer">Googleの口コミを見る →</a></div>
            )}
          </section>

          <h2 className="mt-12 text-2xl font-bold">ご相談が多い周辺地域</h2>
          <p className="lead mt-3">商圏確認後に調整できるよう、地域情報は設定ファイルで管理しています。</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {store.serviceAreas.map((area) => <span className="rounded-full bg-white/10 px-4 py-2" key={area}>{area}</span>)}
          </div>
        </div>
      </section>
      <CTA title={`${store.name}へ写真で相談する`} />
    </main>
  );
}
