'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { faqs, menus, site } from '@/data/site';

type Phase = 'select' | 'inside';
type StoreId = 'hitachi' | 'hokota';

const doorVisuals: Record<StoreId, { image: string; catchcopy: string; area: string; name: string }> = {
  hitachi: {
    image: '/images/stores/hitachi/exterior-front.svg',
    catchcopy: '磨きの仕上がりまで、じっくり相談。',
    area: '日立市',
    name: '日立店',
  },
  hokota: {
    image: '/images/stores/hokota/exterior-front.svg',
    catchcopy: '毎日の乗り方に合う、愛車の守り方。',
    area: '鉾田市',
    name: '鉾田店',
  },
};

// トップビューでの店舗の並び順（左 → 右）。
const storeOrder: StoreId[] = ['hokota', 'hitachi'];

type HotspotId = 'menu' | 'price' | 'qa' | 'craft';

// 共通のポイント内容（ラベル・見出し）。座標・場所名は店舗ごとに設定。
const hotspotContent: Record<HotspotId, { label: string; kicker: string }> = {
  menu: { label: '施工メニュー', kicker: 'MENU' },
  price: { label: '価格シミュレーション', kicker: 'ESTIMATE' },
  qa: { label: 'Q&A', kicker: 'Q&A' },
  craft: { label: 'こだわり', kicker: 'CRAFT' },
};

type HotspotSpot = { id: HotspotId; x: number; y: number; spot: string };

// 店内画像上でのポイント配置（店舗ごとに画像が違うため位置を分ける）。
const hotspotLayout: Record<StoreId, HotspotSpot[]> = {
  hitachi: [
    { id: 'menu', x: 0.352, y: 0.47, spot: '棚・掲示ボード' },
    { id: 'price', x: 0.6, y: 0.505, spot: '受付カウンター' },
    { id: 'qa', x: 0.208, y: 0.62, spot: '商談テーブル' },
    { id: 'craft', x: 0.642, y: 0.26, spot: '壁の掲示' },
  ],
  hokota: [
    { id: 'menu', x: 0.378, y: 0.5, spot: '施工ガレージ' },
    { id: 'price', x: 0.607, y: 0.565, spot: '受付コンテナ' },
    { id: 'qa', x: 0.802, y: 0.565, spot: '保管ガレージ' },
    { id: 'craft', x: 0.232, y: 0.6, spot: '入口ゲート' },
  ],
};

const interiorScenes: Record<StoreId, { image: string; alt: string }> = {
  hitachi: {
    image: '/images/stores/hitachi/interior-scene.svg',
    alt: 'THE REVENANT日立店の店内。商談テーブル、受付カウンター、メニュー棚が見える。',
  },
  hokota: {
    image: '/images/stores/hokota/interior-scene.svg',
    alt: 'THE REVENANT鉾田店の敷地。施工ガレージ、受付コンテナ、保管ガレージが見える。',
  },
};

const ZOOM = 2.4;

