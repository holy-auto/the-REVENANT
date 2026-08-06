import Image from 'next/image';
import Link from 'next/link';
import { stores } from '@/data/site';

const storeVisuals = {
  hitachi: {
    image: '/images/stores/hitachi/exterior-front.svg',
    position: 'object-center',
    tint: 'from-black/20 via-black/45 to-black/90',
  },
  hokota: {
    image: null,
    position: '',
    tint: 'from-[#14201b]/20 via-[#101a16]/55 to-black/95',
  },
} as const;

export function HomeExperience() {
  return (
    <section className="relative isolate bg-black" aria-labelledby="store-choice-title">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center px-5 pt-8 text-center md:pt-10">
        <div className="drop-shadow-[0_2px_12px_rgba(0,0,0,.85)]">
          <p className="eyebrow text-ivory/80">Choose your shop</p>
          <h1 id="store-choice-title" className="mt-2 text-2xl font-black text-white md:text-4xl">
            ご利用店舗をお選びください
          </h1>
        </div>
      </div>

      <div className="flex min-h-[calc(100svh-4rem)] flex-col md:flex-row">
        {stores.map((store, index) => {
          const visual = storeVisuals[store.id];
          return (
            <Link
              href={store.slug}
              key={store.id}
              aria-label={`${store.name}のページへ進む`}
              className={`group relative flex min-h-[50svh] flex-1 items-end overflow-hidden transition-[flex] duration-700 ease-out md:min-h-[calc(100svh-4rem)] md:hover:flex-[1.12] ${index === 0 ? 'border-b border-white/20 md:border-b-0 md:border-r' : ''}`}
            >
              {visual.image ? (
                <Image
                  src={visual.image}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className={`object-cover transition duration-700 ease-out group-hover:scale-105 ${visual.position}`}
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(200,155,120,.23),transparent_23%),linear-gradient(145deg,#263c32_0%,#101915_48%,#080a09_100%)] transition duration-700 group-hover:scale-105" />
              )}

              <div className={`absolute inset-0 bg-gradient-to-b ${visual.tint}`} />
              <div className="absolute inset-0 bg-black/10 transition duration-500 group-hover:bg-transparent" />

              <div className="relative z-10 w-full px-7 pb-10 pt-28 text-center md:px-10 md:pb-14">
                <p className="text-xs font-bold uppercase tracking-[.28em] text-bronze">{store.area}</p>
                <h2 className="mt-3 text-4xl font-black tracking-wide text-white md:text-6xl">{store.name}</h2>
                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-ivory/75 md:text-base">
                  {store.serviceAreas.slice(0, 3).join('・')}周辺の方はこちら
                </p>
                <span className="mt-7 inline-flex items-center gap-3 border-b border-white/60 pb-2 text-sm font-bold tracking-wide text-white transition group-hover:border-bronze group-hover:text-bronze">
                  この店舗を選ぶ
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-2">→</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="pointer-events-none absolute inset-x-0 bottom-4 z-20 hidden text-center text-xs tracking-widest text-ivory/50 md:block">
        SELECT A LOCATION
      </p>
    </section>
  );
}
