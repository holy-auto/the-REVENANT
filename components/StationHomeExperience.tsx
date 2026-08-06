'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { menus, site, stores } from '@/data/site';

type StoreId = (typeof stores)[number]['id'];

const storeVisuals: Record<StoreId, { image: string; catchcopy: string; features: string[] }> = {
  hitachi: {
    image: '/images/stores/hitachi/exterior-front.svg',
    catchcopy: '磨きの仕上がりまで、じっくり相談。',
    features: ['日立市を中心に県北エリアからアクセス', '状態を見極める研磨・下地処理', '施工後のメンテナンスまでサポート'],
  },
  hokota: {
    image: '/images/hero.svg',
    catchcopy: '毎日の乗り方に合う、愛車の守り方。',
    features: ['鉾田市を中心に鹿行エリアからアクセス', '保管環境に合わせたコーティング提案', '写真から気軽に事前相談'],
  },
};

export function StationHomeExperience() {
  const [storeId, setStoreId] = useState<StoreId | null>(null);
  const [menuName, setMenuName] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);
  const store = stores.find((item) => item.id === storeId);

  useEffect(() => {
    if (!menuName) return;
    setSimulating(true);
    const timer = window.setTimeout(() => setSimulating(false), 1100);
    return () => window.clearTimeout(timer);
  }, [menuName]);

  const reset = () => {
    setStoreId(null);
    setMenuName(null);
    setSimulating(false);
  };

  return (
    <section className="station-journey" aria-labelledby="station-title">
      <div className="journey-topbar">
        <p><span>IBARAKI</span> CAR CARE STATION</p>
        <p>SELECT YOUR GARAGE <b>→</b></p>
      </div>

      <div className={`journey-stage ${store ? 'is-inside' : ''}`}>
        <div className="journey-heading">
          <p className="journey-kicker">THE REVENANT / HITACHI &amp; HOKOTA</p>
          <h1 id="station-title">愛車のための場所へ、<br />一歩すすむ。</h1>
          <p>まずはお近くの店舗を選んでください。店内を進むように、施工メニューと相談方法をご案内します。</p>
        </div>

        <div className="store-doors" aria-label="店舗を選ぶ">
          {stores.map((item, index) => {
            const visual = storeVisuals[item.id];
            return (
              <button
                type="button"
                className={`store-door store-door-${item.id} ${storeId === item.id ? 'is-selected' : ''}`}
                onClick={() => { setStoreId(item.id); setMenuName(null); }}
                key={item.id}
              >
                <Image src={visual.image} alt="" fill priority={index === 0} sizes="(min-width: 768px) 50vw, 100vw" className="store-door-image" />
                <span className="store-door-shade" />
                <span className="door-number">0{index + 1}</span>
                <span className="door-copy">
                  <small>{item.area} / CAR DETAILING</small>
                  <strong>{item.name}</strong>
                  <em>{visual.catchcopy}</em>
                </span>
                <span className="door-enter">この店舗へ入る <b>→</b></span>
              </button>
            );
          })}
        </div>

        {store && (
          <div className="inside-panel" aria-live="polite">
            <div className="inside-nav">
              <button type="button" onClick={reset} aria-label="店舗選択に戻る">← 店舗を選び直す</button>
              <span>01 店舗選択</span><b>—</b><span className="active">02 メニュー</span><b>—</b><span>03 相談</span>
            </div>
            <div className="inside-grid">
              <div className="store-intro">
                <p className="journey-kicker">WELCOME TO {store.name}</p>
                <h2>{store.name}で、<br />できること。</h2>
                <ul>{storeVisuals[store.id].features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul>
                <Link href={store.slug}>店舗情報を詳しく見る →</Link>
              </div>
              <div className="menu-selector">
                <p className="menu-guide">気になる作業を選ぶと、相談内容をシミュレーションします。</p>
                <div className="menu-options">
                  {menus.map((menu, index) => (
                    <button type="button" key={menu.slug} onClick={() => setMenuName(menu.name)} className={menuName === menu.name ? 'active' : ''}>
                      <span>0{index + 1}</span><strong>{menu.name}</strong><b>＋</b>
                    </button>
                  ))}
                </div>
                {menuName && (
                  <div className={`simulation-result ${simulating ? 'is-loading' : ''}`}>
                    {simulating ? <><i /><p>愛車に合う相談プランを組み立てています…</p></> : <>
                      <small>SIMULATION COMPLETE</small>
                      <h3>{store.name} × {menuName}</h3>
                      <p>車種・年式・気になる箇所の写真があると、よりスムーズにご案内できます。正式な施工内容と料金は、車両の状態を確認してお伝えします。</p>
                      <div><a href={site.lineUrl} className="contact-line">LINEで写真相談 ↗</a><a href={site.instagramUrl} className="contact-instagram">Instagramで相談 ↗</a></div>
                    </>}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {!store && <a className="journey-scroll" href="#stores"><span>SCROLL</span><i /></a>}
    </section>
  );
}
