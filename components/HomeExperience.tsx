'use client';

import Link from 'next/link';
import { useState } from 'react';
import { stores } from '@/data/site';

type StoreId = (typeof stores)[number]['id'];

const storeBackdrops: Record<StoreId, string> = {
  hitachi: 'linear-gradient(135deg, rgba(17,17,17,.95), rgba(106,38,42,.48)), radial-gradient(circle at 76% 32%, rgba(200,155,120,.34), transparent 28%), linear-gradient(120deg, #241f1c, #111)',
  hokota: 'linear-gradient(135deg, rgba(17,17,17,.95), rgba(34,49,43,.58)), radial-gradient(circle at 24% 30%, rgba(200,155,120,.30), transparent 28%), linear-gradient(120deg, #141817, #111)',
};

export function HomeExperience() {
  const [storeId, setStoreId] = useState<StoreId | null>(null);
  const selectedStore = stores.find((store) => store.id === storeId);
  const backdrop = selectedStore ? storeBackdrops[selectedStore.id] : 'linear-gradient(135deg, rgba(17,17,17,.96), rgba(106,38,42,.46)), radial-gradient(circle at 50% 22%, rgba(200,155,120,.28), transparent 30%), #111';

  return (
    <section className="relative isolate overflow-hidden bg-black">
      <div className="absolute inset-0 opacity-85 transition duration-500" style={{ background: backdrop }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_58%,rgba(246,240,230,.10),transparent_24%)]" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <ArrivalScene isActive={Boolean(selectedStore)} storeName={selectedStore?.name} />

      <div className="container relative flex min-h-[calc(100svh-4rem)] flex-col justify-center py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="eyebrow">Step 1 / Choose your garage</p>
          <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">まずは近い店舗を選んでください</h1>
          <p className="lead mt-5 max-w-2xl text-lg">ファーストビューでは選択肢を2つに絞り、日立店・鉾田店のどちらへ進むかだけにフォーカスします。</p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {stores.map((store) => {
            const isActive = store.id === storeId;
            return (
              <button
                key={store.id}
                type="button"
                onClick={() => setStoreId(store.id)}
                className={`group min-h-64 rounded-[2rem] border p-6 text-left transition duration-300 md:p-8 ${isActive ? 'border-bronze bg-bronze/18 shadow-2xl shadow-bronze/10' : 'border-white/12 bg-white/7 hover:border-bronze/70 hover:bg-white/10'}`}
              >
                <span className="eyebrow">{store.area} area</span>
                <strong className="mt-5 block text-3xl font-black md:text-4xl">{store.name}</strong>
                <span className="lead mt-4 block max-w-xl">{store.serviceAreas.join('・')}周辺の方はこちら。</span>
                <span className="mt-8 inline-flex rounded-full border border-white/20 px-5 py-2 text-sm font-bold text-ivory transition group-hover:border-bronze">
                  {isActive ? '選択中' : 'この店舗を選ぶ'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 min-h-28 max-w-3xl rounded-[2rem] border border-white/10 bg-ink/72 p-6 backdrop-blur">
          {selectedStore ? (
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="eyebrow">Selected garage</p>
                <h2 className="mt-2 text-2xl font-bold">{selectedStore.name}の雰囲気を見ながら、次のステップへ進めます</h2>
                <p className="lead mt-3">次はメニュー・概算シミュレーションを別セクションで表示し、必要な情報だけを順番に開いていきます。</p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Link className="btn btn-primary" href={`${selectedStore.slug}#menu`}>この店舗で進む</Link>
                <Link className="btn btn-sub" href={`/contact?store=${selectedStore.id}`}>先に相談する</Link>
              </div>
            </div>
          ) : (
            <div>
              <p className="eyebrow">Focus</p>
              <h2 className="mt-2 text-2xl font-bold">まだメニューや料金は出しません</h2>
              <p className="lead mt-3">最初の目的は、ユーザーに「自分が向かう店舗」を迷わず選んでもらうことです。</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ArrivalScene({ isActive, storeName }: { isActive: boolean; storeName?: string }) {
  return (
    <div className={`arrival-scene pointer-events-none absolute inset-x-0 bottom-0 hidden h-80 md:block ${isActive ? 'is-active' : ''}`} aria-hidden="true">
      <div className="arrival-road" />
      <div className="arrival-garage">
        <span className="arrival-sign">{storeName ?? 'THE REVENANT'}</span>
        <span className="arrival-light arrival-light-left" />
        <span className="arrival-light arrival-light-right" />
        <span className="arrival-shutter" />
      </div>
      <div className="arrival-car">
        <span className="arrival-car-body" />
        <span className="arrival-wheel arrival-wheel-left" />
        <span className="arrival-wheel arrival-wheel-right" />
        <span className="arrival-headlight" />
      </div>
    </div>
  );
}
