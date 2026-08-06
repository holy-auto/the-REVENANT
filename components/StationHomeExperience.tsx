import Image from 'next/image';
import Link from 'next/link';
import { stores } from '@/data/site';

type StoreId = (typeof stores)[number]['id'];

const storeVisuals: Record<StoreId, { image: string; catchcopy: string }> = {
  hitachi: {
    image: '/images/stores/hitachi/exterior-front.svg',
    catchcopy: '磨きの仕上がりまで、じっくり相談。',
  },
  hokota: {
    image: '/images/hero.svg',
    catchcopy: '毎日の乗り方に合う、愛車の守り方。',
  },
};

export function StationHomeExperience() {
  return (
    <section className="station-journey" aria-labelledby="station-title">
      <h1 id="station-title" className="sr-only">相談する店舗を選ぶ</h1>
      <div className="store-doors" aria-label="相談する店舗を選ぶ">
        {stores.map((store, index) => {
          const visual = storeVisuals[store.id];

          return (
            <Link
              className={`store-door store-door-${store.id}`}
              href={store.slug}
              key={store.id}
            >
              <Image
                src={visual.image}
                alt=""
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="store-door-image"
              />
              <span className="store-door-shade" />
              <span className="door-number">0{index + 1}</span>
              <span className="door-copy">
                <small>{store.area} / CAR DETAILING</small>
                <strong>{store.name}</strong>
                <em>{visual.catchcopy}</em>
              </span>
              <span className="door-enter">この店舗を選ぶ <b aria-hidden="true">→</b></span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
