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

      <style dangerouslySetInnerHTML={{ __html: `
        .arrival-scene{opacity:0;transform:translateY(24px);transition:opacity .35s ease,transform .35s ease}.arrival-scene.is-active{opacity:1;transform:translateY(0)}.arrival-road{position:absolute;inset:auto -8% 0;height:46%;background:linear-gradient(90deg,transparent,rgba(246,240,230,.16),transparent),linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,.02));clip-path:polygon(38% 0,62% 0,100% 100%,0 100%)}.arrival-garage{position:absolute;right:9%;bottom:30%;width:min(360px,32vw);height:170px;border:1px solid rgba(246,240,230,.18);border-radius:28px 28px 12px 12px;background:linear-gradient(180deg,rgba(246,240,230,.10),rgba(17,17,17,.82));box-shadow:0 24px 80px rgba(0,0,0,.45)}.arrival-sign{position:absolute;left:50%;top:18px;transform:translateX(-50%);white-space:nowrap;border:1px solid rgba(200,155,120,.45);border-radius:999px;padding:.35rem .8rem;color:#f6f0e6;font-size:.74rem;font-weight:800;letter-spacing:.08em}.arrival-light{position:absolute;top:66px;width:62px;height:62px;border-radius:999px;background:rgba(200,155,120,.28);filter:blur(10px);opacity:0}.arrival-light-left{left:44px}.arrival-light-right{right:44px}.arrival-shutter{position:absolute;left:50%;bottom:0;width:48%;height:82px;transform:translateX(-50%);border:1px solid rgba(246,240,230,.16);border-bottom:0;border-radius:16px 16px 0 0;background:repeating-linear-gradient(180deg,rgba(246,240,230,.16),rgba(246,240,230,.16) 2px,rgba(17,17,17,.16) 2px,rgba(17,17,17,.16) 13px)}.arrival-car{position:absolute;left:7%;bottom:22%;width:168px;height:58px;transform:translateX(-28vw) scale(.92);opacity:0}.arrival-car-body{position:absolute;inset:9px 0 10px;border-radius:32px 48px 18px 18px;background:linear-gradient(90deg,#5e151a,#a33d37 58%,#c89b78);box-shadow:0 16px 34px rgba(0,0,0,.38)}.arrival-wheel{position:absolute;bottom:0;width:28px;height:28px;border-radius:999px;border:6px solid #111;background:#c89b78}.arrival-wheel-left{left:26px}.arrival-wheel-right{right:28px}.arrival-headlight{position:absolute;right:-10px;top:25px;width:44px;height:12px;border-radius:999px;background:linear-gradient(90deg,rgba(246,240,230,.88),transparent);filter:blur(2px)}.arrival-scene.is-active .arrival-car{animation:arrival-drive 1.45s cubic-bezier(.2,.8,.25,1) forwards}.arrival-scene.is-active .arrival-light{animation:arrival-lights .9s ease .75s forwards}.arrival-scene.is-active .arrival-shutter{animation:arrival-shutter .9s ease .72s forwards}@keyframes arrival-drive{0%{transform:translateX(-28vw) scale(.92);opacity:0}20%{opacity:1}72%{transform:translateX(42vw) scale(1);opacity:1}100%{transform:translateX(56vw) scale(.82);opacity:.18}}@keyframes arrival-lights{0%{opacity:0;transform:scale(.72)}100%{opacity:1;transform:scale(1.18)}}@keyframes arrival-shutter{0%{height:82px}100%{height:52px}}@media(prefers-reduced-motion:reduce){.arrival-scene,.arrival-scene.is-active .arrival-car,.arrival-scene.is-active .arrival-light,.arrival-scene.is-active .arrival-shutter{animation:none;transition:none}.arrival-scene.is-active{opacity:1}.arrival-scene.is-active .arrival-car{opacity:.18;transform:translateX(56vw) scale(.82)}}
      ` }} />
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
