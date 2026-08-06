import Image from 'next/image';
import Link from 'next/link';
import { site, stores } from '@/data/site';

const primaryStore = stores[0];
const secondaryStore = stores[1];

export function StationHomeExperience() {
  return (
    <section className="revenant-station min-h-[calc(100svh-4rem)] bg-[#0878e8] p-4 text-white md:p-7" aria-labelledby="station-title">
      <div className="relative mx-auto flex min-h-[calc(100svh-6.5rem)] max-w-[1880px] flex-col overflow-hidden rounded-[2.2rem] border-[14px] border-[#0878e8] bg-[#0878e8]">
        <div className="relative flex-1 overflow-hidden rounded-[1.65rem] border-[3px] border-[#101010] bg-[#fff7e8] shadow-[0_22px_50px_rgba(0,30,80,.34)]">
          <Image
            src="/images/hero.svg"
            alt="THE REVENANTのガレージをイメージしたメインビジュアル"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />

          <Link
            href="/"
            className="absolute left-1/2 top-6 z-10 -translate-x-1/2 bg-[#e51b23] px-4 py-2 text-center text-xl font-black leading-none tracking-[-.08em] text-white shadow-[4px_4px_0_#101010] md:text-3xl"
            aria-label={`${site.name} ホーム`}
          >
            THE<br />REVENANT
          </Link>

          <div className="absolute left-6 top-6 z-10 hidden max-w-xs rounded-full border-[3px] border-[#101010] bg-[#ffe900] px-5 py-3 text-sm font-black text-[#101010] shadow-[4px_4px_0_#101010] md:block">
            茨城の愛車磨きステーション
          </div>

          <div className="absolute bottom-8 left-1/2 z-10 w-[min(920px,calc(100%-2rem))] -translate-x-1/2 rounded-[1.75rem] border-[3px] border-[#101010] bg-white/95 p-5 text-[#101010] shadow-[6px_6px_0_#101010] md:p-7">
            <p className="text-sm font-black uppercase tracking-[.18em] text-[#e51b23]">Garage coating / polishing</p>
            <h1 id="station-title" className="mt-2 text-4xl font-black leading-none md:text-7xl">
              愛車を、近くの店舗で相談。
            </h1>
            <p className="mt-4 max-w-2xl text-base font-bold leading-8 md:text-lg">
              日立店・鉾田店から選んで、コーティング・車磨き・メンテナンスを写真から気軽に相談できます。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="btn btn-primary" href={primaryStore.slug}>{primaryStore.name}へ進む</Link>
              <Link className="btn btn-sub" href={secondaryStore.slug}>{secondaryStore.name}へ進む</Link>
              <Link className="btn bg-white !text-[#101010]" href="/contact">写真で相談</Link>
            </div>
          </div>
        </div>

        <div className="grid min-h-20 grid-cols-[1fr_auto_1fr] items-center gap-4 px-3 py-4 text-[#ffe900] md:px-8">
          <Link href="/menus/coating" className="justify-self-start text-xl font-black uppercase tracking-tight md:text-3xl">
            MENU
          </Link>
          <Link href="#stores" className="flex w-40 flex-col gap-2" aria-label="店舗一覧へ移動">
            <span className="h-1 rounded-full bg-white" />
            <span className="h-1 rounded-full bg-white" />
            <span className="h-1 rounded-full bg-white" />
          </Link>
          <Link href="/first-time" className="justify-self-end text-xl font-black uppercase tracking-tight md:text-3xl">
            はじめて
          </Link>
        </div>
      </div>
    </section>
  );
}