export function StoreJourney() {
  const [phase, setPhase] = useState<Phase>('select');
  const [store, setStore] = useState<StoreId>('hitachi');
  const [entering, setEntering] = useState<StoreId | null>(null);
  const [active, setActive] = useState<HotspotId | null>(null);
  const [transform, setTransform] = useState('translate(0px, 0px) scale(1)');

  const stageRef = useRef<HTMLDivElement>(null);
  const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const computeTransform = useCallback(() => {
    const el = stageRef.current;
    if (!el) return;
    const spot = hotspotLayout[store].find((h) => h.id === active);
    if (!spot) {
      setTransform('translate(0px, 0px) scale(1)');
      return;
    }
    const { width: W, height: H } = el.getBoundingClientRect();
    const s = ZOOM;
    const fx = spot.x * W;
    const fy = spot.y * H;
    let tx = W / 2 - fx * s;
    let ty = H / 2 - fy * s;
    // Keep the scene covering the stage (no empty edges).
    tx = Math.min(0, Math.max(W - W * s, tx));
    ty = Math.min(0, Math.max(H - H * s, ty));
    setTransform(`translate(${tx}px, ${ty}px) scale(${s})`);
  }, [active, store]);

  useEffect(() => {
    computeTransform();
  }, [computeTransform]);

  useEffect(() => {
    const onResize = () => computeTransform();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [computeTransform]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (active) setActive(null);
      else if (phase === 'inside') backToSelect();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, phase]);

  useEffect(() => {
    return () => {
      if (enterTimer.current) clearTimeout(enterTimer.current);
    };
  }, []);

  function enterStore(id: StoreId) {
    setEntering(id);
    if (enterTimer.current) clearTimeout(enterTimer.current);
    enterTimer.current = setTimeout(() => {
      setStore(id);
      setActive(null);
      setPhase('inside');
      setEntering(null);
    }, 720);
  }

  function backToSelect() {
    setActive(null);
    setPhase('select');
  }

  if (phase === 'select') {
    return (
      <section className="station-journey" aria-labelledby="journey-title">
        <div className="journey-topbar">
          <p>THE REVENANT / STORE ENTRANCE</p>
          <p>2 STORES ・ <span>相談したい店舗を選ぶ</span></p>
        </div>
        <div className="journey-heading" aria-hidden={entering ? 'true' : undefined}>
          <p className="journey-kicker">CAR COATING &amp; DETAILING</p>
          <h1 id="journey-title">ようこそ、<br />愛車のかかりつけ店へ。</h1>
          <p>店舗を選ぶと、そのまま店内へ。メニューや料金の相談を、来店した感覚でご覧いただけます。</p>
        </div>
        <div className="store-doors" aria-label="相談する店舗を選ぶ">
          {storeOrder.map((id, index) => {
            const v = doorVisuals[id];
            const isEntering = entering === id;
            const isDimmed = entering !== null && entering !== id;
            return (
              <button
                type="button"
                key={id}
                className={`store-door store-door-${id}${isEntering ? ' is-entering' : ''}${isDimmed ? ' is-dimmed' : ''}`}
                onClick={() => enterStore(id)}
                aria-label={`${v.name}の店内に入る`}
                disabled={entering !== null}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="store-door-image" src={v.image} alt="" />
                <span className="store-door-shade" />
                <span className="door-number">0{index + 1}</span>
                <span className="door-copy">
                  <small>{v.area} / CAR DETAILING</small>
                  <strong>{v.name}</strong>
                  <em>{v.catchcopy}</em>
                </span>
                <span className="door-enter">
                  この店舗に入る <b aria-hidden="true">→</b>
                </span>
                {isEntering && <span className="door-entering">OPEN…</span>}
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  const current = doorVisuals[store];

  return (
    <section className="station-journey" aria-label={`${current.name}の店内`}>
      <div className="sj-inside">
        <div className="sj-topbar">
          <button type="button" className="sj-back" onClick={backToSelect}>
            ← 店舗選択にもどる
          </button>
          <span className="sj-store-name">{current.name} / IN-STORE</span>
          <Link className="sj-back sj-back-store" href={`/stores/${store}`}>
            店舗ページ
          </Link>
        </div>

        <div className="sj-stage" ref={stageRef}>
          <div className="sj-view" style={{ transform }} data-zoomed={active ? 'true' : 'false'}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="sj-scene"
              src={interiorScenes[store].image}
              alt={interiorScenes[store].alt}
            />
            {hotspotLayout[store].map((h) => {
              const content = hotspotContent[h.id];
              return (
                <button
                  type="button"
                  key={h.id}
                  className={`sj-hotspot sj-hotspot-${h.id}`}
                  style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%` }}
                  onClick={() => setActive(h.id)}
                  aria-label={`${content.label}を見る（${h.spot}）`}
                >
                  <span className="sj-hotspot-dot" aria-hidden="true">
                    +
                  </span>
                  <span className="sj-hotspot-label">{content.label}</span>
                </button>
              );
            })}
          </div>

          {!active && (
            <p className="sj-guide">
              気になる場所をタップすると、そこへ近づいて相談内容が開きます。
            </p>
          )}

          {active && <HotspotPanel id={active} onClose={() => setActive(null)} />}
        </div>
      </div>
    </section>
  );
}

function HotspotPanel({
  id,
  onClose,
}: {
  id: HotspotId;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const meta = hotspotContent[id];

  useEffect(() => {
    const t = setTimeout(() => closeRef.current?.focus(), 480);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="sj-panel" role="dialog" aria-modal="false" aria-labelledby="sj-panel-title">
      <button type="button" ref={closeRef} className="sj-panel-close" onClick={onClose} aria-label="店内にもどる">
        ×
      </button>
      <p className="sj-panel-kicker">{meta.kicker}</p>
      <h2 id="sj-panel-title">{meta.label}</h2>

      {id === 'menu' && <MenuContent />}
      {id === 'price' && <PriceSimulator />}
      {id === 'qa' && <QaContent />}
      {id === 'craft' && <CraftContent />}

      <button type="button" className="sj-room-back" onClick={onClose}>
        ← 店内を見わたす
      </button>
    </section>
  );
}

function MenuContent() {
  return (
    <>
      <p className="sj-lead">状態と使い方に合わせて、必要な施工だけをご提案します。気になるメニューから相談できます。</p>
      <ul className="sj-menu-list">
        {menus.map((m) => (
          <li key={m.slug}>
            <Link href={m.slug}>
              <strong>{m.name}</strong>
              <span>{m.summary}</span>
              <em>{m.price}</em>
            </Link>
          </li>
        ))}
      </ul>
      <div className="sj-cta-row">
        <Link className="btn btn-primary" href="/prices">
          料金の考え方を見る
        </Link>
      </div>
    </>
  );
}

type Size = 'S' | 'M' | 'L' | 'XL';
type Service = 'coating' | 'polish' | 'wash';

const sizeOptions: { id: Size; label: string; note: string }[] = [
  { id: 'S', label: '軽・コンパクト', note: '軽自動車 / コンパクトカー' },
  { id: 'M', label: '普通車・小型SUV', note: 'セダン / ミドルサイズ' },
  { id: 'L', label: 'ミニバン・大型SUV', note: 'アルファード級 など' },
  { id: 'XL', label: '特大・輸入車', note: '大型車 / 一部輸入車' },
];

const serviceOptions: { id: Service; label: string; desc: string; menu: string }[] = [
  { id: 'coating', label: '新車コーティング', desc: '塗装を守る保護施工', menu: '/menus/coating' },
  { id: 'polish', label: '経年車 研磨＋コーティング', desc: '洗車傷・くすみを整えて保護', menu: '/menus/polishing' },
  { id: 'wash', label: 'メンテナンス・手洗い洗車', desc: 'きれいを保つお手入れ', menu: '/menus/maintenance' },
];

// 目安レンジ（円）。正式金額は車種・塗装状態・希望内容の確認後にご案内。
const priceTable: Record<Service, Record<Size, [number, number]>> = {
  coating: { S: [55000, 70000], M: [70000, 90000], L: [90000, 120000], XL: [120000, 150000] },
  polish: { S: [80000, 110000], M: [110000, 150000], L: [150000, 200000], XL: [200000, 260000] },
  wash: { S: [4000, 8000], M: [6000, 10000], L: [8000, 13000], XL: [10000, 16000] },
};

const yen = (n: number) => `¥${n.toLocaleString('ja-JP')}`;

function PriceSimulator() {
  const [size, setSize] = useState<Size | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const range = size && service ? priceTable[service][size] : null;
  const svcMeta = serviceOptions.find((s) => s.id === service);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (size && service) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [size, service]);

  return (
    <>
      <p className="sj-lead">車格とご希望の施工を選ぶと、目安の価格帯が出ます。正式なお見積りは無料の写真相談で。</p>

      <p className="sj-field-label">1. 車格を選ぶ</p>
      <div className="sj-choice-grid">
        {sizeOptions.map((o) => (
          <button
            type="button"
            key={o.id}
            className={`sj-choice${size === o.id ? ' is-on' : ''}`}
            onClick={() => setSize(o.id)}
            aria-pressed={size === o.id}
          >
            <strong>{o.label}</strong>
            <span>{o.note}</span>
          </button>
        ))}
      </div>

      <p className="sj-field-label">2. 施工内容を選ぶ</p>
      <div className="sj-choice-grid sj-choice-grid-1">
        {serviceOptions.map((o) => (
          <button
            type="button"
            key={o.id}
            className={`sj-choice${service === o.id ? ' is-on' : ''}`}
            onClick={() => setService(o.id)}
            aria-pressed={service === o.id}
          >
            <strong>{o.label}</strong>
            <span>{o.desc}</span>
          </button>
        ))}
      </div>

      <div className="sj-result" aria-live="polite" ref={resultRef}>
        {range ? (
          <>
            <small>目安価格帯（税込・参考）</small>
            <p className="sj-price">
              {yen(range[0])} <span>〜</span> {yen(range[1])}
            </p>
            <p className="sj-note">
              {svcMeta?.label}／{sizeOptions.find((s) => s.id === size)?.label}の目安です。
              塗装状態・保管環境・ご希望内容により変わります。正式金額は確認後にご案内します。
            </p>
            <div className="sj-cta-row">
              <Link className="btn btn-primary" href="/contact">
                この内容で写真相談（無料）
              </Link>
              {svcMeta && (
                <Link className="btn" href={svcMeta.menu}>
                  メニュー詳細
                </Link>
              )}
            </div>
          </>
        ) : (
          <p className="sj-result-empty">車格と施工内容を選ぶと、目安が表示されます。</p>
        )}
      </div>
    </>
  );
}

function QaContent() {
  return (
    <>
      <p className="sj-lead">来店前の「これ聞いていいのかな？」も大丈夫。よくいただくご質問です。</p>
      <div className="sj-qa">
        {faqs.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
      <div className="sj-cta-row">
        <Link className="btn btn-primary" href="/faq">
          よくある質問をもっと見る
        </Link>
      </div>
    </>
  );
}

function CraftContent() {
  return (
    <>
      <p className="sj-lead">{site.concept}</p>
      <ul className="sj-craft">
        <li>
          <strong>必要な施工だけ</strong>
          <span>過剰なメニューではなく、車の状態・保管環境・予算に合う守り方を一緒に考えます。</span>
        </li>
        <li>
          <strong>写真から相談できる入口</strong>
          <span>専門用語を前提にせず、気になる部分の写真から状態を確認してご案内します。</span>
        </li>
        <li>
          <strong>施工後まで見据えて</strong>
          <span>仕上げて終わりではなく、きれいを保つ洗車やメンテナンスまで相談できます。</span>
        </li>
      </ul>
      <div className="sj-cta-row">
        <Link className="btn btn-primary" href="/about">
          お店の考え方を見る
        </Link>
      </div>
    </>
  );
}
