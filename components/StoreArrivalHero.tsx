'use client';

import Link from 'next/link';
import { useState } from 'react';
import { stores } from '@/data/site';

type StoreId = (typeof stores)[number]['id'];

const storeBackdrops: Record<StoreId, string> = {
  hitachi: '#ffd84d',
  hokota: '#42d9ff',
};

export function StoreArrivalHero() {
  const [storeId, setStoreId] = useState<StoreId | null>(null);
  const selectedStore = stores.find((store) => store.id === storeId);
  const backdrop = selectedStore ? storeBackdrops[selectedStore.id] : '#b6ff3b';

  return (
    <section className="relative isolate overflow-hidden bg-[#fffaf0] text-black">

      <style dangerouslySetInnerHTML={{ __html: `
        .arrival-scene{opacity:0;transform:translateY(24px);transition:opacity .35s ease,transform .35s ease}.arrival-scene.is-active{opacity:1;transform:translateY(0)}.arrival-road{position:absolute;inset:auto -8% 0;height:46%;background:#fff;border-top:3px solid #000}.arrival-garage{position:absolute;right:9%;bottom:30%;width:min(360px,32vw);height:170px;border:3px solid #000;border-radius:0;background:#ff4fb8;box-shadow:4px 4px 0 #000}.arrival-sign{position:absolute;left:50%;top:18px;transform:translateX(-50%);white-space:nowrap;border:3px solid #000;padding:.35rem .8rem;background:#fff;color:#111;font-size:.74rem;font-weight:900;letter-spacing:.08em;box-shadow:3px 3px 0 #000}.arrival-light{position:absolute;top:66px;width:62px;height:62px;border:3px solid #000;border-radius:0;background:#ffd84d;opacity:0}.arrival-light-left{left:44px}.arrival-light-right{right:44px}.arrival-shutter{position:absolute;left:50%;bottom:0;width:48%;height:82px;transform:translateX(-50%);border:3px solid #000;border-bottom:0;border-radius:0;background:repeating-linear-gradient(180deg,#fff,#fff 8px,#111 8px,#111 11px)}.arrival-car{position:absolute;left:7%;bottom:22%;width:168px;height:58px;transform:translateX(-28vw) scale(.92);opacity:0}.arrival-car-body{position:absolute;inset:9px 0 10px;border:3px solid #000;border-radius:0;background:#42d9ff;box-shadow:4px 4px 0 #000}.arrival-wheel{position:absolute;bottom:0;width:28px;height:28px;border-radius:999px;border:6px solid #111;background:#b6ff3b}.arrival-wheel-left{left:26px}.arrival-wheel-right{right:28px}.arrival-headlight{position:absolute;right:-10px;top:25px;width:44px;height:12px;border:3px solid #000;background:#ffd84d}.arrival-scene.is-active .arrival-car{animation:arrival-drive 1.45s cubic-bezier(.2,.8,.25,1) forwards}.arrival-scene.is-active .arrival-light{animation:arrival-lights .9s ease .75s forwards}.arrival-scene.is-active .arrival-shutter{animation:arrival-shutter .9s ease .72s forwards}@keyframes arrival-drive{0%{transform:translateX(-28vw) scale(.92);opacity:0}20%{opacity:1}72%{transform:translateX(42vw) scale(1);opacity:1}100%{transform:translateX(56vw) scale(.82);opacity:1}}@keyframes arrival-lights{0%{opacity:0;transform:scale(.72)}100%{opacity:1;transform:scale(1)}}@keyframes arrival-shutter{0%{height:82px}100%{height:52px}}@media(prefers-reduced-motion:reduce){.arrival-scene,.arrival-scene.is-active .arrival-car,.arrival-scene.is-active .arrival-light,.arrival-scene.is-active .arrival-shutter{animation:none;transition:none}.arrival-scene.is-active{opacity:1}.arrival-scene.is-active .arrival-car{opacity:1;transform:translateX(56vw) scale(.82)}}
      ` }} />
      <div className="absolute inset-0 border-y-[3px] border-black opacity-100 transition duration-500" style={{ background: backdrop }} />
      <ArrivalScene isActive={Boolean(selectedStore)} storeName={selectedStore?.name} />

      <div className="container relative flex min-h-[calc(100svh-4rem)] flex-col justify-center py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="eyebrow">ステップ1 / 店舗を選ぶ</p>
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
                className={`group min-h-64 border-[3px] border-black p-6 text-left text-black shadow-[4px_4px_0_#000] transition duration-300 active:translate-x-1 active:translate-y-1 active:shadow-none md:p-8 ${isActive ? 'bg-[#ff4fb8]' : 'bg-white hover:bg-[#ffd84d]'}`}
              >
                <span className="eyebrow">{store.area}エリア</span>
                <strong className="mt-5 block text-3xl font-black md:text-4xl">{store.name}</strong>
                <span className="lead mt-4 block max-w-xl">{store.serviceAreas.join('・')}周辺の方はこちら。</span>
                <span className="mt-8 inline-flex border-[3px] border-black bg-[#b6ff3b] px-5 py-2 text-sm font-black text-black shadow-[4px_4px_0_#000] transition">
                  {isActive ? '選択中' : 'この店舗を選ぶ'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 min-h-28 max-w-3xl border-[3px] border-black bg-white p-6 text-black shadow-[4px_4px_0_#000]">
          {selectedStore ? (
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="eyebrow">選択中の店舗</p>
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
              <p className="eyebrow">ここでの目的</p>
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
