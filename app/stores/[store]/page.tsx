import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CTA, JsonLd } from '@/components/ui';
import { site, stores } from '@/data/site';

const hitachiImages = [
  {
    src: '/images/stores/hitachi/exterior-front.svg',
    alt: 'THE REVENANT日立店の正面外観',
  },
  {
    src: '/images/stores/hitachi/exterior-parking.svg',
    alt: '駐車場から見たTHE REVENANT日立店の外観',
  },
  {
    src: '/images/stores/hitachi/interior.svg',
    alt: 'THE REVENANT日立店の明るい商談スペース',
  },
];

export function generateStaticParams() {
  return stores.map((store) => ({ store: store.id }));
}

export function generateMetadata({ params }: { params: { store: string } }): Metadata {
  const store = stores.find((item) => item.id === params.store);
  if (!store) return {};
  return {
    title: store.title,
    description: store.description,
    alternates: { canonical: store.slug },
  };
}

export default function StorePage({ params }: { params: { store: string } }) {
  const store = stores.find((item) => item.id === params.store);
  if (!store) notFound();

  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AutoRepair',
          name: `${site.name} ${store.name}`,
          address: store.address,
          telephone: store.phone,
          url: site.baseUrl + store.slug,
          areaServed: store.serviceAreas,
        }}
      />
      <section className="section">
        <div className="container">
          <p className="eyebrow">{store.area} car coating</p>
          <h1 className="mt-3 text-4xl font-black">{store.title}</h1>
          <p className="lead mt-5 max-w-3xl">{store.description}</p>

          {store.id === 'hitachi' && (
            <section className="mt-10" aria-labelledby="store-gallery-title">
              <h2 id="store-gallery-title" className="text-2xl font-bold">日立店のご案内</h2>
              <p className="lead mt-3">店舗の外観と店内の様子をご覧いただけます。</p>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {hitachiImages.map((image, index) => (
                  <figure
                    className={`overflow-hidden rounded-2xl border border-white/10 bg-black ${index === 2 ? 'md:col-span-2' : ''}`}
                    key={image.src}
                  >
                    <Image
                      className={`h-auto w-full object-cover ${index < 2 ? 'aspect-[4/3]' : 'aspect-[2/1]'}`}
                      src={image.src}
                      alt={image.alt}
                      width={index === 2 ? 1864 : 1456}
                      height={index === 2 ? 840 : 1090}
                      sizes={index === 2 ? '(min-width: 768px) 1200px, 100vw' : '(min-width: 768px) 600px, 100vw'}
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
            </dl>
          </div>
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
